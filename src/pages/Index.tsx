import { WellnessHero } from "@/components/WellnessHero";
import { MoodTracker } from "@/components/MoodTracker";
import { JournalEntry } from "@/components/JournalEntry";
import { ResourceCenter } from "@/components/ResourceCenter";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <WellnessHero />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Mood and Journal Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <MoodTracker />
          </div>
          <JournalEntry />
        </div>
        
        {/* Resources Section */}
        <ResourceCenter />
      </div>
      
      {/* Footer */}
      <footer className="bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            This app is designed to support your mental wellness journey. 
            For professional help, please consult a qualified mental health provider.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
