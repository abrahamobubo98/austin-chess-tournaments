"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "What is the USCF and why do I need an ID?",
        answer: `The USCF is The United States Chess Federation. Membership in the USCF allows the chess player to participate in our National Rating System. A USCF membership is necessary to play in most tournaments in the US.

Players in 3rd grade or lower who are playing in a section that is restricted to 3rd grade and under (usually called K-3 or Primary) may play in that section as a non-member ("the JTP program"). The registrar can obtain a USCF ID for the player as a courtesy. That ID number must be renewed to full membership as soon as the player reaches 4th grade or the player wishes to play in a section that includes players in 4th grade or higher.

Once you have a USCF ID, it is yours for life. A membership can be renewed at any point, even after lapsing years previously. The same goes for a rating. It stays with the membership, going up and down according to the results of tournament play over the course of a person's lifetime.`,
    },
    {
        question: "What is a bye?",
        answer: `A "bye" is simply a request for a player to miss a round without being withdrawn from the tournament.

In person events
For most local tournaments, one 1/2 pt. bye is available for any round that you must miss, if requested before the start of round 2. Additional byes will be at 0- pts. Some multiple-day tournaments will allow additional 1/2 point byes. Requesting byes is not the norm. Most players will play all rounds in an event and request no byes.

Online events
Many online events, including tournaments held on ChessKid.com, do not allow byes. Please be prepared to play all games.`,
    },
    {
        question: "What do I do if I can't come to the tournament?",
        answer: `If you have registered for a tournament and cannot attend, it is very important to contact the organizer asap. Often, if the withdrawal is made early enough, a full or partial refund may be obtained. When you register and complete payment, the organizer takes it as a sign of your attendance and will pair your chess player into the tournament. Not showing up will leave your intended opponent sitting at the board – waiting. The same goes for leaving a tournament early.

At in person events, always notify the computer room before you leave an in person event.

If you wish to withdraw from an online event, you may X out of the event. Once you withdraw from an online event, you may not reenter.`,
    },
    {
        question: "What if I show up late for a round?",
        answer: `In person events: If you know in advance that you will be late, simply request a bye for the round you might miss. For most in person scholastic tournaments, any player missing an opponent at the start in round 1 will be repaired asap. In subsequent rounds, the missing player has an hour or his personal 'full playing' time to arrive, whichever is shorter. (E.g. In a G/30 tournament the opponent would be required to wait for 30 minutes.) In our local tournaments, an effort to contact the missing player will be made. We want everyone to get a game each round! However, if a player makes this behavior a habit, that player will not be allowed to register for future events.

Online events: No byes are allowed for most online events. If a player registers and pays, he is expected to show up for each game. Each round begins automatically.

If you show up late for round 1, you will not play in the tournament. All players must 'enter' the online tournament system no later than 8:45am in order to complete.

If you play round 1 but show up late for a future round, you can still play the game. When a round begins, the player who has white will see his clock begin to tick down. After he makes a move, his clock stops and the player with black will see his clock tick down. If a player shows up late, his clock will simply continue to tick down until he makes a move. When a player runs out of time, his game is over and he loses. It is best for online quick events to stay close to the computer and watch for the start of each round. If you do miss a game, please let the help desk know immediately if you wish to continue playing in the tournament.`,
    },
    {
        question: "How long does the tournament last?",
        answer: `Our local in person scholastic tournaments are all day events. Please plan to arrive a minimum of 30 minutes before round 1 begins, and stay thru the awards ceremony. Five rounds of G/30 typically takes 6 to 7 hours.

In many of our smaller local events, the rounds are schedule on an 'as soon as possible' basis. In this case, and round schedule posted is APPROXIMATE. If a game requires TD intervention or perhaps runs long, or we have technical difficulties with computer or printer, the schedule might run late. If the games finish more quickly than anticipated, we might run ahead of schedule.

Regardless, please know we will encourage the schedule to progress as quickly as is humanly possible, but only in as much as it benefits the chess players.

Local online events move much more quickly. At the upcoming 2021 Region VI Championships, there will be 5 minutes between the end of the last game of a section and the beginning of the next round in that section. If you finish your game early, you might be tempted to leave the tournament screen. Do not exit out of the tournament until the completion of all rounds! Do not leave the tournament lobby, play puzzles, or play other Fast Chess games, or you risk not being paired for the next round, or automatic tournament removal. When your game is over, you may watch other players' games. To do this, go into observation mode (binoculars icon) and watch any remaining games so that you'll have a good idea of when the next round is about to begin.

This tournament lobby also shows the number of games remaining, which should give you a good idea how long until the next round begins. There will be a 5 minute break between the last game of your section completing and the beginning of your next round. Do not match other opponents. there is also a 5-second audible countdown right before the game is about to start. – turn your speakers up! Your game will start automatically.

When your last game is completed, you may leave ChessKid. Final results will be shared after all full play is reviewed for fair play.`,
    },
    {
        question: "Do parents have to stay? Who is responsible for the players?",
        answer: `In person events
We have a limited staff at each in person tournament. The organizers and TD's will be responsible for the players while they are playing their rounds within the tournament hall. However, once the player leaves the playing hall, parents and coaches must take over that responsibility. Parents and/or coaches, please provide age- appropriate activities during the time between rounds. You are responsible for your players between games! If it is discovered that a child has been left unattended and no responsible party has remained on-site, that child will be withdrawn from the tournament and the parents contacted for immediate pick-up.

Parents, another reason to be onsite involves your child's emotional well-being. Occasionally losses are very traumatic. If you are available for your child immediately after a tough loss, recovery time is much quicker. "We can't win them all" is a difficult concept for kids!

When you register a youth for a scholastic tournament you are agreeing a list of Parental/Coach Responsibilities!`,
    },
    {
        question: "What do we do about lunch?",
        answer: `In person events
Chess players will naturally get hungry during the day. Playing chess requires fuel to keep those brain cells firing! At each Rocks & Rooks in person tournament concessions are offered for sale. At a minimum pizza and drinks are served at lunchtime. Oftentimes the fare is much more varied, and sometimes breakfast is offered as well. You are, of course, welcome to bring a cooler for you family, or 'pack a lunch'. However, concessions are offered in most cases by the host school's chess club as a type of fund raiser. It's for a good cause!`,
    },
    {
        question: "What is a Swiss System?",
        answer: `A Swiss System is simply a chess tournament pairing system which allows players to play all rounds regardless of whether they are winning or losing. No one is 'eliminated' because of a loss. Instead, players will be paired based upon how well they are are doing in the tournament. Barring unusual circumstances, a player with x points, however obtained, would play another player with the same number of points.`,
    },
    {
        question: "What is notation?",
        answer: `Chess notation is simply a form of shorthand for writing down the moves of a chess game. In order to improve in chess, it is important to be able to review games. This is a great way of accessing previously played games. In addition, completed notation is required to enforce many chess rules. Algebraic notation is standard in the US. There are many online resources available for learning notation.

At in person events ALL players are highly encouraged to take notation, and it is a requirement in most in person tournament sections when the time control is G/30 or longer. Bring two sharpened pencils and a notation book if possible. At many events, notation sheets will be provided. Pencils and pens are the responsibility of the chess player, and necessary for filling out results slips as well as notation sheets.

Online events do not require hand written notation, as the system records the moves for you. For online tournaments on ChessKid.com players can access their game history to analyze their previous games at www.chesskid.com/me/game-history.`,
    },
    {
        question: "Can I watch the chess games?",
        answer: `In general, during local in person scholastic events parents and coaches are required to stay out of the room where the children are playing while the games are in progress. At some events parents may escort a player into the playing hall, but should leave quietly when requested to do so. Keeping adults out of the playing hall helps the chess players to focus on their games and keeps parents from trying to 'help' out of enthusiasm – or despair.

Online events can be a bit different. Parents will be able to watch their child's game on another computer/device in a different room. They will need to create a Parent Account on ChessKid (which is free). They should then go to www.chesskid.com/play/fastchess, click on the globe, enter in their child's tournament usernaname in the search box, and click on the binoculars.`,
    },
    {
        question: "What are the benefits of playing with a team?",
        answer: `At in person events, teammates are not paired against one another, if possible. (Per TCA guidelines, players who train with a school chess club but do not attend that school cannot be considered team members in TCA sponsored events.) In most tournaments, teams are defined also by the section in which the team is participating, e.g. the same school could field two teams at the same tournament – one in a K-3 section and one in a K-6 section. The top 4 players in a section are used for determining a team's total points, but all team members are considered 'part of the team.' At some tournaments the organizer might allow a school to break it's players into multiple teams within the same section, but those different teams could possibly be paired against one another.

Online events are a bit different. Some systems allow for teams to be declared, and some do not. Please review the tournament description in question to see if teams will receive awards and whether teammates will be paired against one another.`,
    },
    {
        question: "What are tie-breaks?",
        answer: `In any chess tournament, more than one player can end up with the same score. In the case of tournaments with money-prizes, the prize money is divided evenly between participants who have tied. Trophies cannot be divided. Therefore, we use various tie-break systems to determine places, though all players in that grouping can rightfully say they tied for x-place. Tie-break systems used locally include: Modified Median, Solkoff, Cumulative, & CumOp.

Sonneborg-Berger is the primary tie-break used by ChessKid.com.`,
    },
];

function FAQAccordionItem({ item, isOpen, onToggle }: {
    item: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="border-b border-border last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex items-start justify-between gap-4 py-6 text-left hover:bg-muted/50 transition-colors px-4 -mx-4 rounded-lg"
            >
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {item.question}
                </h2>
                <span className="flex-shrink-0 mt-1">
                    {isOpen ? (
                        <Minus className="h-6 w-6 text-primary" />
                    ) : (
                        <Plus className="h-6 w-6 text-primary" />
                    )}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="pb-6 text-muted-foreground whitespace-pre-line leading-relaxed">
                    {item.answer}
                </div>
            </div>
        </div>
    );
}

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set());

    const toggleItem = (index: number) => {
        setOpenItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Everything you need to know about our chess tournaments
                        </p>
                    </div>

                    {/* FAQ List */}
                    <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
                        {faqData.map((item, index) => (
                            <FAQAccordionItem
                                key={index}
                                item={item}
                                isOpen={openItems.has(index)}
                                onToggle={() => toggleItem(index)}
                            />
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground mb-4">
                            Still have questions? We&apos;re here to help!
                        </p>
                        <Link href="/#contact">
                            <Button size="lg">Contact Us</Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
