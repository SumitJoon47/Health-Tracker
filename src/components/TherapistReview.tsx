
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Calendar, TrendingUp, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CBTData {
  thoughtRecords: any[];
  distortionRecords: any[];
  behavioralActivation: any[];
  therapySessions: any[];
}

export const TherapistReview = () => {
  const { toast } = useToast();
  const [cbtData, setCbtData] = useState<CBTData>({
    thoughtRecords: [],
    distortionRecords: [],
    behavioralActivation: [],
    therapySessions: []
  });
  const [review, setReview] = useState("");
  const [recommendations, setRecommendations] = useState("");

  useEffect(() => {
    // Load all CBT data from localStorage
    const thoughtRecords = JSON.parse(localStorage.getItem("thoughtRecords") || "[]");
    const distortionRecords = JSON.parse(localStorage.getItem("distortionRecords") || "[]");
    const behavioralActivation = JSON.parse(localStorage.getItem("behavioralActivation") || "[]");
    const therapySessions = JSON.parse(localStorage.getItem("therapySessions") || "[]");

    setCbtData({
      thoughtRecords,
      distortionRecords,
      behavioralActivation,
      therapySessions
    });
  }, []);

  const generateAutoReview = () => {
    const totalExercises = cbtData.thoughtRecords.length + cbtData.distortionRecords.length + cbtData.behavioralActivation.length;
    const totalSessions = cbtData.therapySessions.length;
    
    let autoReview = `Clinical Summary:\n\n`;
    
    if (totalExercises > 0) {
      autoReview += `The client has completed ${totalExercises} CBT exercises, demonstrating engagement with therapeutic interventions.\n\n`;
      
      if (cbtData.thoughtRecords.length > 0) {
        autoReview += `Thought Record Analysis: ${cbtData.thoughtRecords.length} entries show the client is actively identifying triggers and challenging automatic thoughts.\n\n`;
      }
      
      if (cbtData.distortionRecords.length > 0) {
        autoReview += `Cognitive Distortion Work: ${cbtData.distortionRecords.length} exercises indicate awareness of thinking patterns and efforts to reframe negative thoughts.\n\n`;
      }
      
      if (cbtData.behavioralActivation.length > 0) {
        autoReview += `Behavioral Activation: ${cbtData.behavioralActivation.length} activity plans suggest proactive approach to mood management.\n\n`;
      }
    }
    
    if (totalSessions > 0) {
      autoReview += `Therapy Check-ins: ${totalSessions} sessions completed, showing consistent self-monitoring and reflection.\n\n`;
    }
    
    autoReview += `Recommendations:\n`;
    autoReview += `- Continue regular CBT practice\n`;
    autoReview += `- Focus on identifying patterns in thought records\n`;
    autoReview += `- Implement behavioral activation strategies consistently\n`;
    autoReview += `- Consider professional therapy support for deeper exploration`;
    
    setReview(autoReview);
  };

  const saveReview = () => {
    const reviewData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      review,
      recommendations,
      dataAnalyzed: {
        thoughtRecords: cbtData.thoughtRecords.length,
        distortionRecords: cbtData.distortionRecords.length,
        behavioralActivation: cbtData.behavioralActivation.length,
        therapySessions: cbtData.therapySessions.length
      }
    };

    const existingReviews = JSON.parse(localStorage.getItem("therapistReviews") || "[]");
    localStorage.setItem("therapistReviews", JSON.stringify([...existingReviews, reviewData]));

    toast({
      title: "Review Saved",
      description: "Therapist review has been saved successfully.",
    });
  };

  const totalExercises = cbtData.thoughtRecords.length + cbtData.distortionRecords.length + cbtData.behavioralActivation.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          Therapist Review & Analysis
        </h2>
        <p className="text-muted-foreground">
          Comprehensive analysis of your CBT exercise progress
        </p>
      </div>

      {/* Data Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="therapeutic">
          <CardContent className="pt-6 text-center">
            <Calendar className="w-8 h-8 text-therapeutic mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapeutic-foreground">{cbtData.thoughtRecords.length}</p>
            <p className="text-sm text-muted-foreground">Thought Records</p>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardContent className="pt-6 text-center">
            <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{cbtData.distortionRecords.length}</p>
            <p className="text-sm text-muted-foreground">Distortion Analysis</p>
          </CardContent>
        </Card>
        
        <Card variant="wellness">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{cbtData.behavioralActivation.length}</p>
            <p className="text-sm text-muted-foreground">Activity Plans</p>
          </CardContent>
        </Card>
        
        <Card variant="soft">
          <CardContent className="pt-6 text-center">
            <Award className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{cbtData.therapySessions.length}</p>
            <p className="text-sm text-muted-foreground">Therapy Sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>Your CBT journey snapshot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Total Exercises: {totalExercises}</Badge>
              <Badge variant="secondary">Check-ins: {cbtData.therapySessions.length}</Badge>
              <Badge variant={totalExercises > 5 ? "default" : "outline"}>
                {totalExercises > 5 ? "Active Participant" : "Getting Started"}
              </Badge>
            </div>
            
            <Button onClick={generateAutoReview} variant="outline" className="w-full">
              Generate AI Review Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Section */}
      <Card>
        <CardHeader>
          <CardTitle>Therapist Review</CardTitle>
          <CardDescription>Clinical analysis and observations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter clinical review and analysis..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-[200px]"
          />
          
          <Textarea
            placeholder="Recommendations and next steps..."
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
            className="min-h-[100px]"
          />
          
          <Button onClick={saveReview} className="w-full" disabled={!review}>
            Save Therapist Review
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
