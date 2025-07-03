
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThoughtRecord } from "@/components/exercises/ThoughtRecord";
import { CognitiveDistortions } from "@/components/exercises/CognitiveDistortions";
import { BehavioralActivation } from "@/components/exercises/BehavioralActivation";
import { TherapistReview } from "@/components/TherapistReview";
import { CheckCircle, ArrowLeft, ArrowRight, Brain, FileText } from "lucide-react";

export const CBTExercises = () => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("thought-record");

  const exercises = [
    {
      id: "thought-record",
      title: "Thought Record Sheet",
      description: "Identify and examine your thoughts and emotions",
      component: ThoughtRecord,
    },
    {
      id: "cognitive-distortions",
      title: "Cognitive Distortion Identifier",
      description: "Recognize common thinking patterns that may be unhelpful",
      component: CognitiveDistortions,
    },
    {
      id: "behavioral-activation",
      title: "Behavioral Activation",
      description: "Plan positive activities to improve your mood",
      component: BehavioralActivation,
    },
    {
      id: "therapist-review",
      title: "Therapist Review",
      description: "Professional analysis and recommendations",
      component: TherapistReview,
    },
  ];

  const currentIndex = exercises.findIndex(ex => ex.id === currentTab);
  const canGoNext = currentIndex < exercises.length - 1;
  const canGoPrev = currentIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentTab(exercises[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentTab(exercises[currentIndex - 1].id);
    }
  };

  const markCompleted = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises([...completedExercises, exerciseId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">CBT Exercises</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Cognitive Behavioral Therapy (CBT) exercises help you identify and change unhelpful thought patterns. 
          Work through these interactive exercises at your own pace.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="flex items-center gap-1">
            {completedExercises.includes(exercise.id) ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-muted" />
            )}
            <span className="text-xs text-muted-foreground">
              {exercise.id === "therapist-review" ? "Review" : exercise.title.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Exercise Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {exercises.map((exercise) => (
            <TabsTrigger 
              key={exercise.id} 
              value={exercise.id}
              className="text-xs sm:text-sm"
            >
              <div className="flex items-center gap-1">
                {completedExercises.includes(exercise.id) && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
                {exercise.id === "therapist-review" ? (
                  <FileText className="w-3 h-3" />
                ) : null}
                {exercise.id === "therapist-review" ? "Review" : exercise.title.split(' ')[0]}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {exercises.map((exercise) => {
          const ExerciseComponent = exercise.component;
          return (
            <TabsContent key={exercise.id} value={exercise.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {exercise.title}
                    {completedExercises.includes(exercise.id) && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExerciseComponent onComplete={() => markCompleted(exercise.id)} />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={!canGoPrev}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} of {exercises.length}
        </div>
        
        <Button 
          onClick={handleNext}
          disabled={!canGoNext}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
