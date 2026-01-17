import { Client, Account, Databases, ID, Query } from 'appwrite';

// Lazy-initialized client to ensure proper hydration
let client: Client | null = null;
let accountInstance: Account | null = null;
let databasesInstance: Databases | null = null;

function getClient(): Client {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    console.log('[Appwrite] Initializing client with:', { endpoint, projectId });

    if (!endpoint || !projectId) {
      throw new Error(`Appwrite configuration missing. Endpoint: ${endpoint}, Project: ${projectId}`);
    }

    client = new Client();
    client.setEndpoint(endpoint).setProject(projectId);
  }
  return client;
}

export function getAccount(): Account {
  if (!accountInstance) {
    accountInstance = new Account(getClient());
  }
  return accountInstance;
}

export function getDatabases(): Databases {
  if (!databasesInstance) {
    databasesInstance = new Databases(getClient());
  }
  return databasesInstance;
}

// Legacy exports for compatibility
export const account = {
  get: () => getAccount().get(),
  getSession: (sessionId: string) => getAccount().getSession(sessionId),
  createEmailPasswordSession: (email: string, password: string) => getAccount().createEmailPasswordSession(email, password),
  deleteSession: (sessionId: string) => getAccount().deleteSession(sessionId),
};

export const databases = {
  listDocuments: (...args: Parameters<Databases['listDocuments']>) => getDatabases().listDocuments(...args),
  getDocument: (...args: Parameters<Databases['getDocument']>) => getDatabases().getDocument(...args),
  createDocument: (...args: Parameters<Databases['createDocument']>) => getDatabases().createDocument(...args),
  updateDocument: (...args: Parameters<Databases['updateDocument']>) => getDatabases().updateDocument(...args),
  deleteDocument: (...args: Parameters<Databases['deleteDocument']>) => getDatabases().deleteDocument(...args),
};

export { ID, Query };

// Database constants
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export const COLLECTIONS = {
  ANNOUNCEMENTS: 'announcements',
  UPCOMING_EVENTS: 'upcoming_events',
  WEEKLY_EVENTS: 'weekly_events',
  RESOURCES: 'resources',
  FAQS: 'faqs',
  CONTACT_SUBMISSIONS: 'contact_submissions',
  TOURNAMENT_SECTIONS: 'tournament_sections',
  TOURNAMENT_REGISTRATIONS: 'tournament_registrations',
} as const;

// Auth helper functions
export async function getCurrentUser() {
  try {
    return await getAccount().get();
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  console.log('[Appwrite] Attempting login for:', email);
  return await getAccount().createEmailPasswordSession(email, password);
}

export async function logout() {
  return await getAccount().deleteSession('current');
}

export async function getSessionSecret() {
  try {
    const session = await getAccount().getSession('current');
    return session.secret;
  } catch {
    return null;
  }
}
