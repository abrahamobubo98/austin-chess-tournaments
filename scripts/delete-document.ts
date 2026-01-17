// Script to delete a document from Appwrite database
import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'austin-chess-tournaments';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'chess_tournaments_db';
const API_KEY = 'standard_9ae5678e678adf5c5930123df97c70ecf2bc89fa5c646c78c6ee166e45ff416640608e7550e28b2e248696f1c5fcf6b5929ec5bbc574e48dee563d0e62fad1172153302c86979f70f2694f015ffb43c2005fb1423c94420ec4bded910f8bef7a124eda97144c074ac6d047a97d35c10393f44a53834e0506c60ca1728a9d16ac';

// ============================================
// EDIT THIS SECTION TO DELETE A DOCUMENT
// ============================================
const COLLECTION_ID = 'resources';
const DOCUMENT_ID = '696b0fed00322f08b2e9';

console.log('Using endpoint:', ENDPOINT);
console.log('Using project:', PROJECT_ID);

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function deleteDocument() {
    try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, DOCUMENT_ID);
        console.log('✓ Document deleted successfully!');
        console.log('Collection:', COLLECTION_ID);
        console.log('Document ID:', DOCUMENT_ID);
    } catch (error) {
        console.error('Error deleting document:', error);
    }
}

deleteDocument();
