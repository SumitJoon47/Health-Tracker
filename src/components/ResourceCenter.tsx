
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Phone, MessageCircle, Book, Headphones } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CBTExercises } from "@/components/CBTExercises";
import { TherapyChatbot } from "@/components/TherapyChatbot";

const resources = [
  {
    icon: Phone,
    title: "Emergency Hotline",
    description: "24/7 support for mental health emergencies",
    action: "Call 112",
    variant: "default" as const,
  },
  {
    icon: MessageCircle,
    title: "Therapy Check-in",
    description: "Guided questions to track your mental health",
    action: "Start Check-in",
    variant: "therapeutic" as const,
  },
  {
    icon: Headphones,
    title: "Guided Meditation",
    description: "5-minute breathing exercise for anxiety relief",
    action: "Start Session",
    variant: "wellness" as const,
  },
  {
    icon: Book,
    title: "CBT Exercises",
    description: "Cognitive behavioral therapy techniques",
    action: "Learn More",
    variant: "calm" as const,
  },
];

export const ResourceCenter = () => {
  const handleGuidedMeditation = () => {
    window.open("https://youtu.be/W19PdslW7iw?si=I9rUKqBWrw359uoX", "_blank");
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Mental Health Resources</h2>
        <p className="text-muted-foreground">
          Professional help and support tools when you need them
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          
          // Special handling for guided meditation
          if (resource.title === "Guided Meditation") {
            return (
              <Card key={index} variant="elevated" className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    variant={resource.variant} 
                    className="w-full"
                    onClick={handleGuidedMeditation}
                  >
                    {resource.action}
                  </Button>
                </CardContent>
              </Card>
            );
          }
          
          // Special handling for CBT exercises
          if (resource.title === "CBT Exercises") {
            return (
              <Card key={index} variant="elevated" className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={resource.variant} className="w-full">
                        {resource.action}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>CBT Exercises</DialogTitle>
                      </DialogHeader>
                      <CBTExercises />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          }
          
          // Special handling for Therapy Check-in
          if (resource.title === "Therapy Check-in") {
            return (
              <Card key={index} variant="elevated" className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={resource.variant} className="w-full">
                        {resource.action}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Therapy Check-in</DialogTitle>
                      </DialogHeader>
                      <TherapyChatbot />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          }
          
          // Default handling for other resources
          return (
            <Card key={index} variant="elevated" className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </div>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant={resource.variant} className="w-full">
                  {resource.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card variant="soft" className="text-center">
        <CardContent className="pt-6">
          <Heart className="w-8 h-8 text-therapeutic mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Remember: You are not alone. Professional help is available and seeking support is a sign of strength.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
