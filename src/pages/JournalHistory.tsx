import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMoodData } from "@/hooks/useMoodData";
import { Navigation } from "@/components/Navigation";
import { BookOpen, Search, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function JournalHistory() {
  const { journalEntries, deleteJournalEntry } = useMoodData();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredEntries = journalEntries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => b.timestamp - a.timestamp);

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    toast({
      title: "Entry Deleted",
      description: "Your journal entry has been removed.",
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMoodEmoji = (mood?: number) => {
    if (!mood) return "";
    const moodMap: Record<number, string> = {
      1: "😫", 2: "😔", 3: "😐", 4: "🙂", 5: "😊"
    };
    return moodMap[mood] || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Journal History
          </h1>
          <p className="text-muted-foreground">
            Your personal thoughts and reflections over time
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search your journal entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        <div className="space-y-6">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <Card key={entry.id} variant="wellness" className="transition-all hover:shadow-therapeutic">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-secondary-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(entry.timestamp)}
                        {entry.mood && (
                          <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {formatTime(entry.timestamp)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-card-foreground whitespace-pre-wrap leading-relaxed">
                      {entry.content}
                    </p>
                  </div>
                  
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {entry.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : journalEntries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No journal entries yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start writing your thoughts and reflections to build your personal journal.
                </p>
                <Button variant="therapeutic" asChild>
                  <a href="/">Start Journaling</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No matching entries</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms to find specific journal entries.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats Footer */}
        {journalEntries.length > 0 && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <p>
                  You have written <span className="font-semibold text-foreground">{journalEntries.length}</span> journal entries 
                  with a total of <span className="font-semibold text-foreground">
                    {journalEntries.reduce((sum, entry) => sum + entry.content.length, 0).toLocaleString()}
                  </span> characters
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}