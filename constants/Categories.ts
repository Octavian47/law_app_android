/**
 * Law categories for Swiss Law App
 */

export interface LawCategory {
  id: string;
  name: {
    de: string;
    en: string;
    fr?: string;
    it?: string;
  };
  icon: string;
  color: string;
  description: {
    de: string;
    en: string;
  };
}

export const Categories: Record<string, LawCategory> = {
  traffic: {
    id: 'traffic',
    name: {
      de: 'Verkehrsrecht',
      en: 'Traffic Law',
      fr: 'Droit de la circulation',
      it: 'Diritto della circolazione',
    },
    icon: 'car',
    color: '#4A90E2',
    description: {
      de: 'Strassenverkehrsgesetze und Verkehrsregeln',
      en: 'Road traffic laws and regulations',
    },
  },
  criminal: {
    id: 'criminal',
    name: {
      de: 'Strafrecht',
      en: 'Criminal Law',
      fr: 'Droit pénal',
      it: 'Diritto penale',
    },
    icon: 'gavel',
    color: '#E53935',
    description: {
      de: 'Strafgesetzbuch und Strafprozessordnung',
      en: 'Criminal code and criminal procedure',
    },
  },
  civil: {
    id: 'civil',
    name: {
      de: 'Zivilrecht',
      en: 'Civil Law',
      fr: 'Droit civil',
      it: 'Diritto civile',
    },
    icon: 'people',
    color: '#7B68EE',
    description: {
      de: 'Zivilgesetzbuch und Obligationenrecht',
      en: 'Civil code and law of obligations',
    },
  },
  commercial: {
    id: 'commercial',
    name: {
      de: 'Handelsrecht',
      en: 'Commercial Law',
      fr: 'Droit commercial',
      it: 'Diritto commerciale',
    },
    icon: 'briefcase',
    color: '#FF9800',
    description: {
      de: 'Handelsregister und Handelsrecht',
      en: 'Commercial register and commercial law',
    },
  },
  administrative: {
    id: 'administrative',
    name: {
      de: 'Verwaltungsrecht',
      en: 'Administrative Law',
      fr: 'Droit administratif',
      it: 'Diritto amministrativo',
    },
    icon: 'document',
    color: '#26A69A',
    description: {
      de: 'Verwaltungsverfahren und öffentliches Recht',
      en: 'Administrative procedures and public law',
    },
  },
  constitutional: {
    id: 'constitutional',
    name: {
      de: 'Verfassungsrecht',
      en: 'Constitutional Law',
      fr: 'Droit constitutionnel',
      it: 'Diritto costituzionale',
    },
    icon: 'book',
    color: '#8D6E63',
    description: {
      de: 'Bundesverfassung und Grundrechte',
      en: 'Federal constitution and fundamental rights',
    },
  },
};

export const getCategoryById = (id: string): LawCategory | undefined => {
  return Categories[id];
};

export const getAllCategories = (): LawCategory[] => {
  return Object.values(Categories);
};