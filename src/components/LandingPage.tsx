import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Printer, 
  ShieldCheck, 
  Zap, 
  Layers, 
  ArrowRight, 
  Star, 
  UserCheck, 
  Lock,
  FileText
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLoadExample?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Banner Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <BookOpen className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white font-serif">
                Luz e Letras
              </span>
              <span className="ml-2 bg-amber-500/10 text-amber-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-amber-500/30 uppercase tracking-wider">
                E-book AI
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
            >
              Entrar
            </button>
            <button
              onClick={onOpenRegister}
              className="px-5 py-2.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center space-x-1.5"
            >
              <span>Cadastrar-se Grátis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-8 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Plataforma Inteligente de Autoria e Publicação Digital</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Escreva e Publique E-books Profissionais em <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">Poucos Minutos</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Crie sumários detalhados, desenvolva capítulos extensos com profundidade e exporte seu livro pronto para leitura ou venda em formato <strong className="text-slate-200 font-semibold">PDF, TXT e Markdown</strong>.
          </p>

          {/* Call To Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-amber-500/25 active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Começar a Escrever Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-sm transition-all flex items-center justify-center space-x-2"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Já tenho uma conta</span>
            </button>
          </div>

          {/* Feature Pillars */}
          <div className="mt-12 pt-8 border-t border-slate-900 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Acervo Pessoal Seguro em Nuvem</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Formatação Editorial Instantânea em PDF</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Geração Sequencial Sem Limite de Ideias</span>
            </span>
          </div>

          {/* App Screen Mockup Card */}
          <div className="mt-16 max-w-5xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-indigo-500" />
            
            <div className="bg-slate-950 rounded-xl p-6 text-left border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-slate-500 font-mono ml-2">gerador-livro-preview.ai</span>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  Gerando Capítulo 1 de 10...
                </span>
              </div>

              <div className="space-y-3 font-serif">
                <h3 className="text-lg font-bold text-white">
                  Capítulo 1: Preparados no Deserto — O Início da Jornada
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  No silêncio das grandes transformações, o deserto nunca é um lugar de abandono, mas de refino. É no isolamento estratégico que as distrações superficiais são removidas, revelando a verdadeira essência da liderança e da vocação...
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs">
                <div className="flex items-center space-x-4 text-slate-400 font-sans">
                  <span>Palavras: <strong className="text-white">2.240</strong></span>
                  <span>Capítulos: <strong className="text-white">10 Aprovados</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-[11px] font-sans font-bold flex items-center gap-1">
                    <Printer className="w-3 h-3 text-emerald-400" /> PDF Editorial
                  </span>
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-[11px] font-sans font-bold flex items-center gap-1">
                    <FileText className="w-3 h-3 text-amber-400" /> TXT / MD
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
              Tudo o que Você Precisa para Criar Livros Inesquecíveis
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Desenvolvido para autores, professores, mentores e criadores de conteúdo produzirem obras com profundidade e ritmo profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Estruturação de Sumário</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A I.A. cria o plano de ação completo do seu e-book com títulos, objetivos e resumos antes mesmo de começar a escrever o texto final.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Printer className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Formatação e Exportação em PDF</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Exporte seu e-book com capa elegante, tipografia clássica e quebra de páginas perfeita em PDF ou arquivos leves em Markdown e TXT.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Acervo Privado em Nuvem</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seus livros são salvos na sua conta pessoal. Acesse, edite e baixe suas criações de qualquer dispositivo quando quiser.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold font-serif text-white">
              Como Funciona em 3 Passos Simples
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center space-y-3">
              <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 font-extrabold text-xs rounded-lg border border-amber-500/20">
                PASSO 1
              </span>
              <h3 className="text-base font-bold text-white">Defina o Tema e o Público</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Digite o título, o autor e as orientações centrais da sua obra.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center space-y-3">
              <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 font-extrabold text-xs rounded-lg border border-amber-500/20">
                PASSO 2
              </span>
              <h3 className="text-base font-bold text-white">Revise o Esboço dos Capítulos</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Confira a estrutura de capítulos sugerida e faça ajustes caso necessário.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center space-y-3">
              <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 font-extrabold text-xs rounded-lg border border-amber-500/20">
                PASSO 3
              </span>
              <h3 className="text-base font-bold text-white">Gere e Baixe o Seu Livro</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acompanhe a produção em tempo real e faça o download final em PDF, TXT ou MD.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ROI & Cost Comparison Section */}
      <section className="py-20 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/30">
              Transparência & Economia Real
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white mt-3">
              Por que Criar E-books Conosco Vale Tanto a Pena?
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Aproveitamos a máxima eficiência da inteligência artificial para entregar livros completos com custo por obra a partir de <strong>R$ 5,99</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Left Card: Traditional Ghostwriter */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Método Tradicional</span>
                <span className="text-xs font-bold text-slate-400">Ghostwriter / Redator</span>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Custo por E-book (20 pág.):</span>
                  <span className="font-bold text-red-400 text-base">R$ 500,00 a R$ 2.000,00</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Tempo de Entrega:</span>
                  <span className="font-bold text-slate-200">15 a 30 dias úteis</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Formatação & Diagramação:</span>
                  <span className="font-bold text-slate-200">Cobrado à parte (+R$ 300)</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Revisões & Ajustes:</span>
                  <span className="font-bold text-slate-200">Lentas e burocráticas</span>
                </div>
              </div>
            </div>

            {/* Right Card: Luz e Letras AI */}
            <div className="bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-950 border-2 border-emerald-500/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-500/10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Sua Plataforma Luz e Letras</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">I.A. de Alta Densidade</span>
              </div>

              <div className="space-y-4 text-xs text-slate-200">
                <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30">
                  <span className="text-slate-400">Custo por E-book Completo:</span>
                  <span className="font-black text-emerald-400 text-lg">A partir de R$ 5,99 / e-book</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Tempo de Produção:</span>
                  <span className="font-bold text-amber-300">Pronto em 3 a 5 minutos</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Formatação Editorial PDF:</span>
                  <span className="font-bold text-emerald-400">Inclusa sem custo extra</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Geração de Capas com I.A.:</span>
                  <span className="font-bold text-emerald-400">Disponível em Alta Definição</span>
                </div>
              </div>
            </div>

          </div>

          {/* Transparency Callout */}
          <div className="mt-10 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center max-w-3xl mx-auto space-y-2">
            <h4 className="text-sm font-bold text-amber-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantia de Qualidade e Eficiência Tecnológica</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diferente de ferramentas genéricas, otimizamos o processamento capítulo por capítulo com salvamento automático em nuvem. Cada livro gerado entrega texto denso, coerente e formatado para você ler, vender ou compartilhar imediatamente.
            </p>
          </div>

        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="px-3.5 py-1 bg-amber-500/10 text-amber-400 font-bold text-xs rounded-full border border-amber-500/30">
              Modelos de Teste & Níveis
            </span>
            <h2 className="text-3xl font-extrabold font-serif text-white mt-3">
              Experimente Grátis e Escolha Seu Nível de Produção
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Teste o gerador com 1 e-book de 2 capítulos sem pagar nada. Faça upgrade para liberar mais e-books, mais capítulos e exportação em PDF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Free Test Tier */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Degustação</span>
                <h3 className="text-lg font-bold text-white mt-1">Teste Grátis</h3>
                <div className="text-2xl font-black text-white mt-3">R$ 0</div>
                <p className="text-xs text-slate-400 mt-2">Incluso no seu primeiro cadastro na plataforma.</p>
                
                <div className="h-px bg-slate-800 my-4" />
                
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>1 E-book</strong> para degustação</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até <strong>2 capítulos</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até <strong>500 palavras</strong>/cap.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Leitura na plataforma</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenRegister}
                className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl transition-all"
              >
                Cadastrar e Testar
              </button>
            </div>

            {/* Basic Tier */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Essencial</span>
                <h3 className="text-lg font-bold text-white mt-1">Plano Básico</h3>
                <div className="text-2xl font-black text-white mt-3">R$ 29,90</div>
                <p className="text-xs text-slate-400 mt-2">Para guias curtos e resumos práticos.</p>
                
                <div className="h-px bg-slate-800 my-4" />
                
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até <strong>3 e-books</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até <strong>5 capítulos</strong>/livro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até <strong>1.000 palavras</strong>/cap.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Exportação PDF/TXT/HTML</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenRegister}
                className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
              >
                Escolher Básico
              </button>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="bg-gradient-to-b from-indigo-950/90 to-slate-950 border-2 border-indigo-500/80 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl shadow-indigo-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full uppercase tracking-wider">
                Mais Popular
              </div>

              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Recomendado</span>
                <h3 className="text-lg font-bold text-white mt-1">Plano Pro</h3>
                <div className="text-2xl font-black text-white mt-3">R$ 59,90</div>
                <p className="text-xs text-slate-300 mt-2">Para infoprodutores, professores e autores.</p>
                
                <div className="h-px bg-slate-800 my-4" />
                
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até <strong>10 e-books</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até <strong>12 capítulos</strong>/livro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até <strong>2.500 palavras</strong>/cap.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Gerador de Capa HD + PDF</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenRegister}
                className="w-full mt-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                Começar no Plano Pro
              </button>
            </div>

            {/* Premium Tier */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Ilimitado</span>
                <h3 className="text-lg font-bold text-white mt-1">Plano Premium</h3>
                <div className="text-2xl font-black text-white mt-3">R$ 99,90</div>
                <p className="text-xs text-slate-400 mt-2">Para editoras e alta demanda de conteúdo.</p>
                
                <div className="h-px bg-slate-800 my-4" />
                
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até <strong>50 e-books</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até <strong>25 capítulos</strong>/livro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até <strong>5.000 palavras</strong>/cap.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Atendimento e Suporte VIP</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenRegister}
                className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                Escolher Premium
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-extrabold font-serif text-white">
            Pronto para Escrever Seu Próximo E-book?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Crie sua conta em segundos e comece a transformar suas ideias e conhecimentos em livros completos.
          </p>
          <div>
            <button
              onClick={onOpenRegister}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-amber-500/20 active:scale-95 inline-flex items-center space-x-2"
            >
              <span>Cadastre-se Gratuitamente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-400">
          Luz e Letras • Plataforma de Autoria com Inteligência Artificial
        </p>
        <p className="mt-1 text-slate-600">
          Alimentado por Gemini AI API. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
};
