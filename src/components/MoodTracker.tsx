import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMoodData } from "@/hooks/useMoodData";
import { BarChart3, Plus, X } from "lucide-react";

const moods = [
  { emoji: "😫", label: "Terrible", value: 1, color: "destructive" },
  { emoji: "😔", label: "Poor", value: 2, color: "warning" },
  { emoji: "😐", label: "Okay", value: 3, color: "muted" },
  { emoji: "🙂", label: "Good", value: 4, color: "secondary" },
  { emoji: "😊", label: "Great", value: 5, color: "success" },
];

export const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const { saveMoodEntry } = useMoodData();

  const handleMoodSelect = (mood: typeof moods[0]) => {
    setSelectedMood(mood.value);
    setShowDetails(true);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (selectedMood) {
      const moodData = moods.find(m => m.value === selectedMood)!;
      saveMoodEntry({
        value: moodData.value,
        label: moodData.label,
        emoji: moodData.emoji,
        note,
        tags,
      });
      
      toast({
        title: "Mood Tracked",
        description: `You're feeling ${moodData.label.toLowerCase()} today. Entry saved!`,
      });

      // Reset form
      setSelectedMood(null);
      setNote("");
      setTags([]);
      setShowDetails(false);
    }
  };

  return (
    <Card variant="therapeutic" className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-therapeutic">How are you feeling today?</CardTitle>
        <CardDescription>
          Track your daily mood to help identify patterns and progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-2">
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? "therapeutic" : "calm"}
              className="h-16 w-full flex-col gap-1 text-2xl"
              onClick={() => handleMoodSelect(mood)}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs font-normal">{mood.label}</span>
            </Button>
          ))}
        </div>
        {showDetails && selectedMood && (
          <div className="space-y-4 p-4 bg-therapeutic-light rounded-md">
            <div className="text-center">
              <p className="text-sm font-medium text-therapeutic-foreground mb-3">
                Selected mood: {moods.find(m => m.value === selectedMood)?.emoji} {moods.find(m => m.value === selectedMood)?.label}
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-therapeutic-foreground block mb-2">
                  Add a note (optional)
                </label>
                <Input
                  placeholder="What affected your mood today?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="bg-background border-therapeutic/30"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-therapeutic-foreground block mb-2">
                  Tags (optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add tag (e.g., work, family, health)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="bg-background border-therapeutic/30"
                  />
                  <Button
                    variant="therapeutic"
                    size="sm"
                    onClick={addTag}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedMood(null);
                  setNote("");
                  setTags([]);
                }}
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button variant="calm" asChild>
                  <a href="/analytics">
                    <BarChart3 className="w-4 h-4" />
                    View Analytics
                  </a>
                </Button>
                <Button onClick={handleSave} variant="therapeutic">
                  Save Entry
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};