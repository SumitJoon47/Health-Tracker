
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface CognitiveDistortionsProps {
  onComplete: () => void;
}

const distortions = [
  {
    id: "all-or-nothing",
    name: "All-or-Nothing Thinking",
    description: "Seeing things in black and white categories",
    example: "If I'm not perfect, I'm a failure"
  },
  {
    id: "overgeneralization",
    name: "Overgeneralization",
    description: "Drawing broad conclusions from single events",
    example: "I failed this test, I'll never succeed"
  },
  {
    id: "mental-filter",
    name: "Mental Filter",
    description: "Focusing only on negative details",
    example: "Ignoring compliments and focusing on one criticism"
  },
  {
    id: "jumping-conclusions",
    name: "Jumping to Conclusions",
    description: "Making negative assumptions without evidence",
    example: "They didn't text back, they must be angry"
  },
  {
    id: "catastrophizing",
    name: "Catastrophizing",
    description: "Expecting the worst possible outcome",
    example: "If I make a mistake, I'll be fired"
  },
  {
    id: "emotional-reasoning",
    name: "Emotional Reasoning",
    description: "Believing that feelings reflect reality",
    example: "I feel stupid, so I must be stupid"
  },
];

export const CognitiveDistortions = ({ onComplete }: CognitiveDistortionsProps) => {
  const { toast } = useToast();
  const [selectedDistortions, setSelectedDistortions] = useState<string[]>([]);
  const [thought, setThought] = useState("");
  const [reframedThought, setReframedThought] = useState("");

  const handleDistortionToggle = (distortionId: string) => {
    setSelectedDistortions(prev => 
      prev.includes(distortionId) 
        ? prev.filter(id => id !== distortionId)
        : [...prev, distortionId]
    );
  };

  const handleSubmit = () => {
    if (!thought || selectedDistortions.length === 0) {
      toast({
        title: "Incomplete Exercise",
        description: "Please enter a thought and select at least one cognitive distortion.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    const existingRecords = JSON.parse(localStorage.getItem("distortionRecords") || "[]");
    const newRecord = {
      id: Date.now(),
      thought,
      selectedDistortions,
      reframedThought,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("distortionRecords", JSON.stringify([...existingRecords, newRecord]));

    toast({
      title: "Exercise Completed",
      description: "Your cognitive distortion analysis has been saved!",
    });

    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="thought">Negative Thought</Label>
          <Textarea
            id="thought"
            placeholder="Enter a negative or distressing thought you've had recently..."
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-3">
          <Label>Identify Cognitive Distortions (select all that apply):</Label>
          <div className="grid gap-3">
            {distortions.map((distortion) => (
              <Card key={distortion.id} className="p-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={distortion.id}
                    checked={selectedDistortions.includes(distortion.id)}
                    onCheckedChange={() => handleDistortionToggle(distortion.id)}
                  />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={distortion.id} className="font-medium cursor-pointer">
                      {distortion.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {distortion.description}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Example: "{distortion.example}"
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reframed">Reframed Thought</Label>
          <Textarea
            id="reframed"
            placeholder="Rewrite your thought in a more balanced, realistic way..."
            value={reframedThought}
            onChange={(e) => setReframedThought(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">How to Use This Exercise:</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Write down a negative thought you've had recently</li>
            <li>Review the list of cognitive distortions and check any that apply</li>
            <li>Reframe your original thought in a more balanced way</li>
            <li>Consider: What would you tell a friend in this situation?</li>
          </ol>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} className="w-full">
        Complete Exercise
      </Button>
    </div>
  );
};
