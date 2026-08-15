import { UserProfile } from '../types';

export type UserPlanType = 'test' | 'basic' | 'pro' | 'premium' | 'custom';

export interface PlanDefinition {
  id: UserPlanType;
  name: string;
  badge: string;
  price: string;
  maxEbooksQuota: number;
  maxChapters: number;
  maxWordsPerChapter: number;
  canExport: boolean;
  description: string;
  features: string[];
  popular?: boolean;
}

export const PLAN_PRESETS: Record<UserPlanType, PlanDefinition> = {
  test: {
    id: 'test',
    name: 'Plano Teste Grátis',
    badge: 'Degustação',
    price: 'Grátis',
    maxEbooksQuota: 1,
    maxChapters: 2,
    maxWordsPerChapter: 500,
    canExport: false,
    description: 'Ideal para experimentar a qualidade e inteligência da plataforma.',
    features: [
      'Criar 1 e-book para teste',
      'Até 2 capítulos por livro',
      'Até 500 palavras por capítulo',
      'Limite de 1 e-book por dia',
      'Validade de 30 dias',
      'Leitura na plataforma em tempo real',
      'Gerador de Capa com I.A.'
    ]
  },
  basic: {
    id: 'basic',
    name: 'Plano Básico',
    badge: 'Essencial',
    price: 'R$ 29,90',
    maxEbooksQuota: 3,
    maxChapters: 5,
    maxWordsPerChapter: 1000,
    canExport: true,
    description: 'Para autores que desejam criar e-books curtos, guias rápidos e resumos.',
    features: [
      'Criar até 3 e-books completos',
      'Até 5 capítulos por livro',
      'Até 1.000 palavras por capítulo (~5.000 palavras)',
      'Limite diário de 1 e-book por dia',
      'Validade da cota: 30 dias',
      'Exportação em PDF, TXT e HTML liberada',
      'Download e Impressão ilimitados',
      'Capas em Alta Definição com I.A.'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Plano Pro',
    badge: 'Mais Popular',
    price: 'R$ 59,90',
    popular: true,
    maxEbooksQuota: 10,
    maxChapters: 12,
    maxWordsPerChapter: 2500,
    canExport: true,
    description: 'A escolha ideal para infoprodutores, professores e autores independentes.',
    features: [
      'Criar até 10 e-books completos',
      'Até 12 capítulos por livro',
      'Até 2.500 palavras por capítulo (~30.000 palavras)',
      'Limite diário de 1 e-book por dia',
      'Validade da cota: 30 dias',
      'Exportação em PDF, TXT e HTML liberada',
      'Geração de Capas ilimitada',
      'Reescrita e Edição de capítulos',
      'Suporte prioritário via WhatsApp'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Plano Premium',
    badge: 'Profissional',
    price: 'R$ 99,90',
    maxEbooksQuota: 50,
    maxChapters: 25,
    maxWordsPerChapter: 5000,
    canExport: true,
    description: 'Acesso máximo e ilimitado para editoras, agências e autores prolíficos.',
    features: [
      'Criar até 50 e-books completos',
      'Até 25 capítulos por livro',
      'Até 5.000 palavras por capítulo (~125.000 palavras)',
      'Limite diário de 1 e-book por dia',
      'Validade da cota: 30 dias',
      'Exportação e Impressão sem restrições',
      'I.A. de máxima densidade textual',
      'Atendimento VIP e consultoria de prompts'
    ]
  },
  custom: {
    id: 'custom',
    name: 'Plano Personalizado',
    badge: 'Especial',
    price: 'Sob Consulta',
    maxEbooksQuota: 1,
    maxChapters: 2,
    maxWordsPerChapter: 500,
    canExport: true,
    description: 'Configuração sob medida ajustada diretamente pelo Administrador.',
    features: [
      'Cota de e-books personalizada',
      'Limites de capítulos e palavras ajustados'
    ]
  }
};

export function getUserPlanLimits(profile: UserProfile | null) {
  if (!profile) {
    return {
      planType: 'test' as UserPlanType,
      name: PLAN_PRESETS.test.name,
      badge: PLAN_PRESETS.test.badge,
      price: PLAN_PRESETS.test.price,
      maxEbooksQuota: PLAN_PRESETS.test.maxEbooksQuota,
      maxChapters: PLAN_PRESETS.test.maxChapters,
      maxWordsPerChapter: PLAN_PRESETS.test.maxWordsPerChapter,
      canExport: PLAN_PRESETS.test.canExport,
      description: PLAN_PRESETS.test.description
    };
  }

  if (profile.role === 'admin') {
    return {
      planType: 'premium' as UserPlanType,
      name: 'Administrador',
      badge: 'Admin VIP',
      price: 'Acesso Total',
      maxEbooksQuota: profile.maxEbooksQuota || 9999,
      maxChapters: profile.maxChapters || 25,
      maxWordsPerChapter: profile.maxWordsPerChapter || 5000,
      canExport: true,
      description: 'Acesso total e sem restrições de administrador.'
    };
  }

  const preset = profile.planType && PLAN_PRESETS[profile.planType] ? PLAN_PRESETS[profile.planType] : null;

  return {
    planType: profile.planType || 'test',
    name: preset ? preset.name : 'Plano Personalizado',
    badge: preset ? preset.badge : 'Ativo',
    price: preset ? preset.price : '',
    maxEbooksQuota: profile.maxEbooksQuota ?? (preset?.maxEbooksQuota ?? 1),
    maxChapters: profile.maxChapters ?? (preset?.maxChapters ?? 2),
    maxWordsPerChapter: profile.maxWordsPerChapter ?? (preset?.maxWordsPerChapter ?? 500),
    canExport: profile.canExport ?? (preset?.canExport ?? false),
    description: preset?.description || 'Seu plano ativo na plataforma.'
  };
}
