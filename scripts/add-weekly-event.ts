// Script to add weekly event to Appwrite database
import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'austin-chess-tournaments';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'chess_tournaments_db';
const API_KEY = 'standard_9ae5678e678adf5c5930123df97c70ecf2bc89fa5c646c78c6ee166e45ff416640608e7550e28b2e248696f1c5fcf6b5929ec5bbc574e48dee563d0e62fad1172153302c86979f70f2694f015ffb43c2005fb1423c94420ec4bded910f8bef7a124eda97144c074ac6d047a97d35c10393f44a53834e0506c60ca1728a9d16ac';
const COLLECTION_ID = 'weekly_events';

console.log('Using endpoint:', ENDPOINT);
console.log('Using project:', PROJECT_ID);

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

// ============================================
// EDIT THIS SECTION TO ADD YOUR WEEKLY EVENT
// ============================================
const weeklyEvent = {
    title: 'Saturday Chess at the Austin Chess Club',
    description: `Looking for a place to meet other chess players? Do you enjoy playing longer, rated games against experienced opponents? Do you want to spar with strong chess players of all ages? Join the Austin Chess Club!

Doors open at 3:00 PM. Please follow the signs to our meeting areas.

FINDING THE CLUB:
Enter the front parking lot of the school via Luther Lane. If you don't have the gate code, call us at the phone number on the sign. Go up the stairs to enter via the door, follow the hallway until you find lit classrooms.

PARKING:
The parking lot is on Luther Lane and the club entrance is at the back of the parking lot near the playground. Additional parking may be found at St. Paul Lutheran Church parking lot or Sabina Apartments parking (open to the public).`,
    dayOfWeek: 'Saturday',
    time: '3:00 PM',
    location: 'Austin Chess Club, 3407 Red River Street, Austin, TX 78705',
    isActive: true,
};

async function addWeeklyEvent() {
    try {
        const result = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            weeklyEvent
        );
        console.log('✓ Weekly event created successfully!');
        console.log('Document ID:', result.$id);
        console.log('Title:', result.title);
        console.log('Day:', result.dayOfWeek);
        console.log('Time:', result.time);
    } catch (error) {
        console.error('Error creating weekly event:', error);
    }
}

addWeeklyEvent();
