
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

interface BehavioralActivationProps {
  onComplete: () => void;
}

interface Activity {
  id: number;
  name: string;
  description: string;
  scheduledTime: string;
  completed: boolean;
}

export const BehavioralActivation = ({ onComplete }: BehavioralActivationProps) => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    scheduledTime: "",
  });

  const handleAddActivity = () => {
    if (!newActivity.name || !newActivity.scheduledTime) {
      toast({
        title: "Missing Information",
        description: "Please enter an activity name and scheduled time.",
        variant: "destructive",
      });
      return;
    }

    const activity: Activity = {
      id: Date.now(),
      name: newActivity.name,
      description: newActivity.description,
      scheduledTime: newActivity.scheduledTime,
      completed: false,
    };

    setActivities(prev => [...prev, activity]);
    setNewActivity({ name: "", description: "", scheduledTime: "" });
  };

  const handleRemoveActivity = (id: number) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const handleToggleComplete = (id: number) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const handleSubmit = () => {
    if (activities.length === 0) {
      toast({
        title: "No Activities",
        description: "Please add at least one activity to your schedule.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    const existingRecords = JSON.parse(localStorage.getItem("behavioralActivation") || "[]");
    const newRecord = {
      id: Date.now(),
      activities,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("behavioralActivation", JSON.stringify([...existingRecords, newRecord]));

    toast({
      title: "Activity Plan Saved",
      description: "Your behavioral activation plan has been saved successfully!",
    });

    onComplete();
  };

  const suggestedActivities = [
    "Take a 10-minute walk",
    "Call a friend or family member",
    "Listen to uplifting music",
    "Practice deep breathing",
    "Do a creative activity",
    "Organize a small space",
    "Read a few pages of a book",
    "Take a warm shower/bath",
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">About Behavioral Activation</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            Behavioral activation involves scheduling positive activities to improve mood and energy levels. 
            Start with small, achievable activities and gradually build up to more challenging ones.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h4 className="font-medium">Add New Activity</h4>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="activity-name">Activity Name</Label>
            <Input
              id="activity-name"
              placeholder="e.g., Take a walk"
              value={newActivity.name}
              onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-description">Description (optional)</Label>
            <Textarea
              id="activity-description"
              placeholder="Additional details about the activity..."
              value={newActivity.description}
              onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled-time">Scheduled Time</Label>
            <Input
              id="scheduled-time"
              type="datetime-local"
              value={newActivity.scheduledTime}
              onChange={(e) => setNewActivity(prev => ({ ...prev, scheduledTime: e.target.value }))}
            />
          </div>

          <Button onClick={handleAddActivity} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Activity
          </Button>
        </div>
      </div>

      {suggestedActivities.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Suggested Activities</h4>
          <div className="flex flex-wrap gap-2">
            {suggestedActivities.map((activity, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => setNewActivity(prev => ({ ...prev, name: activity }))}
              >
                {activity}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {activities.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Your Activity Schedule</h4>
          <div className="space-y-3">
            {activities.map((activity) => (
              <Card key={activity.id} className={activity.completed ? "bg-green-50 border-green-200" : ""}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={activity.completed}
                          onChange={() => handleToggleComplete(activity.id)}
                          className="rounded"
                        />
                        <h5 className={`font-medium ${activity.completed ? "line-through text-muted-foreground" : ""}`}>
                          {activity.name}
                        </h5>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {activity.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Scheduled: {new Date(activity.scheduledTime).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveActivity(activity.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleSubmit} className="w-full" disabled={activities.length === 0}>
        Save Activity Plan
      </Button>
    </div>
  );
};
