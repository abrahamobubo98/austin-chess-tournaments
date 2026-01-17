// Script to add event to Appwrite database
import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'austin-chess-tournaments';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'chess_tournaments_db';
const API_KEY = 'standard_9ae5678e678adf5c5930123df97c70ecf2bc89fa5c646c78c6ee166e45ff416640608e7550e28b2e248696f1c5fcf6b5929ec5bbc574e48dee563d0e62fad1172153302c86979f70f2694f015ffb43c2005fb1423c94420ec4bded910f8bef7a124eda97144c074ac6d047a97d35c10393f44a53834e0506c60ca1728a9d16ac';
const COLLECTION_ID = 'upcoming_events';

console.log('Using endpoint:', ENDPOINT);
console.log('Using project:', PROJECT_ID);

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

const event = {
    title: '2026 Paragon Scholastic Tournament',
    description: 'Save the date!',
    eventDate: '2026-04-25T12:00:00.000Z', // April 25, 2026
    location: '',
    entryFee: '',
    timeControl: '',
    isActive: true,
};

async function addEvent() {
    try {
        const result = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            event
        );
        console.log('✓ Event created successfully!');
        console.log('Document ID:', result.$id);
        console.log('Title:', result.title);
    } catch (error) {
        console.error('Error creating event:', error);
    }
}

addEvent();
