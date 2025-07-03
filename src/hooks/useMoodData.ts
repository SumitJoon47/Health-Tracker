import { useState, useEffect } from "react";

export interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  label: string;
  emoji: string;
  note?: string;
  tags: string[];
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood?: number;
  tags: string[];
  timestamp: number;
}

const MOOD_STORAGE_KEY = "mood-tracker-data";
const JOURNAL_STORAGE_KEY = "journal-entries-data";

export const useMoodData = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMoods = localStorage.getItem(MOOD_STORAGE_KEY);
    const savedJournals = localStorage.getItem(JOURNAL_STORAGE_KEY);
    
    if (savedMoods) {
      try {
        setMoodEntries(JSON.parse(savedMoods));
      } catch (error) {
        console.error("Failed to parse mood data:", error);
      }
    }
    
    if (savedJournals) {
      try {
        setJournalEntries(JSON.parse(savedJournals));
      } catch (error) {
        console.error("Failed to parse journal data:", error);
      }
    }
  }, []);

  const saveMoodEntry = (mood: {
    value: number;
    label: string;
    emoji: string;
    note?: string;
    tags?: string[];
  }) => {
    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: mood.value,
      label: mood.label,
      emoji: mood.emoji,
      note: mood.note || "",
      tags: mood.tags || [],
      timestamp: Date.now(),
    };

    const updatedEntries = [...moodEntries, entry];
    setMoodEntries(updatedEntries);
    localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedEntries));
    
    return entry;
  };

  const saveJournalEntry = (content: string, tags: string[] = [], mood?: number) => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content,
      mood,
      tags,
      timestamp: Date.now(),
    };

    const updatedEntries = [...journalEntries, entry];
    setJournalEntries(updatedEntries);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
    
    return entry;
  };

  const deleteMoodEntry = (id: string) => {
    const updatedEntries = moodEntries.filter(entry => entry.id !== id);
    setMoodEntries(updatedEntries);
    localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedEntries));
  };

  const deleteJournalEntry = (id: string) => {
    const updatedEntries = journalEntries.filter(entry => entry.id !== id);
    setJournalEntries(updatedEntries);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
  };

  const getMoodAnalytics = () => {
    const last30Days = moodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    });

    const moodCounts = last30Days.reduce((acc, entry) => {
      acc[entry.label] = (acc[entry.label] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageMood = last30Days.length > 0 
      ? last30Days.reduce((sum, entry) => sum + entry.mood, 0) / last30Days.length 
      : 0;

    return {
      totalEntries: last30Days.length,
      averageMood,
      moodDistribution: moodCounts,
      dailyData: last30Days,
    };
  };

  return {
    moodEntries,
    journalEntries,
    saveMoodEntry,
    saveJournalEntry,
    deleteMoodEntry,
    deleteJournalEntry,
    getMoodAnalytics,
  };
};