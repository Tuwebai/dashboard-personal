export interface JournalEntry {
  id: string;
  createdAt: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  linkedDate?: string;
  linkedArea?: string;
}
