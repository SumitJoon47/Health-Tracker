
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, TrendingUp, BookOpen } from "lucide-react";

export const WellnessHero = () => {
  return (
    <div className="relative min-h-96 rounded-2xl overflow-hidden">
      {/* Background Gradient inspired by nature */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-300">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-therapeutic/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-96 p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Mental Wellness Journey
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Track your mood, reflect through journaling, and access mental health resources 
            in a safe, supportive environment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
              <Heart className="w-5 h-5" />
              Start Tracking
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
              <BookOpen className="w-5 h-5" />
              Learn More
            </Button>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <Card variant="soft" className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <Heart className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm text-white/90 font-medium">Daily Mood Tracking</p>
              </CardContent>
            </Card>
            <Card variant="soft" className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm text-white/90 font-medium">Secure Journaling</p>
              </CardContent>
            </Card>
            <Card variant="soft" className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm text-white/90 font-medium">Progress Insights</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
