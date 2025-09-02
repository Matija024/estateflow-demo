// EstateFlow Q&A Chat API
import { request } from './base';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export interface ContextSource {
  id: string;
  name: string;
  type: 'document' | 'market-data' | 'portfolio';
  selected: boolean;
}

export async function askQuestion(
  question: string,
  selectedSources: string[]
): Promise<ChatMessage> {
  return request<ChatMessage>('POST', '/chat/ask', {
    id: Math.random().toString(36).substr(2, 9),
    role: 'assistant',
    content: generateMockResponse(question, selectedSources),
    timestamp: new Date(),
    sources: selectedSources,
  });
}

export async function getContextSources(): Promise<ContextSource[]> {
  return request<ContextSource[]>('GET', '/chat/sources', [
    {
      id: 'doc-1',
      name: 'Q4 Marktbericht Süd',
      type: 'document',
      selected: true,
    },
    {
      id: 'doc-2',
      name: 'Portfolio Analyse 2024', 
      type: 'document',
      selected: false,
    },
    {
      id: 'market-1',
      name: 'Aktuelle Marktdaten',
      type: 'market-data',
      selected: true,
    },
    {
      id: 'portfolio-1',
      name: 'Portfolio Kennzahlen',
      type: 'portfolio',
      selected: false,
    },
  ]);
}

function generateMockResponse(question: string, sources: string[]): string {
  const responses = [
    'Basierend auf den ausgewählten Dokumenten zeigt die Analyse eine durchschnittliche Rendite von 4,2% für die betrachtete Region.',
    'Die Marktdaten bestätigen einen positiven Trend mit einem Wachstum der Mietpreise um 2,1% im letzten Quartal.',
    'Laut Portfolio-Analyse liegt die Belegungsquote bei 88,3% und die Gesamtperformance über dem Marktdurchschnitt.',
    'Die Dokumentenanalyse empfiehlt eine diversifizierte Strategie mit Fokus auf Ballungsräume und stabilen Cashflow.',
    'Aus den verfügbaren Quellen ergibt sich eine positive Markteinschätzung für die nächsten 12 Monate.',
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  const sourceInfo = sources.length > 0 
    ? ` Diese Antwort basiert auf ${sources.length} ausgewählten Quelle(n).`
    : ' Bitte wählen Sie Kontext-Quellen aus für genauere Antworten.';
    
  return randomResponse + sourceInfo;
}