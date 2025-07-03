import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMoodData } from "@/hooks/useMoodData";
import { BookOpen, Save, Plus, X, History } from "lucide-react";

export const JournalEntry = () => {
  const [entry, setEntry] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();
  const { saveJournalEntry } = useMoodData();

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
    if (!entry.trim()) {
      toast({
        title: "Empty Entry",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    saveJournalEntry(entry, tags);
    
    toast({
      title: "Journal Saved",
      description: "Your thoughts have been recorded safely.",
    });
    
    setEntry("");
    setTags([]);
  };

  return (
    <Card variant="wellness" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-secondary-foreground">
          <BookOpen className="w-5 h-5" />
          Journal Entry
        </CardTitle>
        <CardDescription>
          Express your thoughts and feelings. This is a safe space for reflection.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="What's on your mind today? How are you feeling? Any thoughts you'd like to record..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="min-h-32 resize-none border-secondary/30 focus:border-secondary-accent"
        />
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-secondary-foreground block mb-2">
              Tags (optional)
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add tag (e.g., gratitude, goals, reflection)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="border-secondary/30 focus:border-secondary-accent"
              />
              <Button
                variant="wellness"
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
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {entry.length} characters
            </p>
            <div className="flex gap-2">
              <Button variant="calm" asChild>
                <a href="/journal-history">
                  <History className="w-4 h-4" />
                  View History
                </a>
              </Button>
              <Button onClick={handleSave} variant="wellness">
                <Save className="w-4 h-4" />
                Save Entry
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};