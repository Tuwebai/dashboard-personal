import type { TranslationDictionary } from './types';

export const habitsTranslations = {
  en: {
    'habits.title': 'Habits Dashboard',
    'habits.subtitle': 'Consistency is the key to transformation.',
    'habits.newHabit': 'New Habit',
    'habits.habitName': 'Habit Name',
    'habits.habitPlaceholder': 'e.g., Daily Meditation',
    'habits.noHabits': 'No habits found',
    'habits.noHabitsDesc': 'Try searching in another category or create a new one.',
    'habits.createHabit': 'Create Habit',
    'habits.category': 'Category',
    'habits.created': 'Habit created.',
    'habits.habitDeleted': 'Habit deleted.',
  },
  es: {
    'habits.title': 'Panel de Hábitos',
    'habits.subtitle': 'La constancia es la clave de la transformación.',
    'habits.newHabit': 'Nuevo Hábito',
    'habits.habitName': 'Nombre del hábito',
    'habits.habitPlaceholder': 'Ej: Meditación diaria',
    'habits.noHabits': 'No se encontraron hábitos',
    'habits.noHabitsDesc': 'Intenta buscar en otra categoría o crea uno nuevo.',
    'habits.createHabit': 'Crear Hábito',
    'habits.category': 'Categoría',
    'habits.created': 'Hábito creado.',
    'habits.habitDeleted': 'Hábito eliminado.',
  },
} as const satisfies TranslationDictionary;
