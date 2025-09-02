import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";
import { uploadDocument, getDocuments, searchDocuments, Document, SearchResult } from "@/lib/api/docs";
import { Upload, Search, File, FileText, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Documents() {
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { 
    data: documents = [], 
    refetch: refetchDocuments,
    isLoading: isLoadingDocs 
  } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Ungültiger Dateityp",
        description: "Nur PDF und DOCX Dateien sind erlaubt.",
        variant: "destructive",
      });
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      
      await uploadDocument(file);
      await refetchDocuments();
      
      toast({
        title: "Datei hochgeladen",
        description: `${file.name} wurde erfolgreich hochgeladen.`,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Upload fehlgeschlagen"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setError(null);
      setIsSearching(true);
      
      const results = await searchDocuments(query);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "Keine Ergebnisse",
          description: "Keine Dokumente gefunden für diese Suchanfrage.",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Suche fehlgeschlagen"));
    } finally {
      setIsSearching(false);
    }
  };

  const retryOperation = () => {
    setError(null);
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dokumenten-Abruf</h1>
        <p className="text-muted-foreground">
          Laden Sie Dokumente hoch und durchsuchen Sie diese intelligent nach Informationen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="estate-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Dokument hochladen
            </CardTitle>
            <CardDescription>
              Unterstützte Formate: PDF, DOCX
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Datei hierher ziehen oder klicken zum Auswählen
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Lädt hoch...
                  </>
                ) : (
                  "Datei auswählen"
                )}
              </Button>
            </div>

            {/* Document List */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Hochgeladene Dokumente</h4>
              {isLoadingDocs ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8">
                  <File className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Noch keine Dokumente hochgeladen
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(doc.size)}</span>
                          <span>•</span>
                          <span>{formatDate(doc.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Section */}
        <Card className="estate-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Dokumente durchsuchen
            </CardTitle>
            <CardDescription>
              Suchen Sie nach spezifischen Informationen in Ihren Dokumenten.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nach Inhalten suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
              />
              <Button
                onClick={() => handleSearch(searchQuery)}
                disabled={isSearching || !searchQuery.trim()}
                className="px-3"
              >
                {isSearching ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            <ErrorBoundary error={error} onRetry={retryOperation} />

            {/* Search Results */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Suchergebnisse</h4>
              {searchResults.length === 0 && searchQuery && !isSearching ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Keine Ergebnisse für "{searchQuery}" gefunden
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Geben Sie eine Suchanfrage ein
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <div key={result.id} className="p-4 border border-border rounded-lg hover:bg-muted/30">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-sm text-foreground">{result.title}</h5>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {Math.round(result.relevance * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {result.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        <span>{result.document}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}