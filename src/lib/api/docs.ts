// EstateFlow Documents API
import { request } from './base';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  content?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  document: string;
  relevance: number;
}

export async function uploadDocument(file: File): Promise<Document> {
  return request<Document>('POST', '/documents/upload', {
    id: Math.random().toString(36).substr(2, 9),
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: new Date(),
    content: `Mock content für ${file.name}`,
  });
}

export async function getDocuments(): Promise<Document[]> {
  return request<Document[]>('GET', '/documents', [
    {
      id: 'doc-1',
      name: 'Q4_Marktbericht_Sued.pdf',
      type: 'application/pdf',
      size: 2048576,
      uploadedAt: new Date('2024-01-15'),
    },
    {
      id: 'doc-2', 
      name: 'Portfolio_Analyse_2024.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 1024768,
      uploadedAt: new Date('2024-01-10'),
    },
  ]);
}

export async function searchDocuments(query: string): Promise<SearchResult[]> {
  return request<SearchResult[]>('POST', '/documents/search', [
    {
      id: 'result-1',
      title: 'Q4 Marktbericht Süd - Rendite-Analyse',
      excerpt: 'Die durchschnittliche Rendite in Süddeutschland beträgt 4,2% und zeigt positive Entwicklung...',
      document: 'Q4_Marktbericht_Sued.pdf',
      relevance: 0.95,
    },
    {
      id: 'result-2',
      title: 'Portfolio Performance Q4',
      excerpt: 'Das Gesamtportfolio erreichte eine Rendite von 4,1% bei einer Belegungsquote von 91%...',
      document: 'Portfolio_Analyse_2024.docx', 
      relevance: 0.78,
    },
  ].filter(result => 
    result.title.toLowerCase().includes(query.toLowerCase()) ||
    result.excerpt.toLowerCase().includes(query.toLowerCase())
  ));
}