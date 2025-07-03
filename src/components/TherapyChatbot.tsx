
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export const TherapyChatbot = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm here to support your mental wellness journey. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [sessionData, setSessionData] = useState<{questions: string[], responses: Record<string, string>}>({
    questions: [],
    responses: {}
  });

  const addMessage = (type: 'bot' | 'user', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendResponse = () => {
    if (!currentResponse.trim()) return;
    
    addMessage('user', currentResponse);
    
    // Save response to session data
    const lastBotMessage = messages.filter(m => m.type === 'bot').pop();
    if (lastBotMessage) {
      setSessionData(prev => ({
        ...prev,
        responses: { ...prev.responses, [lastBotMessage.content]: currentResponse }
      }));
    }
    
    setCurrentResponse("");
    
    // Add supportive bot response
    setTimeout(() => {
      const supportiveResponses = [
        "Thank you for sharing that with me. Your feelings are valid.",
        "I appreciate you being open about this. How does it feel to express that?",
        "That sounds challenging. You're doing great by talking about it.",
        "Thank you for trusting me with this. What would help you feel better right now?"
      ];
      const randomResponse = supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
      addMessage('bot', randomResponse);
    }, 1000);
  };

  const handleSaveSession = () => {
    if (messages.length <= 1) {
      toast({
        title: "No Session Data",
        description: "Please interact with the chatbot before saving.",
        variant: "destructive",
      });
      return;
    }

    const therapySession = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      questions: sessionData.questions,
      responses: sessionData.responses,
      messages: messages,
      sessionType: "therapy-chatbot"
    };

    const existingSessions = JSON.parse(localStorage.getItem("therapySessions") || "[]");
    localStorage.setItem("therapySessions", JSON.stringify([...existingSessions, therapySession]));

    toast({
      title: "Therapy Session Saved",
      description: "Your conversation has been saved for review.",
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center p-6 bg-gradient-to-br from-therapeutic/20 to-primary/10 rounded-xl border border-primary/20">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
          <MessageCircle className="w-8 h-8 text-primary" />
          Therapy Chatbot
        </h2>
        <p className="text-muted-foreground text-lg">
          Your AI companion for mental health support and guided conversations
        </p>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Conversation</CardTitle>
            <Badge variant="secondary">{messages.length} messages</Badge>
          </div>
        </CardHeader>
        
        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4 bg-gradient-to-b from-background/50 to-muted/20">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'bot' ? 'bg-therapeutic/20 border border-therapeutic/30' : 'bg-primary border border-primary/30'
                }`}>
                  {message.type === 'bot' ? (
                    <Bot className="w-4 h-4 text-therapeutic" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`p-3 rounded-lg shadow-sm ${
                  message.type === 'bot' 
                    ? 'bg-white/80 text-gray-800 border border-therapeutic/20' 
                    : 'bg-primary text-white'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'bot' ? 'text-gray-500' : 'text-primary-foreground/70'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        
        {/* Input */}
        <div className="border-t border-border/50 p-4 bg-white/50 backdrop-blur-sm">
          <div className="flex gap-3">
            <Textarea
              placeholder="Type your response here..."
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              className="flex-1 min-h-[60px] resize-none bg-white/80"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendResponse();
                }
              }}
            />
            <Button 
              onClick={handleSendResponse}
              disabled={!currentResponse.trim()}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
            <Button variant="outline" size="sm" onClick={handleSaveSession}>
              Save Session
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
