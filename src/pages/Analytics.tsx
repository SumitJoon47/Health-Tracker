import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMoodData } from "@/hooks/useMoodData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Calendar, TrendingUp, Smile, Activity } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const COLORS = ["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--primary))", "hsl(var(--therapeutic))"];

export default function Analytics() {
  const { getMoodAnalytics, moodEntries } = useMoodData();
  const analytics = getMoodAnalytics();

  // Prepare data for charts
  const last7Days = moodEntries
    .filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return entryDate >= sevenDaysAgo;
    })
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      mood: entry.mood,
      label: entry.label,
    }));

  const moodDistributionData = Object.entries(analytics.moodDistribution).map(([mood, count]) => ({
    mood,
    count,
  }));

  const weeklyAverage = last7Days.length > 0 
    ? (last7Days.reduce((sum, day) => sum + day.mood, 0) / last7Days.length).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mood Analytics</h1>
          <p className="text-muted-foreground">
            Track your emotional patterns and wellness journey
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="therapeutic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <Calendar className="h-4 w-4 text-therapeutic" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-therapeutic-foreground">{analytics.totalEntries}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card variant="wellness">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
              <Smile className="h-4 w-4 text-secondary-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary-foreground">
                {analytics.averageMood.toFixed(1)}/5
              </div>
              <p className="text-xs text-muted-foreground">Monthly average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{weeklyAverage}/5</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Days</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{last7Days.length}/7</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>7-Day Mood Trend</CardTitle>
              <CardDescription>Your mood patterns over the last week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      domain={[1, 5]}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Mood Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>How often you experience each mood</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ mood, count }) => `${mood}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {moodDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Mood Frequency Bar Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Mood Frequency</CardTitle>
              <CardDescription>Count of each mood type in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="mood" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--therapeutic))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {analytics.totalEntries === 0 && (
          <Card className="mt-8">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Start tracking your mood to see analytics and insights here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}