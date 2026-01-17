import { databases, DATABASE_ID, COLLECTIONS, ID, Query } from "@/lib/appwrite";
import { Models } from "appwrite";

// ============ TYPE DEFINITIONS ============

export interface Announcement {
    $id: string;
    title: string;
    content: string;
    publishedAt: string;
    isActive: boolean;
    authorId: string;
}

export interface UpcomingEvent {
    $id: string;
    title: string;
    description: string;
    eventDate: string;
    location: string;
    entryFee: string;
    timeControl: string;
    isActive: boolean;
    roundCount?: number;
    registrationOpen?: boolean;
    hasSections?: boolean;
}

export interface WeeklyEvent {
    $id: string;
    title: string;
    description: string;
    dayOfWeek: string;
    time: string;
    location: string;
    isActive: boolean;
}

export interface Resource {
    $id: string;
    title: string;
    description: string;
    url: string;
    category: string;
    sortOrder: number;
}

export interface FAQ {
    $id: string;
    question: string;
    answer: string;
    sortOrder: number;
    isActive: boolean;
}

export interface ContactSubmission {
    $id: string;
    name: string;
    email: string;
    message: string;
    submittedAt: string;
    isRead: boolean;
}

export interface TournamentSection {
    $id: string;
    eventId: string;
    name: string;
    entryFee?: number;
    maxRating?: number;
    minRating?: number;
    sortOrder: number;
}

export interface TournamentRegistration {
    $id: string;
    eventId: string;
    sectionId?: string;
    uscfId: string;
    playerName: string;
    rating?: number;
    playerState?: string;
    expirationDate?: string;
    email: string;
    phone?: string;
    street?: string;
    city?: string;
    stateAddress?: string;
    zip?: string;
    notificationPref: "none" | "email" | "text" | "both";
    byeRounds?: string;
    acceptedTerms: boolean;
    registeredAt: string;
}

// ============ ANNOUNCEMENTS ============

export async function getAnnouncements(onlyActive = true) {
    const queries = [Query.orderDesc("publishedAt"), Query.limit(50)];
    if (onlyActive) {
        queries.push(Query.equal("isActive", true));
    }
    const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ANNOUNCEMENTS,
        queries
    );
    return response.documents as unknown as Announcement[];
}

export async function createAnnouncement(
    data: Omit<Announcement, "$id">
): Promise<Announcement> {
    const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ANNOUNCEMENTS,
        ID.unique(),
        data
    );
    return response as unknown as Announcement;
}

export async function updateAnnouncement(
    id: string,
    data: Partial<Omit<Announcement, "$id">>
): Promise<Announcement> {
    const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ANNOUNCEMENTS,
        id,
        data
    );
    return response as unknown as Announcement;
}

export async function deleteAnnouncement(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANNOUNCEMENTS, id);
}

// ============ UPCOMING EVENTS ============

export async function getUpcomingEvents(onlyActive = true, excludePast = true) {
    const queries = [Query.orderAsc("eventDate"), Query.limit(50)];
    if (onlyActive) {
        queries.push(Query.equal("isActive", true));
    }
    if (excludePast) {
        // Filter out events that have already passed
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        queries.push(Query.greaterThanEqual("eventDate", today.toISOString()));
    }
    const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.UPCOMING_EVENTS,
        queries
    );
    return response.documents as unknown as UpcomingEvent[];
}

export async function createUpcomingEvent(
    data: Omit<UpcomingEvent, "$id">
): Promise<UpcomingEvent> {
    const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.UPCOMING_EVENTS,
        ID.unique(),
        data
    );
    return response as unknown as UpcomingEvent;
}

export async function updateUpcomingEvent(
    id: string,
    data: Partial<Omit<UpcomingEvent, "$id">>
): Promise<UpcomingEvent> {
    const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.UPCOMING_EVENTS,
        id,
        data
    );
    return response as unknown as UpcomingEvent;
}

export async function deleteUpcomingEvent(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.UPCOMING_EVENTS, id);
}

// ============ WEEKLY EVENTS ============

export async function getWeeklyEvents(onlyActive = true) {
    const queries = [Query.limit(50)];
    if (onlyActive) {
        queries.push(Query.equal("isActive", true));
    }
    const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WEEKLY_EVENTS,
        queries
    );
    return response.documents as unknown as WeeklyEvent[];
}

export async function createWeeklyEvent(
    data: Omit<WeeklyEvent, "$id">
): Promise<WeeklyEvent> {
    const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.WEEKLY_EVENTS,
        ID.unique(),
        data
    );
    return response as unknown as WeeklyEvent;
}

export async function updateWeeklyEvent(
    id: string,
    data: Partial<Omit<WeeklyEvent, "$id">>
): Promise<WeeklyEvent> {
    const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.WEEKLY_EVENTS,
        id,
        data
    );
    return response as unknown as WeeklyEvent;
}

export async function deleteWeeklyEvent(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.WEEKLY_EVENTS, id);
}

// ============ RESOURCES ============

export async function getResources() {
    const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.RESOURCES,
        [Query.orderAsc("sortOrder"), Query.limit(100)]
    );
    return response.documents as unknown as Resource[];
}

export async function createResource(
    data: Omit<Resource, "$id">
): Promise<Resource> {
    const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.RESOURCES,
        ID.unique(),
        data
    );
    return response as unknown as Resource;
}

export async function updateResource(
    id: string,
    data: Partial<Omit<Resource, "$id">>
): Promise<Resource> {
    const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.RESOURCES,
        id,
        data
    );
    return response as unknown as Resource;
}

export async function deleteResource(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.RESOURCES, id);
}

// ============ FAQS ============

export async function getFAQs(onlyActive = true) {
    const queries = [Query.orderAsc("sortOrder"), Query.limit(100)];
    if (onlyActive) {
        queries.push(Query.equal("isActive", true));
    }
    const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FAQS,
        queries
    );
    return response.documents as unknown as FAQ[];
}

export async function createFAQ(data: Omit<FAQ, "$id">): Promise<FAQ> {
    const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.FAQS,
        ID.unique(),
        data
    );
    return response as unknown as FAQ;
}

export async function updateFAQ(
    id: string,
    data: Partial<Omit<FAQ, "$id">>
): Promise<FAQ> {
    const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.FAQS,
        id,
        data
    );
    return response as unknown as FAQ;
}

export async function deleteFAQ(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.FAQS, id);
}

// ============ CONTACT SUBMISSIONS ============

export async function getContactSubmissions() {
    const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CONTACT_SUBMISSIONS,
        [Query.orderDesc("submittedAt"), Query.limit(100)]
    );
    return response.documents as unknown as ContactSubmission[];
}

export async function createContactSubmission(
    data: Omit<ContactSubmission, "$id" | "submittedAt" | "isRead">
): Promise<ContactSubmission> {
    const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CONTACT_SUBMISSIONS,
        ID.unique(),
        {
            ...data,
            submittedAt: new Date().toISOString(),
            isRead: false,
        } as unknown as Omit<ContactSubmission, "$id">
    );
    return response as unknown as ContactSubmission;
}

export async function markContactAsRead(id: string): Promise<void> {
    await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CONTACT_SUBMISSIONS,
        id,
        { isRead: true } as unknown as Partial<ContactSubmission>
    );
}

export async function deleteContactSubmission(id: string): Promise<void> {
    await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.CONTACT_SUBMISSIONS,
        id
    );
}

// ============ TOURNAMENT SECTIONS ============

export async function getSectionsByEvent(eventId: string): Promise<TournamentSection[]> {
    const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TOURNAMENT_SECTIONS,
        [
            Query.equal("eventId", eventId),
            Query.orderAsc("sortOrder"),
            Query.limit(20)
        ]
    );
    return response.documents as unknown as TournamentSection[];
}

export async function createSection(
    data: Omit<TournamentSection, "$id">
): Promise<TournamentSection> {
    const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TOURNAMENT_SECTIONS,
        ID.unique(),
        data
    );
    return response as unknown as TournamentSection;
}

export async function deleteSection(id: string): Promise<void> {
    await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.TOURNAMENT_SECTIONS,
        id
    );
}

// ============ TOURNAMENT REGISTRATIONS ============

export async function getRegistrationsByEvent(eventId: string): Promise<TournamentRegistration[]> {
    const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TOURNAMENT_REGISTRATIONS,
        [
            Query.equal("eventId", eventId),
            Query.orderDesc("registeredAt"),
            Query.limit(500)
        ]
    );
    return response.documents as unknown as TournamentRegistration[];
}

export async function createRegistration(
    data: Omit<TournamentRegistration, "$id" | "registeredAt">
): Promise<TournamentRegistration> {
    const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TOURNAMENT_REGISTRATIONS,
        ID.unique(),
        {
            ...data,
            registeredAt: new Date().toISOString(),
        } as unknown as Omit<TournamentRegistration, "$id">
    );
    return response as unknown as TournamentRegistration;
}

export async function getEventById(id: string): Promise<UpcomingEvent | null> {
    try {
        const response = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.UPCOMING_EVENTS,
            id
        );
        return response as unknown as UpcomingEvent;
    } catch {
        return null;
    }
}
