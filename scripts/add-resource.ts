// Script to add resource to Appwrite database
import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'austin-chess-tournaments';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'chess_tournaments_db';
const API_KEY = 'standard_9ae5678e678adf5c5930123df97c70ecf2bc89fa5c646c78c6ee166e45ff416640608e7550e28b2e248696f1c5fcf6b5929ec5bbc574e48dee563d0e62fad1172153302c86979f70f2694f015ffb43c2005fb1423c94420ec4bded910f8bef7a124eda97144c074ac6d047a97d35c10393f44a53834e0506c60ca1728a9d16ac';
const COLLECTION_ID = 'resources';

console.log('Using endpoint:', ENDPOINT);
console.log('Using project:', PROJECT_ID);

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

// ============================================
// EDIT THIS SECTION TO ADD YOUR RESOURCE
// ============================================
const resource = {
    title: 'Traveling Chess Club',
    description: `Social chess at various locations, generally for adults only. Equipment provided, thanks to member donations.

Instagram @travelingchessclub
TikTok @travelingchessclub
Twitch @travelingchess
YouTube @travelingchess
Chess.com @traveling-chess-club`,
    url: 'https://linktr.ee/travelingchess',
    category: 'Local Clubs',
    sortOrder: 10,
};

async function addResource() {
    try {
        const result = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            resource
        );
        console.log('✓ Resource created successfully!');
        console.log('Document ID:', result.$id);
        console.log('Title:', result.title);
        console.log('URL:', result.url);
    } catch (error) {
        console.error('Error creating resource:', error);
    }
}

addResource();
