import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { UpcomingEvents } from "@/components/landing/UpcomingEvents";
import { WeeklyEvents } from "@/components/landing/WeeklyEvents";
import { Resources } from "@/components/landing/Resources";
import { FAQs } from "@/components/landing/FAQs";
import { ContactUs } from "@/components/landing/ContactUs";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <UpcomingEvents />
        <WeeklyEvents />
        <Resources />
        <FAQs />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}
