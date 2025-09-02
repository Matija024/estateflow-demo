import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useToast } from "@/hooks/use-toast";
import { askQuestion, getContextSources, ChatMessage, ContextSource } from "@/lib/api/chat";
import { Send, MessageCircle, FileText, BarChart3, FolderOpen, User, Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const { 
    data: contextSources = [],
    isLoading: isLoadingSources 
  } = useQuery({
    queryKey: ['context-sources'],
    queryFn: getContextSources
  });

  // Initialize selected sources when data loads
  useEffect(() => {
    if (contextSources.length > 0 && selectedSources.length === 0) {
      const defaultSelected = contextSources
        .filter(source => source.selected)
        .map(source => source.id);
      setSelectedSources(defaultSelected);
    }
  }, [contextSources, selectedSources.length]);

  const handleSourceToggle = (sourceId: string, checked: boolean) => {
    setSelectedSources(prev => 
      checked 
        ? [...prev, sourceId]
        : prev.filter(id => id !== sourceId)
    );
  };

  const handleAskQuestion = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = inputMessage;
    setInputMessage("");

    try {
      setError(null);
      setIsAsking(true);

      const response = await askQuestion(currentQuestion, selectedSources);
      setMessages(prev => [...prev, response]);

      if (selectedSources.length === 0) {
        toast({
          title: "Keine Quellen ausgewählt",
          description: "Wählen Sie Kontext-Quellen für genauere Antworten aus.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Fehler beim Senden der Frage"));
    } finally {
      setIsAsking(false);
    }
  };

  const retryLastQuestion = () => {
    setError(null);
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        handleAskQuestion();
      }
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'market-data': return <BarChart3 className="w-4 h-4" />;
      case 'portfolio': return <FolderOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Fragen & Antworten</h1>
        <p className="text-muted-foreground">
          Stellen Sie kontextuelle Fragen zu Ihren Dokumenten und erhalten Sie KI-basierte Antworten.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Context Sources Panel */}
        <div className="lg:col-span-1">
          <Card className="estate-card h-full">
            <CardHeader>
              <CardTitle className="text-lg">Kontext-Quellen</CardTitle>
              <CardDescription>
                Wählen Sie die Quellen für die KI-Antworten aus.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingSources ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-3">
                  {contextSources.map((source) => (
                    <div key={source.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={source.id}
                        checked={selectedSources.includes(source.id)}
                        onCheckedChange={(checked) => 
                          handleSourceToggle(source.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <label 
                          htmlFor={source.id}
                          className="flex items-start gap-2 cursor-pointer"
                        >
                          {getSourceIcon(source.type)}
                          <div>
                            <p className="text-sm font-medium leading-none">{source.name}</p>
                            <p className="text-xs text-muted-foreground mt-1 capitalize">
                              {source.type.replace('-', ' ')}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Hinweis:</strong> Antworten beziehen sich auf die ausgewählten Quellen. 
                  Wählen Sie relevante Dokumente für bessere Ergebnisse.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="estate-card h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                KI-Assistent
              </CardTitle>
              <CardDescription>
                Stellen Sie Fragen zu den ausgewählten Dokumenten und Datenquellen.
              </CardDescription>
            </CardHeader>
            
            {/* Messages Area */}
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">
                      Beginnen Sie das Gespräch
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Stellen Sie eine Frage zu den ausgewählten Dokumenten, um zu beginnen.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {isAsking && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm text-muted-foreground">
                        Antwort wird generiert...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <ErrorBoundary error={error} onRetry={retryLastQuestion} className="mb-4" />

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  placeholder="Stelle Fragen zu den ausgewählten Dokumenten..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAskQuestion();
                    }
                  }}
                  disabled={isAsking}
                  className="flex-1"
                />
                <Button
                  onClick={handleAskQuestion}
                  disabled={isAsking || !inputMessage.trim()}
                  className="px-3 estate-gradient"
                >
                  {isAsking ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}