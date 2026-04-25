import type { TranslationDictionary } from './types';

export const aboutTranslations = {
  en: {
    'about.title': 'About Nexus CRM',
    'about.version': 'Version',
    'about.buildDate': 'Build Date',
    'about.description': 'A personal productivity dashboard built for focus.',
    'about.techStack': 'Tech Stack',
    'about.license': 'License',
    'about.licenseValue': 'MIT — Open Source',
  },
  es: {
    'about.title': 'Acerca de Nexus CRM',
    'about.version': 'Versión',
    'about.buildDate': 'Fecha de Compilación',
    'about.description': 'Un panel de productividad personal diseñado para el enfoque.',
    'about.techStack': 'Stack Tecnológico',
    'about.license': 'Licencia',
    'about.licenseValue': 'MIT — Código Abierto',
  },
} as const satisfies TranslationDictionary;
