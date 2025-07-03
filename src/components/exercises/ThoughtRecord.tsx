
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ThoughtRecordProps {
  onComplete: () => void;
}

export const ThoughtRecord = ({ onComplete }: ThoughtRecordProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    situation: "",
    emotion: "",
    emotionIntensity: "",
    automaticThought: "",
    evidence: "",
    alternativeThought: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.situation || !formData.emotion || !formData.automaticThought) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the situation, emotion, and automatic thought fields.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    const existingRecords = JSON.parse(localStorage.getItem("thoughtRecords") || "[]");
    const newRecord = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("thoughtRecords", JSON.stringify([...existingRecords, newRecord]));

    toast({
      title: "Thought Record Saved",
      description: "Your thought record has been saved successfully!",
    });

    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="situation">Situation</Label>
          <Textarea
            id="situation"
            placeholder="Describe the situation that triggered your emotional response..."
            value={formData.situation}
            onChange={(e) => handleInputChange("situation", e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emotion">Emotion</Label>
            <Input
              id="emotion"
              placeholder="e.g., anxious, sad, angry"
              value={formData.emotion}
              onChange={(e) => handleInputChange("emotion", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity (1-10)</Label>
            <Input
              id="intensity"
              type="number"
              min="1"
              max="10"
              placeholder="1-10"
              value={formData.emotionIntensity}
              onChange={(e) => handleInputChange("emotionIntensity", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="thought">Automatic Thought</Label>
          <Textarea
            id="thought"
            placeholder="What thought went through your mind when you felt this way?"
            value={formData.automaticThought}
            onChange={(e) => handleInputChange("automaticThought", e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="evidence">Evidence</Label>
          <Textarea
            id="evidence"
            placeholder="What evidence supports or contradicts this thought?"
            value={formData.evidence}
            onChange={(e) => handleInputChange("evidence", e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alternative">Alternative Thought</Label>
          <Textarea
            id="alternative"
            placeholder="What's a more balanced or helpful way to think about this situation?"
            value={formData.alternativeThought}
            onChange={(e) => handleInputChange("alternativeThought", e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <h4 className="font-medium mb-2">Instructions:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Identify the specific situation that triggered your emotional response</li>
            <li>• Name the emotion and rate its intensity from 1-10</li>
            <li>• Write down the automatic thought that popped into your mind</li>
            <li>• Examine the evidence for and against this thought</li>
            <li>• Develop a more balanced, realistic alternative thought</li>
          </ul>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} className="w-full">
        Save Thought Record
      </Button>
    </div>
  );
};
