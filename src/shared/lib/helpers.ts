import type { TaskPriority, TaskStatus, HabitCategory, TransactionType, HabitLog } from '../types';

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
};

export const PRIORITY_BG: Record<TaskPriority, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: '#6b7280',
  todo: '#3b82f6',
  in_progress: '#8b5cf6',
  review: '#f59e0b',
  done: '#22c55e',
};

export const STATUS_BG: Record<TaskStatus, string> = {
  backlog: 'bg-gray-500/20 text-gray-400',
  todo: 'bg-blue-500/20 text-blue-400',
  in_progress: 'bg-violet-500/20 text-violet-400',
  review: 'bg-amber-500/20 text-amber-400',
  done: 'bg-green-500/20 text-green-400',
};

export const HABIT_CATEGORY_COLORS: Record<HabitCategory, string> = {
  health: '#22c55e',
  mind: '#8b5cf6',
  work: '#3b82f6',
  social: '#ec4899',
  finance: '#f59e0b',
  other: '#6b7280',
};

export const TRANSACTION_TYPE_COLORS: Record<TransactionType, string> = {
  income: '#22c55e',
  expense: '#ef4444',
  transfer: '#3b82f6',
};

export const CATEGORY_ICONS: Record<string, string> = {
  Housing: '🏠',
  Food: '🍔',
  Transport: '🚗',
  Health: '💊',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Education: '📚',
  Subscriptions: '📱',
  Income: '💰',
  Investment: '📈',
  Salary: '💼',
  Freelance: '🖥️',
  Transfer: '↔️',
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const getTimeBasedGreeting = (name: string, lang: 'en' | 'es' = 'en'): string => {
  const hour = new Date().getHours();
  
  if (lang === 'es') {
    if (hour < 12) return `Buenos días, ${name} ☀️`;
    if (hour < 19) return `Buenas tardes, ${name} 🌤️`;
    return `Buenas noches, ${name} 🌙`;
  }
  
  if (hour < 12) return `Good morning, ${name} ☀️`;
  if (hour < 17) return `Good afternoon, ${name} 🌤️`;
  if (hour < 21) return `Good evening, ${name} 🌆`;
  return `Good night, ${name} 🌙`;
};

export const calculateReadingTime = (content: string): number => {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

export const calculateWordCount = (content: string): number => {
  return content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
};

export const isOverdue = (dueDate: string | undefined): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
};

export const getDaysUntilDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const today = new Date(new Date().toDateString());
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const getStreakColor = (streak: number): string => {
  if (streak >= 30) return '#f59e0b';
  if (streak >= 14) return '#f97316';
  if (streak >= 7) return '#ef4444';
  return '#6b7280';
};

export const getBudgetStatus = (spent: number, total: number): 'ok' | 'warning' | 'danger' => {
  const percentage = (spent / total) * 100;
  if (percentage >= 100) return 'danger';
  if (percentage >= 80) return 'warning';
  return 'ok';
};

export const KANBAN_COLUMNS: { id: TaskStatus; color: string }[] = [
  { id: 'backlog', color: '#6b7280' },
  { id: 'todo', color: '#3b82f6' },
  { id: 'in_progress', color: '#8b5cf6' },
  { id: 'review', color: '#f59e0b' },
  { id: 'done', color: '#22c55e' },
];

export const EVENT_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#f59e0b', '#22c55e', '#06b6d4',
  '#6366f1', '#84cc16', '#a855f7', '#14b8a6',
];

export const QUOTES = {
  en: [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  ],
  es: [
    { text: "El secreto para salir adelante es empezar.", author: "Mark Twain" },
    { text: "El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el valor para continuar.", author: "Winston Churchill" },
    { text: "La única manera de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
    { text: "No mires el reloj; haz lo que él hace. Sigue adelante.", author: "Sam Levenson" },
    { text: "Cree que puedes y estarás a mitad de camino.", author: "Theodore Roosevelt" },
    { text: "Tu tiempo es limitado, no lo desperdicies viviendo la vida de otro.", author: "Steve Jobs" },
    { text: "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.", author: "Proverbio Chino" },
  ]
};

export const getTodayQuote = (lang: 'en' | 'es' = 'en'): { text: string; author: string } => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const quotesList = QUOTES[lang] || QUOTES.en;
  return quotesList[dayOfYear % quotesList.length];
};

export const getHabitStats = (habitId: string, logs: HabitLog[]) => {
  const habitLogs = logs.filter(l => l.habitId === habitId).sort((a, b) => b.date.localeCompare(a.date));
  let longestStreak = 0;
  let currentTemp = 0;
  
  habitLogs.forEach(l => {
    if (l.completed) {
      currentTemp++;
      if (currentTemp > longestStreak) longestStreak = currentTemp;
    } else {
      currentTemp = 0;
    }
  });
  
  return { 
    currentStreak: currentTemp, 
    longestStreak, 
    totalCompleted: habitLogs.filter(l => l.completed).length 
  };
};
