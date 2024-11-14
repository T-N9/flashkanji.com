import ContributionSection from "@/components/Home/ContributionSection";
import ExampleSection from "@/components/Home/ExampleSection";
import HeroSection from "@/components/Home/HeroSection";
import JukugoSection from "@/components/Home/JukugoSection";
import QuizSection from "@/components/Home/QuizSection";
import ViewerSection from "@/components/Home/ViewerSection";
import { FlashDetailModal } from "@/components/modals/KanjiDetailModal";

export default function Home() {
  return (
    <main>
      <HeroSection/>
      <ExampleSection/>
      <ViewerSection/>
      <JukugoSection/>
      <QuizSection/>
      <ContributionSection/>
      <FlashDetailModal />
    </main>
  );
}
