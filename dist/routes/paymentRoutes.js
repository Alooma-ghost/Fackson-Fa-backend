"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataService_1 = require("../config/dataService");
const emailService_1 = require("../services/emailService");
const router = (0, express_1.Router)();
const EXPECTED_CURRENCY = 'NGN';
const EXPECTED_AMOUNT = Number(process.env.ACADEMY_REGISTRATION_FEE) || 25000;
/**
 * POST /api/payment/verify
 * Critical server-side verification of Flutterwave transaction
 */
router.post('/verify', async (req, res) => {
    try {
        const { transaction_id, tx_ref, registrationId } = req.body;
        if (!transaction_id || !tx_ref) {
            return res.status(400).json({
                success: false,
                message: 'transaction_id and tx_ref are mandatory for server verification'
            });
        }
        // 1. Check idempotency: Has this transaction already been verified?
        const existingPayment = await dataService_1.DataService.getPaymentByTransactionId(String(transaction_id));
        if (existingPayment && existingPayment.status === 'successful') {
            return res.json({
                success: true,
                message: 'Transaction already verified previously',
                data: existingPayment
            });
        }
        const secretKey = process.env.FLW_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({
                success: false,
                message: 'FLW_SECRET_KEY is not configured on the server'
            });
        }
        // 2. Call Flutterwave verify endpoint with SECRET key (never exposed to frontend)
        const flwUrl = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
        const flwResponse = await fetch(flwUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            }
        });
        const flwData = await flwResponse.json();
        if (!flwResponse.ok || flwData.status !== 'success') {
            return res.status(400).json({
                success: false,
                message: flwData.message || 'Flutterwave transaction verification failed'
            });
        }
        const tx = flwData.data;
        // 3. Strict security validation: status, currency, amount, and tx_ref match
        const isStatusValid = tx.status === 'successful';
        const isCurrencyValid = tx.currency.toUpperCase() === EXPECTED_CURRENCY;
        const isAmountValid = Number(tx.amount) >= EXPECTED_AMOUNT;
        const isTxRefValid = tx.tx_ref === tx_ref;
        if (!isStatusValid || !isCurrencyValid || !isAmountValid || !isTxRefValid) {
            console.error('❌ Payment verification mismatch:', {
                expected: { status: 'successful', currency: EXPECTED_CURRENCY, amount: EXPECTED_AMOUNT, tx_ref },
                received: { status: tx.status, currency: tx.currency, amount: tx.amount, tx_ref: tx.tx_ref }
            });
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed: Transaction parameters do not match expected values',
                details: {
                    statusValid: isStatusValid,
                    currencyValid: isCurrencyValid,
                    amountValid: isAmountValid,
                    txRefValid: isTxRefValid
                }
            });
        }
        // 4. Persistence: save payment record
        const customerName = tx.customer ? `${tx.customer.name || ''}`.trim() : 'Academy Applicant';
        const customerEmail = tx.customer ? tx.customer.email : '';
        const customerPhone = tx.customer ? tx.customer.phone_number : '';
        const paymentRecord = await dataService_1.DataService.createPaymentRecord({
            tx_ref,
            transaction_id: String(transaction_id),
            amount: tx.amount,
            currency: tx.currency,
            status: 'successful',
            customerName,
            customerEmail,
            customerPhone,
            paymentMethod: tx.payment_type || 'card',
            registrationId: registrationId || '',
            flwMeta: {
                id: tx.id,
                flw_ref: tx.flw_ref,
                narration: tx.narration,
                ip: tx.ip,
                payment_type: tx.payment_type
            }
        });
        // 5. Update Registration state if registration ID or customer email exists
        let updatedReg = null;
        if (registrationId) {
            updatedReg = await dataService_1.DataService.markRegistrationPaid(registrationId, {
                tx_ref,
                transaction_id: String(transaction_id),
                amount: tx.amount
            });
        }
        else if (customerEmail) {
            updatedReg = await dataService_1.DataService.markRegistrationPaid(customerEmail, {
                tx_ref,
                transaction_id: String(transaction_id),
                amount: tx.amount
            });
        }
        // 6. Trigger Resend Transactional Email Receipts
        const athleteName = updatedReg?.playerName || customerName;
        const academyPreference = updatedReg?.academyPreference || 'next_pro';
        const category = updatedReg?.category || 'u17';
        // Send customer receipt
        emailService_1.EmailService.sendPaymentReceipt({
            to: customerEmail,
            customerName,
            playerName: athleteName,
            academyPreference,
            category,
            amount: tx.amount,
            currency: tx.currency,
            tx_ref,
            transaction_id: String(transaction_id),
            date: new Date().toISOString()
        }).catch(err => console.error('Email send err:', err));
        // Send admin notification
        emailService_1.EmailService.sendAdminPaymentNotification({
            customerName,
            playerName: athleteName,
            customerEmail,
            customerPhone,
            academyPreference,
            category,
            amount: tx.amount,
            tx_ref
        }).catch(err => console.error('Admin email send err:', err));
        return res.json({
            success: true,
            message: 'Payment received. Funds settle to the merchant account on Flutterwave\'s schedule (usually next business day for local transactions).',
            data: {
                payment: paymentRecord,
                registration: updatedReg
            }
        });
    }
    catch (error) {
        console.error('Payment verify route error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * POST /api/payment/webhook
 * Flutterwave webhook listener with secret hash validation and idempotent charge.completed handling
 */
router.post('/webhook', async (req, res) => {
    try {
        const secretHash = process.env.FLW_SECRET_HASH;
        const signature = req.headers['verif-hash'];
        // 1. Validate webhook signature against secret hash
        if (!signature || (secretHash && signature !== secretHash)) {
            console.warn('⚠️  [Flutterwave Webhook] Unauthorized webhook signature received.');
            return res.status(401).json({ message: 'Invalid verification hash' });
        }
        const payload = req.body;
        console.log(`🔔 [Flutterwave Webhook] Event received: ${payload.event}`);
        // 2. Handle charge.completed idempotently
        if (payload.event === 'charge.completed' && payload.data?.status === 'successful') {
            const data = payload.data;
            const tx_ref = data.tx_ref;
            const transaction_id = String(data.id);
            // Check if already processed
            const existing = await dataService_1.DataService.getPaymentByTransactionId(transaction_id);
            if (existing) {
                console.log(`⚡ [Flutterwave Webhook] Transaction ${transaction_id} already recorded. Acknowledged.`);
                return res.status(200).json({ status: 'ok', note: 'already processed' });
            }
            // Verify amount and currency
            if (data.currency.toUpperCase() === EXPECTED_CURRENCY && Number(data.amount) >= EXPECTED_AMOUNT) {
                await dataService_1.DataService.createPaymentRecord({
                    tx_ref,
                    transaction_id,
                    amount: data.amount,
                    currency: data.currency,
                    status: 'successful',
                    customerName: data.customer?.name || 'Applicant',
                    customerEmail: data.customer?.email || '',
                    customerPhone: data.customer?.phone_number || '',
                    paymentMethod: data.payment_type || 'card',
                    flwMeta: data
                });
                if (data.customer?.email) {
                    await dataService_1.DataService.markRegistrationPaid(data.customer.email, {
                        tx_ref,
                        transaction_id,
                        amount: data.amount
                    });
                }
                console.log(`✅ [Flutterwave Webhook] Successfully credited payment for ${data.customer?.email}`);
            }
        }
        return res.status(200).json({ status: 'ok' });
    }
    catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(500).json({ error: error.message });
    }
});
/**
 * GET /api/payment/history
 * List all verified payments (admin view)
 */
router.get('/history', async (_req, res) => {
    try {
        const payments = await dataService_1.DataService.getAllPayments();
        return res.json({ success: true, count: payments.length, data: payments });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
