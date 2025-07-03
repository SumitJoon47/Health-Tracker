import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useMoodData } from "@/hooks/useMoodData";
import { Navigation } from "@/components/Navigation";
import { CalendarDays, Smile } from "lucide-react";

export default function MoodCalendar() {
  const { moodEntries } = useMoodData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Create a map of dates to mood data
  const moodMap = moodEntries.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    acc[date] = entry;
    return acc;
  }, {} as Record<string, typeof moodEntries[0]>);

  const selectedDateEntry = selectedDate ? moodMap[selectedDate.toDateString()] : null;

  const getMoodColor = (mood: number) => {
    const colors = {
      1: "hsl(var(--destructive))",
      2: "hsl(var(--warning))", 
      3: "hsl(var(--muted-foreground))",
      4: "hsl(var(--primary))",
      5: "hsl(var(--success))"
    };
    return colors[mood as keyof typeof colors] || "hsl(var(--muted))";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <CalendarDays className="h-8 w-8 text-primary" />
            Mood Calendar
          </h1>
          <p className="text-muted-foreground">
            Visual overview of your mood patterns over time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Mood Calendar</CardTitle>
              <CardDescription>
                Click on any date to see your mood entry for that day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  mood: (date) => moodMap[date.toDateString()] !== undefined,
                }}
                modifiersStyles={{
                  mood: { backgroundColor: "hsl(var(--primary-light))", color: "hsl(var(--primary-foreground))" }
                }}
                components={{
                  Day: ({ day, ...props }) => {
                    const entry = moodMap[day.date.toDateString()];
                    return (
                      <div className="relative w-full h-full flex items-center justify-center" {...props}>
                        <span>{day.date.getDate()}</span>
                        {entry && (
                          <div 
                            className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white"
                            style={{ backgroundColor: getMoodColor(entry.mood) }}
                          />
                        )}
                      </div>
                    );
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          <div className="space-y-6">
            <Card variant="therapeutic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-therapeutic-foreground">
                  <Smile className="h-5 w-5" />
                  Selected Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate && (
                  <div className="space-y-4">
                    <p className="font-medium text-therapeutic-foreground">
                      {formatDate(selectedDate)}
                    </p>
                    
                    {selectedDateEntry ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{selectedDateEntry.emoji}</span>
                          <div>
                            <p className="font-semibold text-therapeutic-foreground">
                              {selectedDateEntry.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Mood: {selectedDateEntry.mood}/5
                            </p>
                          </div>
                        </div>
                        
                        {selectedDateEntry.note && (
                          <div className="bg-therapeutic-light p-3 rounded-md">
                            <p className="text-sm text-therapeutic-foreground">
                              <strong>Note:</strong> {selectedDateEntry.note}
                            </p>
                          </div>
                        )}
                        
                        {selectedDateEntry.tags.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-therapeutic-foreground mb-2">Tags:</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedDateEntry.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-therapeutic text-therapeutic-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">
                          No mood entry for this date
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mood Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { mood: 5, label: "Great", emoji: "😊" },
                    { mood: 4, label: "Good", emoji: "🙂" },
                    { mood: 3, label: "Okay", emoji: "😐" },
                    { mood: 2, label: "Poor", emoji: "😔" },
                    { mood: 1, label: "Terrible", emoji: "😫" },
                  ].map((item) => (
                    <div key={item.mood} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: getMoodColor(item.mood) }}
                      />
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Calendar Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{moodEntries.length}</p>
                <p className="text-sm text-muted-foreground">Total entries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {moodEntries.filter(e => e.mood >= 4).length}
                </p>
                <p className="text-sm text-muted-foreground">Good days</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-therapeutic">
                  {moodEntries.length > 0 ? Math.round((moodEntries.filter(e => e.mood >= 4).length / moodEntries.length) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Positive mood rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}