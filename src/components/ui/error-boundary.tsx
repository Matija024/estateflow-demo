import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ErrorBoundaryProps {
  error: Error | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBoundary({ error, onRetry, className }: ErrorBoundaryProps) {
  if (!error) return null;

  return (
    <div className={`estate-card border-destructive/20 bg-destructive/5 ${className || ''}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          <h3 className="font-semibold text-destructive mb-2">
            Ein Fehler ist aufgetreten
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            {error.message || "Unerwarteter Fehler beim Laden der Daten."}
          </p>
          
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Erneut versuchen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}