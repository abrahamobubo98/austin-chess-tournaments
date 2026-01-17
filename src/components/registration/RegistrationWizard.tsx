"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    User,
    Mail,
    Phone,
    MapPin,
    Bell,
    Trophy,
    Calendar,
    FileText,
    Check,
    ChevronDown,
    ChevronUp,
    Loader2,
} from "lucide-react";
import {
    createRegistration,
    type TournamentSection,
    type UpcomingEvent,
} from "@/lib/database";

// ============ TYPES ============

interface USCFRating {
    rating?: number;
    ratingSystem: string;
    gamesPlayed: number;
    isProvisional: boolean;
}

interface USCFMember {
    id: string;
    firstName: string;
    lastName: string;
    stateRep?: string;
    status?: string;
    expirationDate?: string;
    ratings?: USCFRating[];
    title?: string;
}

interface RegistrationData {
    // Step 1: Player
    uscfId: string;
    playerName: string;
    rating?: number;
    playerState?: string;
    expirationDate?: string;
    // Step 2: Contact
    email: string;
    phone: string;
    street: string;
    city: string;
    stateAddress: string;
    zip: string;
    notificationPref: "none" | "email" | "text" | "both";
    // Step 3: Section
    sectionId: string;
    sectionName: string;
    sectionFee?: number;
    // Step 4: Byes
    byeRounds: number[];
    // Step 5: Terms
    acceptedTerms: boolean;
}

interface RegistrationWizardProps {
    event: UpcomingEvent;
    sections: TournamentSection[];
    onComplete?: () => void;
}

// ============ TERMS CONTENT ============

const TERMS_CONTENT = `TOURNAMENT HEALTH & SAFETY POLICY

By entering any tournament, players agree that the tournament organizers cannot guarantee that they will not become infected with COVID-19 or other illnesses as a result. Entrants further certify that during the 10-day period before the tournament, unless subsequently testing negative, they have not experienced any symptoms associated with COVID-19, which include fever, cough, or shortness of breath, or had close contact with anyone who is either confirmed or suspected of having COVID-19.

MASK REQUIREMENTS
It is possible that government or venue regulations may require masks. In that case, masks will be required in all public spaces, including for players during games, tournament staff, and other attendees. Updates will be announced on this website.

PAIRINGS & STANDINGS
Players are encouraged to receive pairings by text or email. Standings will be available online on this website prior to entering the playing hall. Pairings will also be posted at the site.

SOCIAL DISTANCING
Please avoid congregating around pairings, standings, or outside the playing hall doors. Social distancing principles should be respected.

SPECTATORS
Non-playing spectators may be restricted depending on circumstances.

BEST PRACTICES
Please limit the number of non-players in tournament areas. For groups of young players, consider assigning one or two parents to wait at any given time to reduce crowding.

PRE-TOURNAMENT HEALTH CHECK
If within 10 days of the tournament you experience any symptoms consistent with COVID-19 (including fever, respiratory distress, or shortness of breath) and do not test negative, please do NOT attend. If you have had close contact with anyone confirmed or suspected of having COVID-19, and do not test negative, please do NOT attend.`;

// ============ HELPER FUNCTIONS ============

const getRating = (member: USCFMember, system: string = "R") => {
    return member.ratings?.find((r) => r.ratingSystem === system)?.rating;
};

const formatExpiration = (date?: string) => {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// ============ MAIN COMPONENT ============

export function RegistrationWizard({ event, sections, onComplete }: RegistrationWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [data, setData] = useState<RegistrationData>({
        uscfId: "",
        playerName: "",
        rating: undefined,
        playerState: "",
        expirationDate: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        stateAddress: "",
        zip: "",
        notificationPref: "email",
        sectionId: "",
        sectionName: "",
        sectionFee: undefined,
        byeRounds: [],
        acceptedTerms: false,
    });

    // Refs for scrolling
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Step 1: USCF Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<USCFMember[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Scroll to step when it changes
    const scrollToStep = useCallback((step: number) => {
        setTimeout(() => {
            stepRefs.current[step - 1]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 150);
    }, []);

    // Advance to next step with scroll
    const advanceToStep = useCallback(
        (nextStep: number) => {
            setCurrentStep(nextStep);
            scrollToStep(nextStep);
        },
        [scrollToStep]
    );

    // ============ STEP 1: USCF SEARCH ============

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!searchQuery.trim() || searchQuery.length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/uscf?query=${encodeURIComponent(searchQuery)}`);
                const result = await res.json();
                // The USCF API returns an array directly or { items: [] }
                setSearchResults(Array.isArray(result) ? result : result.items || []);
            } catch (error) {
                console.error("USCF search error:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchQuery]);

    const handleSelectPlayer = (member: USCFMember) => {
        const rating = getRating(member);
        setData((prev) => ({
            ...prev,
            uscfId: member.id,
            playerName: `${member.firstName} ${member.lastName}`,
            rating: rating,
            playerState: member.stateRep || "",
            expirationDate: member.expirationDate || "",
        }));
        setSearchResults([]);
        setSearchQuery("");
        advanceToStep(2);
    };

    const handleClearPlayer = () => {
        setData((prev) => ({
            ...prev,
            uscfId: "",
            playerName: "",
            rating: undefined,
            playerState: "",
            expirationDate: "",
            email: "",
            phone: "",
            street: "",
            city: "",
            stateAddress: "",
            zip: "",
            notificationPref: "email",
            sectionId: "",
            sectionName: "",
            sectionFee: undefined,
            byeRounds: [],
            acceptedTerms: false,
        }));
        setCurrentStep(1);
    };

    // ============ STEP 2: CONTACT VALIDATION ============

    const isStep2Valid = data.email.includes("@") && data.email.includes(".");

    // ============ STEP 3: SECTION SELECTION ============

    const handleSelectSection = (section: TournamentSection) => {
        setData((prev) => ({
            ...prev,
            sectionId: section.$id,
            sectionName: section.name,
            sectionFee: section.entryFee,
        }));
        advanceToStep(4);
    };

    // ============ STEP 4: BYE SELECTION ============

    const roundCount = event.roundCount || 5;

    const toggleBye = (round: number) => {
        setData((prev) => ({
            ...prev,
            byeRounds: prev.byeRounds.includes(round)
                ? prev.byeRounds.filter((r) => r !== round)
                : [...prev.byeRounds, round],
        }));
    };

    // ============ STEP 5: SUBMIT ============

    const handleSubmit = async () => {
        if (!data.acceptedTerms) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await createRegistration({
                eventId: event.$id,
                sectionId: data.sectionId || undefined,
                uscfId: data.uscfId,
                playerName: data.playerName,
                rating: data.rating,
                playerState: data.playerState || undefined,
                expirationDate: data.expirationDate || undefined,
                email: data.email,
                phone: data.phone || undefined,
                street: data.street || undefined,
                city: data.city || undefined,
                stateAddress: data.stateAddress || undefined,
                zip: data.zip || undefined,
                notificationPref: data.notificationPref,
                byeRounds: data.byeRounds.length > 0 ? data.byeRounds.join(",") : undefined,
                acceptedTerms: true,
            });

            setSubmitSuccess(true);
            onComplete?.();
        } catch (error) {
            console.error("Registration error:", error);
            setSubmitError("Failed to complete registration. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ============ COLLAPSED STEP SUMMARIES ============

    const StepSummary = ({
        stepNumber,
        title,
        summary,
        icon: Icon,
        onEdit,
    }: {
        stepNumber: number;
        title: string;
        summary: string;
        icon: React.ComponentType<{ className?: string }>;
        onEdit: () => void;
    }) => (
        <Card
            className="border-green-500/50 bg-green-500/5 cursor-pointer hover:bg-green-500/10 transition-colors"
            onClick={onEdit}
        >
            <CardContent className="flex items-center gap-4 py-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-sm font-bold">
                    <Check className="h-4 w-4" />
                </div>
                <Icon className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="font-medium">{summary}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </CardContent>
        </Card>
    );

    // ============ SUCCESS STATE ============

    if (submitSuccess) {
        return (
            <Card className="border-green-500/50 bg-green-500/5">
                <CardContent className="py-12 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 text-white">
                        <Check className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Registration Complete!</h2>
                    <p className="text-muted-foreground mb-4">
                        Thank you for registering, {data.playerName}. You will receive a confirmation
                        at {data.email}.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Section: {data.sectionName || "Open"}
                        {data.sectionFee && ` • Entry Fee: $${data.sectionFee}`}
                    </p>
                </CardContent>
            </Card>
        );
    }

    // ============ RENDER ============

    return (
        <div className="space-y-4">
            {/* STEP 1: Player Search */}
            <div ref={(el) => { stepRefs.current[0] = el; }}>
                {currentStep > 1 && data.uscfId ? (
                    <StepSummary
                        stepNumber={1}
                        title="Step 1: Player Profile"
                        summary={`${data.playerName} (${data.uscfId}) • Rating: ${data.rating || "Unr."}`}
                        icon={User}
                        onEdit={handleClearPlayer}
                    />
                ) : (
                    <Card className={currentStep === 1 ? "border-brand" : ""}>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-brand-foreground text-sm font-bold">
                                    1
                                </div>
                                <CardTitle className="flex items-center gap-2">
                                    <Search className="h-5 w-5" />
                                    Find Your USCF Profile
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="uscf-search">Search by Name or USCF ID</Label>
                                <div className="relative mt-1.5">
                                    <Input
                                        id="uscf-search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="e.g., John Smith or 12345678"
                                        className="pr-10"
                                    />
                                    {isSearching && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                            </div>

                            {/* Search Results Table */}
                            {searchResults.length > 0 && (
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                                        <div>Name</div>
                                        <div>ID</div>
                                        <div>Rating</div>
                                        <div>State</div>
                                        <div>Expires</div>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {searchResults.slice(0, 20).map((member) => (
                                            <button
                                                key={member.id}
                                                onClick={() => handleSelectPlayer(member)}
                                                className="w-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 text-left hover:bg-brand/10 transition-colors border-t"
                                            >
                                                <div className="font-medium">
                                                    {member.title && (
                                                        <Badge variant="secondary" className="mr-2 text-xs">
                                                            {member.title}
                                                        </Badge>
                                                    )}
                                                    {member.firstName} {member.lastName}
                                                </div>
                                                <div className="font-mono text-brand">{member.id}</div>
                                                <div className="font-semibold">
                                                    {getRating(member) || "Unr."}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {member.stateRep || "—"}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {formatExpiration(member.expirationDate)}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No members found. Try a different search term.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* STEP 2: Contact Information */}
            {currentStep >= 2 && (
                <div ref={(el) => { stepRefs.current[1] = el; }}>
                    {currentStep > 2 && data.email ? (
                        <StepSummary
                            stepNumber={2}
                            title="Step 2: Contact Information"
                            summary={`${data.email}${data.phone ? ` • ${data.phone}` : ""}`}
                            icon={Mail}
                            onEdit={() => setCurrentStep(2)}
                        />
                    ) : (
                        <Card className={currentStep === 2 ? "border-brand" : ""}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-brand-foreground text-sm font-bold">
                                        2
                                    </div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="h-5 w-5" />
                                        Contact Information
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="email">
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative mt-1.5">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData((prev) => ({ ...prev, email: e.target.value }))
                                                }
                                                placeholder="your@email.com"
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone (optional)</Label>
                                        <div className="relative mt-1.5">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData((prev) => ({ ...prev, phone: e.target.value }))
                                                }
                                                placeholder="(555) 123-4567"
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Notification Preference */}
                                <div>
                                    <Label className="flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        Pairing Notifications
                                    </Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                        {[
                                            { value: "none", label: "None" },
                                            { value: "email", label: "Email" },
                                            { value: "text", label: "Text" },
                                            { value: "both", label: "Both" },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() =>
                                                    setData((prev) => ({
                                                        ...prev,
                                                        notificationPref: option.value as typeof data.notificationPref,
                                                    }))
                                                }
                                                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${data.notificationPref === option.value
                                                        ? "bg-brand text-brand-foreground border-brand"
                                                        : "bg-background hover:bg-muted"
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Optional Address */}
                                <details className="group">
                                    <summary className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                                        <MapPin className="h-4 w-4" />
                                        Add Address (optional)
                                        <ChevronDown className="h-4 w-4 ml-auto group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <Label htmlFor="street">Street Address</Label>
                                            <Input
                                                id="street"
                                                value={data.street}
                                                onChange={(e) =>
                                                    setData((prev) => ({ ...prev, street: e.target.value }))
                                                }
                                                placeholder="123 Main St"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
                                            <div>
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    value={data.city}
                                                    onChange={(e) =>
                                                        setData((prev) => ({ ...prev, city: e.target.value }))
                                                    }
                                                    placeholder="Austin"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="stateAddress">State</Label>
                                                <Input
                                                    id="stateAddress"
                                                    value={data.stateAddress}
                                                    onChange={(e) =>
                                                        setData((prev) => ({
                                                            ...prev,
                                                            stateAddress: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="TX"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="zip">ZIP</Label>
                                                <Input
                                                    id="zip"
                                                    value={data.zip}
                                                    onChange={(e) =>
                                                        setData((prev) => ({ ...prev, zip: e.target.value }))
                                                    }
                                                    placeholder="78701"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </details>

                                <Button
                                    onClick={() => advanceToStep(3)}
                                    disabled={!isStep2Valid}
                                    className="w-full bg-brand hover:bg-brand/90"
                                >
                                    Continue
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* STEP 3: Section Selection */}
            {currentStep >= 3 && (
                <div ref={(el) => { stepRefs.current[2] = el; }}>
                    {currentStep > 3 && data.sectionId ? (
                        <StepSummary
                            stepNumber={3}
                            title="Step 3: Tournament Section"
                            summary={`${data.sectionName}${data.sectionFee ? ` • $${data.sectionFee}` : ""}`}
                            icon={Trophy}
                            onEdit={() => setCurrentStep(3)}
                        />
                    ) : (
                        <Card className={currentStep === 3 ? "border-brand" : ""}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-brand-foreground text-sm font-bold">
                                        3
                                    </div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5" />
                                        Select Your Section
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {sections.length > 0 ? (
                                    sections.map((section) => (
                                        <button
                                            key={section.$id}
                                            onClick={() => handleSelectSection(section)}
                                            className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${data.sectionId === section.$id
                                                    ? "border-brand bg-brand/10"
                                                    : "hover:border-brand/50 hover:bg-muted/50"
                                                }`}
                                        >
                                            <div className="text-left">
                                                <p className="font-semibold">{section.name}</p>
                                                {(section.maxRating || section.minRating) && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {section.minRating && `${section.minRating}+`}
                                                        {section.minRating && section.maxRating && " to "}
                                                        {section.maxRating && `Under ${section.maxRating}`}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                {section.entryFee ? (
                                                    <p className="text-lg font-bold text-brand">
                                                        ${section.entryFee}
                                                    </p>
                                                ) : (
                                                    <p className="text-muted-foreground">
                                                        {event.entryFee || "Free"}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    // No sections defined - use default
                                    <button
                                        onClick={() => {
                                            setData((prev) => ({
                                                ...prev,
                                                sectionId: "",
                                                sectionName: "Open",
                                                sectionFee: undefined,
                                            }));
                                            advanceToStep(4);
                                        }}
                                        className="w-full flex items-center justify-between p-4 rounded-lg border hover:border-brand/50 hover:bg-muted/50 transition-all"
                                    >
                                        <div className="text-left">
                                            <p className="font-semibold">Open Section</p>
                                            <p className="text-sm text-muted-foreground">
                                                All ratings welcome
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-muted-foreground">
                                                {event.entryFee || "Free"}
                                            </p>
                                        </div>
                                    </button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* STEP 4: Bye Selection */}
            {currentStep >= 4 && (
                <div ref={(el) => { stepRefs.current[3] = el; }}>
                    {currentStep > 4 ? (
                        <StepSummary
                            stepNumber={4}
                            title="Step 4: Bye Requests"
                            summary={
                                data.byeRounds.length > 0
                                    ? `Byes requested: Round${data.byeRounds.length > 1 ? "s" : ""} ${data.byeRounds.sort((a, b) => a - b).join(", ")}`
                                    : "No byes requested"
                            }
                            icon={Calendar}
                            onEdit={() => setCurrentStep(4)}
                        />
                    ) : (
                        <Card className={currentStep === 4 ? "border-brand" : ""}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-brand-foreground text-sm font-bold">
                                        4
                                    </div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Bye Requests
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Select any rounds where you need a half-point bye (unable to play).
                                </p>
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                    {Array.from({ length: roundCount }, (_, i) => i + 1).map((round) => (
                                        <button
                                            key={round}
                                            onClick={() => toggleBye(round)}
                                            className={`p-3 rounded-lg border text-center font-medium transition-all ${data.byeRounds.includes(round)
                                                    ? "bg-brand text-brand-foreground border-brand"
                                                    : "hover:border-brand/50 hover:bg-muted/50"
                                                }`}
                                        >
                                            Round {round}
                                            {data.byeRounds.includes(round) && (
                                                <Check className="h-4 w-4 mx-auto mt-1" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    onClick={() => advanceToStep(5)}
                                    className="w-full bg-brand hover:bg-brand/90"
                                >
                                    Continue
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* STEP 5: Terms & Conditions */}
            {currentStep >= 5 && (
                <div ref={(el) => { stepRefs.current[4] = el; }}>
                    <Card className={currentStep === 5 ? "border-brand" : ""}>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-brand-foreground text-sm font-bold">
                                    5
                                </div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Terms & Conditions
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="max-h-64 overflow-y-auto p-4 rounded-lg bg-muted/50 border">
                                <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground leading-relaxed">
                                    {TERMS_CONTENT}
                                </pre>
                            </div>

                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.acceptedTerms}
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, acceptedTerms: e.target.checked }))
                                    }
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                                />
                                <span className="text-sm">
                                    I have read, understand, and agree to the terms and conditions above,
                                    including the tournament health and safety policy.
                                </span>
                            </label>

                            {submitError && (
                                <p className="text-sm text-red-500">{submitError}</p>
                            )}

                            <Button
                                onClick={handleSubmit}
                                disabled={!data.acceptedTerms || isSubmitting}
                                className="w-full bg-brand hover:bg-brand/90"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Complete Registration
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
