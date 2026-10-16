import dotenv from 'dotenv';
dotenv.config();

import { connectDB, getIsMongoConnected, loadLocalDB, saveLocalDB } from './config/db';
import { Player } from './models/Player';
import { GalleryItem } from './models/GalleryItem';
import { News } from './models/News';
import { Match } from './models/Match';
import { Registration } from './models/Registration';
import crypto from 'crypto';

const initialPlayers: any[] = [];

const initialGallery: any[] = [];

const initialNews = [
  {
    title: 'Fackson Next Pro & Angels Announce 2026/2027 Open Academy Trials',
    slug: 'open-academy-trials-2026-2027',
    excerpt: 'Registration is now officially open for boys and girls across U-10, U-13, U-17, and Free Age squads.',
    content: `Fackson Football Academy management is thrilled to announce the commencement of recruitment for the upcoming 2026/2027 competitive season. Both Fackson Next Pro (Men) and Fackson Angels (Women) are scouting prospective talent who demonstrate technical promise, athletic dynamism, and sportsmanship.

Trials will take place at the Fackson Academy Stadium Complex under the direct supervision of licensed coaches, European scout liaisons, and technical staff. Registered participants will undergo physical conditioning tests, 1v1 technical assessments, and full 11-a-side showcase matches.

Prospective athletes and parents are invited to fill out the online registration form through this portal.`,
    coverImage: '/images/training-1.jpg',
    academy: 'all',
    author: 'Academy Director',
    date: '2026-10-10',
    featured: true
  },
  {
    title: 'Fackson Angels U17 Crowned Champions in Regional Invitational',
    slug: 'fackson-angels-u17-crowned-champions',
    excerpt: 'A sensational 3-1 triumph secured the golden trophy for our high-flying angels squad.',
    content: `In an electrifying finale at the City Stadium, Fackson Angels U17 produced a tactical masterclass to overcome Metropolitan Stars 3-1. Goals from Chioma Nnamdi and a brace from Maya Oladipo sealed an unforgettable victory.

Head Coach commended the discipline, tactical cohesion, and fearless attacking style that defines the Fackson Angels philosophy. "Our girls displayed elite grit and technical superiority on the biggest stage," she stated.`,
    coverImage: '/images/angels-action-1.jpg',
    academy: 'angels',
    author: 'Head Coach Fatima',
    date: '2026-10-04',
    featured: true
  },
  {
    title: 'Next Pro U17 Scouting Showcase Attracts International Scouts',
    slug: 'next-pro-u17-scouting-showcase',
    excerpt: 'Over 8 club scouts attended the weekend showcase at the Fackson Complex.',
    content: `The talent pipeline at Fackson Next Pro was on full display this weekend as scouts from prestigious European and regional clubs observed our U17 and Free Age squads. Emmanuel Fackson delivered a stand-out performance that earned widespread praise.

The academy continues its mission to provide a direct pathway from youth grassroots football to professional careers.`,
    coverImage: '/images/trophy-celebration.jpg',
    academy: 'next_pro',
    author: 'Chief Scout',
    date: '2026-09-28',
    featured: false
  }
];

const initialMatches = [
  {
    title: 'Fackson Next Pro U17 vs Apex Football Club',
    homeTeam: 'Fackson Next Pro U17',
    awayTeam: 'Apex Stars FC',
    homeLogo: '/logos/fackson-next-pro.jpg',
    awayLogo: '',
    academy: 'next_pro',
    category: 'u17',
    date: '2026-10-24',
    time: '16:00',
    venue: 'Fackson Academy Stadium Complex, Pitch 1',
    status: 'upcoming',
    homeScore: 0,
    awayScore: 0,
    competition: 'State Elite Youth League'
  },
  {
    title: 'Fackson Angels Senior vs Royal Queens FC',
    homeTeam: 'Fackson Angels Senior',
    awayTeam: 'Royal Queens FC',
    homeLogo: '/logos/fackson-angels.jpg',
    awayLogo: '',
    academy: 'angels',
    category: 'free_age',
    date: '2026-10-26',
    time: '14:30',
    venue: 'Main Arena Stadium',
    status: 'upcoming',
    homeScore: 0,
    awayScore: 0,
    competition: 'National Championship Super Cup'
  },
  {
    title: 'Fackson Next Pro U13 vs City United Youth',
    homeTeam: 'Fackson Next Pro U13',
    awayTeam: 'City United Youth',
    homeLogo: '/logos/fackson-next-pro.jpg',
    awayLogo: '',
    academy: 'next_pro',
    category: 'u13',
    date: '2026-10-12',
    time: '10:00',
    venue: 'Fackson Academy Stadium Complex',
    status: 'completed',
    homeScore: 4,
    awayScore: 1,
    competition: 'Youth Cup Quarter Final'
  },
  {
    title: 'Fackson Angels U17 vs Metropolitan Stars',
    homeTeam: 'Fackson Angels U17',
    awayTeam: 'Metropolitan Stars',
    homeLogo: '/logos/fackson-angels.jpg',
    awayLogo: '',
    academy: 'angels',
    category: 'u17',
    date: '2026-10-04',
    time: '15:00',
    venue: 'City Stadium Arena',
    status: 'completed',
    homeScore: 3,
    awayScore: 1,
    competition: 'Regional Invitational Final'
  }
];

export const seedDatabase = async () => {
  console.log('🌱 Seeding Fackson Football Academy initial dataset...');

  // Only seed local datastore if it is empty
  const currentDB = loadLocalDB();
  if (currentDB.news.length === 0 && currentDB.matches.length === 0 && currentDB.gallery.length === 0) {
    const localData = {
      players: initialPlayers.map(p => ({ _id: crypto.randomUUID(), ...p, createdAt: new Date().toISOString() })),
      gallery: initialGallery.map(g => ({ _id: crypto.randomUUID(), ...g, createdAt: new Date().toISOString() })),
      news: initialNews.map(n => ({ _id: crypto.randomUUID(), ...n, createdAt: new Date().toISOString() })),
      matches: initialMatches.map(m => ({ _id: crypto.randomUUID(), ...m, createdAt: new Date().toISOString() })),
      registrations: [
        {
          _id: crypto.randomUUID(),
          playerName: 'Michael Okorie',
          dateOfBirth: '2012-06-15',
          gender: 'male',
          academyPreference: 'next_pro',
          category: 'u13',
          parentName: 'Chief Okorie',
          phone: '+234 803 123 4567',
          email: 'okorie.fam@example.com',
          position: 'Attacking Midfielder',
          experience: 'Captain of St. Jude School team, 3 years grassroots experience',
          status: 'reviewed',
          createdAt: new Date().toISOString()
        }
      ],
      payments: []
    };
    saveLocalDB(localData);
    console.log('💾 Local datastore initialized with baseline data.');
  } else {
    console.log('ℹ️  Local datastore already populated. Preserving user data.');
  }

  // If connected to MongoDB Atlas, seed Mongoose collections only if empty
  if (getIsMongoConnected()) {
    try {
      const newsCount = await News.countDocuments();
      if (newsCount === 0) {
        await News.insertMany(initialNews);
        console.log('✅ MongoDB Atlas seeded with baseline news articles.');
      }

      const matchCount = await Match.countDocuments();
      if (matchCount === 0) {
        await Match.insertMany(initialMatches);
        console.log('✅ MongoDB Atlas seeded with baseline match fixtures.');
      }
    } catch (e: any) {
      console.warn('⚠️  Could not seed to MongoDB Atlas directly:', e.message);
    }
  }
};

if (require.main === module) {
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}
