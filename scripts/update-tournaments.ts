// Script to update tournaments with correct roundCount and hasSections values,
// and create sections based on description analysis
import { Client, Databases, ID, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'austin-chess-tournaments';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'chess_tournaments_db';
const API_KEY = 'standard_9ae5678e678adf5c5930123df97c70ecf2bc89fa5c646c78c6ee166e45ff416640608e7550e28b2e248696f1c5fcf6b5929ec5bbc574e48dee563d0e62fad1172153302c86979f70f2694f015ffb43c2005fb1423c94420ec4bded910f8bef7a124eda97144c074ac6d047a97d35c10393f44a53834e0506c60ca1728a9d16ac';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

interface Section {
    name: string;
    entryFee?: number;
    minRating?: number;
    maxRating?: number;
    sortOrder: number;
}

interface TournamentUpdate {
    eventId: string;
    title: string;
    roundCount?: number;
    hasSections?: boolean;
    sections?: Section[];
}

// Define updates based on our analysis of each tournament's description
const tournamentUpdates: TournamentUpdate[] = [
    // --- Wednesday Blitz Night ---
    {
        eventId: '696b0b1a001f8dba4dc5',
        title: 'Wednesday Blitz Night',
        roundCount: 9,
        hasSections: false,
    },

    // --- Paragon Prep January 2026 Tournament - Open & K-12 Elite ---
    {
        eventId: '696afca40009cd4ec994',
        title: 'Paragon Prep January 2026 Tournament - Open & K-12 Elite',
        roundCount: 5,
        hasSections: true,
        sections: [
            { name: 'Open', entryFee: 40, sortOrder: 0 },
            { name: 'K-12 Elite', entryFee: 40, maxRating: 1200, sortOrder: 1 },
        ],
    },

    // --- Austin Chess Club G90 Rated Swiss ---
    {
        eventId: '696afb110023770fd688',
        title: 'Austin Chess Club G90 Rated Swiss',
        roundCount: 4,
        hasSections: false,
    },

    // --- 4th Austin Chess Tour: Open Qualifier #1 ---
    {
        eventId: '696b015c002ca59e2cf7',
        title: '4th Austin Chess Tour: Open Qualifier #1',
        roundCount: 4, // 4 rounds for all sections
        hasSections: true,
        sections: [
            { name: 'Section A (1800+)', entryFee: 50, minRating: 1800, sortOrder: 0 },
            { name: 'Section B (1400-1799)', entryFee: 50, minRating: 1400, maxRating: 1799, sortOrder: 1 },
            { name: 'Section C (1000-1399)', entryFee: 50, minRating: 1000, maxRating: 1399, sortOrder: 2 },
            { name: 'Section D (U1000)', entryFee: 50, maxRating: 999, sortOrder: 3 },
        ],
    },

    // --- 4th Austin Chess Tour: Junior Qualifier #2 ---
    {
        eventId: '696b01df00086f6bf999',
        title: '4th Austin Chess Tour: Junior Qualifier #2',
        roundCount: 4, // Most sections have 4 rounds, D & E have 5
        hasSections: true,
        sections: [
            { name: 'Section A (1600+)', entryFee: 40, minRating: 1600, sortOrder: 0 },
            { name: 'Section B (1200-1599)', entryFee: 40, minRating: 1200, maxRating: 1599, sortOrder: 1 },
            { name: 'Section C (800-1199)', entryFee: 40, minRating: 800, maxRating: 1199, sortOrder: 2 },
            { name: 'Section D (400-799)', entryFee: 40, minRating: 400, maxRating: 799, sortOrder: 3 },
            { name: 'Section E (U400/Unrated)', entryFee: 40, maxRating: 399, sortOrder: 4 },
        ],
    },

    // --- Longhorn Monthly Swiss - February 2026 ---
    {
        eventId: '696b02420024bbbdf72a',
        title: 'Longhorn Monthly Swiss - February 2026',
        roundCount: 4, // 4 rounds based on schedule
        hasSections: true,
        sections: [
            { name: 'Advanced (1500+)', entryFee: 0, minRating: 1500, sortOrder: 0 },
            { name: 'Championship (1000-1499)', entryFee: 0, minRating: 1000, maxRating: 1499, sortOrder: 1 },
            { name: 'Reserve (600-999)', entryFee: 0, minRating: 600, maxRating: 999, sortOrder: 2 },
            { name: 'Beginner (U600)', entryFee: 0, maxRating: 599, sortOrder: 3 },
        ],
    },

    // --- 4th Austin Chess Tour: Open Qualifier #2 ---
    {
        eventId: '696b035b001c2e54e53f',
        title: '4th Austin Chess Tour: Open Qualifier #2',
        roundCount: 4,
        hasSections: true,
        sections: [
            { name: 'Section A (1800+)', entryFee: 50, minRating: 1800, sortOrder: 0 },
            { name: 'Section B (1400-1799)', entryFee: 50, minRating: 1400, maxRating: 1799, sortOrder: 1 },
            { name: 'Section C (1000-1399)', entryFee: 50, minRating: 1000, maxRating: 1399, sortOrder: 2 },
            { name: 'Section D (U1000)', entryFee: 50, maxRating: 999, sortOrder: 3 },
        ],
    },

    // --- 4th Austin Chess Tour: Junior Qualifier #3 ---
    {
        eventId: '696b04ed00055e4e97b8',
        title: '4th Austin Chess Tour: Junior Qualifier #3',
        roundCount: 4, // Most sections 4 rounds, D & E have 5
        hasSections: true,
        sections: [
            { name: 'Section A (1600+)', entryFee: 40, minRating: 1600, sortOrder: 0 },
            { name: 'Section B (1200-1599)', entryFee: 40, minRating: 1200, maxRating: 1599, sortOrder: 1 },
            { name: 'Section C (800-1199)', entryFee: 40, minRating: 800, maxRating: 1199, sortOrder: 2 },
            { name: 'Section D (400-799)', entryFee: 40, minRating: 400, maxRating: 799, sortOrder: 3 },
            { name: 'Section E (U400/Unrated)', entryFee: 40, maxRating: 399, sortOrder: 4 },
        ],
    },
];

async function updateTournaments() {
    console.log('='.repeat(80));
    console.log('UPDATING TOURNAMENTS');
    console.log('='.repeat(80));

    for (const update of tournamentUpdates) {
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`Updating: ${update.title}`);
        console.log(`ID: ${update.eventId}`);

        try {
            // Update the event document
            const updateData: Record<string, unknown> = {};
            if (update.roundCount !== undefined) {
                updateData.roundCount = update.roundCount;
            }
            if (update.hasSections !== undefined) {
                updateData.hasSections = update.hasSections;
            }

            if (Object.keys(updateData).length > 0) {
                await databases.updateDocument(
                    DATABASE_ID,
                    'upcoming_events',
                    update.eventId,
                    updateData
                );
                console.log(`  ✓ Updated event: roundCount=${update.roundCount}, hasSections=${update.hasSections}`);
            }

            // Create sections if specified
            if (update.sections && update.sections.length > 0) {
                // First, delete any existing sections for this event
                const existingSections = await databases.listDocuments(
                    DATABASE_ID,
                    'tournament_sections',
                    [Query.equal('eventId', update.eventId)]
                );

                for (const section of existingSections.documents) {
                    await databases.deleteDocument(DATABASE_ID, 'tournament_sections', section.$id);
                    console.log(`  ✓ Deleted existing section: ${section.name}`);
                }

                // Now create new sections
                for (const section of update.sections) {
                    const sectionData: Record<string, unknown> = {
                        eventId: update.eventId,
                        name: section.name,
                        sortOrder: section.sortOrder,
                    };

                    if (section.entryFee !== undefined) {
                        sectionData.entryFee = section.entryFee;
                    }
                    if (section.minRating !== undefined) {
                        sectionData.minRating = section.minRating;
                    }
                    if (section.maxRating !== undefined) {
                        sectionData.maxRating = section.maxRating;
                    }

                    await databases.createDocument(
                        DATABASE_ID,
                        'tournament_sections',
                        ID.unique(),
                        sectionData
                    );
                    console.log(`  ✓ Created section: ${section.name}`);
                }
            }

        } catch (error) {
            console.error(`  ✗ Error updating ${update.title}:`, error);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log('DONE - All tournaments updated!');
    console.log('='.repeat(80));
}

updateTournaments();
