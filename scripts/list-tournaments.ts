// Script to list all tournaments from Appwrite database with their descriptions
import { Client, Databases, Query } from 'node-appwrite';
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

async function listTournaments() {
    try {
        console.log('='.repeat(80));
        console.log('FETCHING ALL TOURNAMENTS (UPCOMING EVENTS)');
        console.log('='.repeat(80));

        // Fetch all upcoming events
        const events = await databases.listDocuments(
            DATABASE_ID,
            'upcoming_events',
            [Query.orderAsc('eventDate')]
        );

        console.log(`\nFound ${events.total} tournaments:\n`);

        for (const event of events.documents) {
            console.log('-'.repeat(80));
            console.log(`ID: ${event.$id}`);
            console.log(`Title: ${event.title}`);
            console.log(`Date: ${event.eventDate}`);
            console.log(`Location: ${event.location || 'TBA'}`);
            console.log(`Entry Fee: ${event.entryFee || 'TBA'}`);
            console.log(`Time Control: ${event.timeControl || 'TBA'}`);
            console.log(`Round Count: ${event.roundCount ?? 'NOT SET'}`);
            console.log(`Has Sections: ${event.hasSections ?? 'NOT SET'}`);
            console.log(`Registration Open: ${event.registrationOpen ?? 'NOT SET'}`);
            console.log(`Is Active: ${event.isActive}`);
            console.log(`\nDescription:`);
            console.log(event.description || '(No description)');
            console.log('');
        }

        // Now fetch sections for each event that has sections
        console.log('\n' + '='.repeat(80));
        console.log('FETCHING TOURNAMENT SECTIONS');
        console.log('='.repeat(80));

        const sections = await databases.listDocuments(
            DATABASE_ID,
            'tournament_sections',
            [Query.orderAsc('sortOrder')]
        );

        console.log(`\nFound ${sections.total} sections total:\n`);

        // Group sections by eventId
        const sectionsByEvent: Record<string, typeof sections.documents> = {};
        for (const section of sections.documents) {
            if (!sectionsByEvent[section.eventId]) {
                sectionsByEvent[section.eventId] = [];
            }
            sectionsByEvent[section.eventId].push(section);
        }

        for (const [eventId, eventSections] of Object.entries(sectionsByEvent)) {
            // Find the event title
            const event = events.documents.find(e => e.$id === eventId);
            console.log('-'.repeat(80));
            console.log(`Event: ${event?.title || 'Unknown'} (${eventId})`);
            console.log('Sections:');
            for (const section of eventSections) {
                console.log(`  - ${section.name}`);
                console.log(`    Entry Fee: $${section.entryFee ?? 'Not set'}`);
                console.log(`    Min Rating: ${section.minRating ?? 'None'}`);
                console.log(`    Max Rating: ${section.maxRating ?? 'None'}`);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('ANALYSIS: Events that may need rounds/sections updates:');
        console.log('='.repeat(80));

        for (const event of events.documents) {
            const eventSections = sectionsByEvent[event.$id] || [];
            const issues: string[] = [];

            // Check if roundCount is not set but could be inferred from description
            if (!event.roundCount || event.roundCount === 5) {
                // Look for patterns like "5-round" or "4 rounds" in description
                const roundMatch = event.description?.match(/(\d+)[- ]?rounds?/i);
                if (roundMatch) {
                    const inferredRounds = parseInt(roundMatch[1]);
                    if (inferredRounds !== event.roundCount) {
                        issues.push(`Description mentions ${inferredRounds} rounds, but roundCount is ${event.roundCount ?? 'not set'}`);
                    }
                }
            }

            // Check if hasSections is false but sections exist in database
            if (!event.hasSections && eventSections.length > 0) {
                issues.push(`hasSections is false but ${eventSections.length} sections exist in database`);
            }

            // Check if hasSections is true but no sections exist
            if (event.hasSections && eventSections.length === 0) {
                issues.push(`hasSections is true but no sections exist in database`);
            }

            // Look for section info in description that might need to be added
            if (!event.hasSections && event.description) {
                const sectionPatterns = [
                    /open\s+section/i,
                    /k-12\s+section/i,
                    /scholastic\s+section/i,
                    /reserve\s+section/i,
                    /u\d{3,4}/i,  // Like U1200, U1800
                    /under\s+\d{3,4}/i,
                ];
                for (const pattern of sectionPatterns) {
                    if (pattern.test(event.description)) {
                        issues.push(`Description mentions sections but hasSections is false`);
                        break;
                    }
                }
            }

            if (issues.length > 0) {
                console.log(`\n${event.title} (${event.$id}):`);
                for (const issue of issues) {
                    console.log(`  ⚠ ${issue}`);
                }
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('DONE');
        console.log('='.repeat(80));

    } catch (error) {
        console.error('Error listing tournaments:', error);
    }
}

listTournaments();
