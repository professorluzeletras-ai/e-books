import React, { useState } from 'react';
import { EbookInput, EbookOutline, EbookProject, ChapterContent } from './types';
import { Header } from './components/Header';
import { EbookForm } from './components/EbookForm';
import { OutlineView } from './components/OutlineView';
import { ChapterGeneratorProgress } from './components/ChapterGeneratorProgress';
import { EbookReader } from './components/EbookReader';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { UserEbooksModal } from './components/UserEbooksModal';
import { PlansModal } from './components/PlansModal';
import { PixCheckoutModal } from './components/PixCheckoutModal';
import { LandingPage } from './components/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { saveEbook } from './services/dbService';
import { getUserPlanLimits, PlanDefinition } from './constants/plans';
import { generatePrintableHtml } from './utils/exportHtml';
import { AlertCircle, BookOpen, RefreshCw } from 'lucide-react';

const DEFAULT_INPUT: EbookInput = {
  title: '',
  author: '',
  genre: 'Autoajuda',
  chaptersCount: 10,
  targetWordsPerChapter: 2000,
  instructions: '',
};

const USER_EXAMPLE_INPUT: EbookInput = {
  title: 'Preparados no Deserto: Identidade, Foco e Vencendo as Primeiras Tentações - Base: capítulos 1 e 2 do livro de marcos',
  author: 'Professor Luz e Letras',
  genre: 'Autoajuda',
  chaptersCount: 10,
  targetWordsPerChapter: 2200,
  instructions: 'Foco do E-book: Ensina a lidar com o início de novos ciclos e com a pressão do ambiente. Aborda o preparo no deserto (Marcos 1), o fortalecimento da identidade diante do medo, o confronto com crenças engessadas e a coragem para romper com barreiras emocionais para alcançar a cura (como a história dos amigos do paralítico em Marcos 2). Adicione um capítulo sobre a importância da resiliência e a busca por propósito.',
};

function MainAppContent() {
  const { user, userProfile, isAdmin, isBlocked, loading: authLoading } = useAuth();

  const [input, setInput] = useState<EbookInput>(DEFAULT_INPUT);
  const [outline, setOutline] = useState<EbookOutline | null>(null);
  const [project, setProject] = useState<EbookProject | null>(null);

  const [status, setStatus] = useState<
    'idle' | 'generating_outline' | 'outline_ready' | 'generating_chapters' | 'completed' | 'error'
  >('idle');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepName, setCurrentStepName] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalWordsGenerated, setTotalWordsGenerated] = useState(0);

  const [activeSection, setActiveSection] = useState('full');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isMyEbooksOpen, setIsMyEbooksOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [selectedPixPlan, setSelectedPixPlan] = useState<PlanDefinition | null>(null);

  // Auto-save project to Firestore
  const persistProjectToCloud = async (proj: EbookProject) => {
    if (!user) return;
    const projToSave: EbookProject = {
      ...proj,
      userId: user.uid,
      userEmail: user.email || 'usuario@exemplo.com',
    };
    try {
      await saveEbook(projToSave);
    } catch (err) {
      console.warn('Erro ao salvar no Firestore:', err);
    }
  };

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString('pt-BR')}] ${msg}`]);
  };

  const handleLoadExample = () => {
    const limits = getUserPlanLimits(userProfile);
    setInput({
      ...USER_EXAMPLE_INPUT,
      chaptersCount: Math.min(USER_EXAMPLE_INPUT.chaptersCount, limits.maxChapters),
      targetWordsPerChapter: Math.min(USER_EXAMPLE_INPUT.targetWordsPerChapter, limits.maxWordsPerChapter),
    });
  };

  // Check auth and quotas before generation
  const validateUserCanGenerate = (): boolean => {
    if (!user) {
      setAuthModalTab('login');
      setIsAuthOpen(true);
      return false;
    }
    if (isBlocked) {
      setErrorMessage('Sua conta está temporariamente bloqueada pelo administrador.');
      return false;
    }
    const limits = getUserPlanLimits(userProfile);

    if (!isAdmin && userProfile) {
      // 1. Check Plan Expiration (30 days validity)
      if (userProfile.planExpiresAt && new Date(userProfile.planExpiresAt) < new Date()) {
        const expiredDateStr = new Date(userProfile.planExpiresAt).toLocaleDateString('pt-BR');
        setErrorMessage(
          `O prazo de 30 dias do seu plano (${limits.name}) venceu em ${expiredDateStr}. Por favor, faça a renovação para continuar gerando novos e-books.`
        );
        setIsPlansOpen(true);
        return false;
      }

      // 2. Check Total Plan Quota
      if (userProfile.ebooksCount >= limits.maxEbooksQuota) {
        setErrorMessage(
          `Você atingiu o limite de ${limits.maxEbooksQuota} e-book(s) do seu plano (${limits.name}). Faça upgrade para criar mais e-books!`
        );
        setIsPlansOpen(true);
        return false;
      }

      // 3. Check Daily Limit (1 e-book per day)
      if (userProfile.lastEbookGeneratedAt) {
        const lastGenDate = new Date(userProfile.lastEbookGeneratedAt).toISOString().split('T')[0];
        const todayDate = new Date().toISOString().split('T')[0];
        if (lastGenDate === todayDate) {
          setErrorMessage(
            'Você já criou 1 e-book hoje! Para garantir a estabilidade do sistema e qualidade da I.A., o limite é de 1 e-book por dia. Volte amanhã para criar o seu próximo livro.'
          );
          return false;
        }
      }
    }
    return true;
  };

  // 1. Submit Form -> Generate Outline
  const handleGenerateOutline = async () => {
    if (!input.title.trim()) return;
    if (!validateUserCanGenerate()) return;

    setErrorMessage(null);
    setIsGenerating(true);
    setStatus('generating_outline');
    setCurrentStepName('Criando estrutura e sumário detalhado');
    setLogs([]);
    addLog(`Iniciando planejamento do e-book: "${input.title}"`);

    try {
      const res = await fetch('/api/ebook/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro na resposta do servidor.');
      }

      const data = await res.json();
      setOutline(data.outline);
      setStatus('outline_ready');
      addLog(`Estrutura aprovada com ${data.outline.chapters.length} capítulos.`);

      const initialChapters: ChapterContent[] = data.outline.chapters.map((ch: any) => ({
        chapterNumber: ch.chapterNumber,
        title: ch.title,
        content: '',
        wordCount: 0,
        status: 'pending',
      }));

      const newProj: EbookProject = {
        id: Date.now().toString(),
        userId: user!.uid,
        userEmail: user!.email || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        input,
        outline: data.outline,
        chapters: initialChapters,
      };

      setProject(newProj);
      await persistProjectToCloud(newProj);
    } catch (error: any) {
      console.error('Error generating outline:', error);
      setErrorMessage(error.message || 'Erro ao comunicar com a I.A.');
      setStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Start Full Book Generation
  const handleStartFullGeneration = async () => {
    if (!outline || !project) return;
    if (!validateUserCanGenerate()) return;

    setIsGenerating(true);
    setStatus('generating_chapters');
    setErrorMessage(null);

    const totalSteps = 1 + outline.chapters.length + 1;
    setTotalCount(totalSteps);
    setCompletedCount(0);
    setTotalWordsGenerated(0);

    let currentProj = { ...project };
    let accumulatedWords = 0;
    let finishedSteps = 0;

    addLog('Iniciando produção textual em massa do e-book...');

    try {
      // Step A: Introduction
      if (!currentProj.introduction) {
        setCurrentStepName('Escrevendo Introdução');
        addLog('Escrevendo a Introdução do livro...');

        const introRes = await fetch('/api/ebook/introduction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ebookInput: input, outline }),
        });

        if (!introRes.ok) throw new Error('Falha ao gerar introdução.');
        const introData = await introRes.json();

        currentProj.introduction = introData.content;
        accumulatedWords += introData.wordCount;
        finishedSteps += 1;

        setTotalWordsGenerated(accumulatedWords);
        setCompletedCount(finishedSteps);
        setProject({ ...currentProj });
        await persistProjectToCloud(currentProj);
        addLog(`Introdução concluída (~${introData.wordCount} palavras).`);
      } else {
        finishedSteps += 1;
        setCompletedCount(finishedSteps);
      }

      // Step B: Chapters
      let previousSummaries = '';

      for (let i = 0; i < outline.chapters.length; i++) {
        const chOutline = outline.chapters[i];
        const chapterNum = chOutline.chapterNumber;

        const existingCh = currentProj.chapters.find((c) => c.chapterNumber === chapterNum);
        if (existingCh && existingCh.content && existingCh.status === 'completed') {
          finishedSteps += 1;
          accumulatedWords += existingCh.wordCount;
          setCompletedCount(finishedSteps);
          setTotalWordsGenerated(accumulatedWords);
          previousSummaries += `Capítulo ${chapterNum} (${chOutline.title}): ${chOutline.summary}\n`;
          continue;
        }

        setCurrentStepName(`Escrevendo Capítulo ${chapterNum}: ${chOutline.title}`);
        addLog(`Escrevendo Capítulo ${chapterNum} de ${outline.chapters.length}...`);

        currentProj.chapters = currentProj.chapters.map((c) =>
          c.chapterNumber === chapterNum ? { ...c, status: 'generating' } : c
        );
        setProject({ ...currentProj });

        const chRes = await fetch('/api/ebook/chapter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ebookInput: input,
            outline,
            chapterNumber: chapterNum,
            previousSummaries,
          }),
        });

        if (!chRes.ok) {
          const errData = await chRes.json();
          throw new Error(errData.error || `Erro ao gerar capítulo ${chapterNum}`);
        }

        const chData = await chRes.json();

        currentProj.chapters = currentProj.chapters.map((c) =>
          c.chapterNumber === chapterNum
            ? {
                ...c,
                content: chData.content,
                wordCount: chData.wordCount,
                status: 'completed',
              }
            : c
        );

        accumulatedWords += chData.wordCount;
        finishedSteps += 1;
        previousSummaries += `Capítulo ${chapterNum} (${chOutline.title}): ${chOutline.summary}\n`;

        setTotalWordsGenerated(accumulatedWords);
        setCompletedCount(finishedSteps);
        setProject({ ...currentProj });
        await persistProjectToCloud(currentProj);
        addLog(`Capítulo ${chapterNum} concluído (~${chData.wordCount} palavras).`);
      }

      // Step C: Conclusion
      if (!currentProj.conclusion) {
        setCurrentStepName('Escrevendo Conclusão e Fechamento');
        addLog('Escrevendo a Conclusão do livro...');

        const concRes = await fetch('/api/ebook/conclusion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ebookInput: input,
            outline,
            allChaptersSummaries: previousSummaries,
          }),
        });

        if (!concRes.ok) throw new Error('Falha ao gerar conclusão.');
        const concData = await concRes.json();

        currentProj.conclusion = concData.content;
        accumulatedWords += concData.wordCount;
        finishedSteps += 1;

        setTotalWordsGenerated(accumulatedWords);
        setCompletedCount(finishedSteps);
        setProject({ ...currentProj });
        await persistProjectToCloud(currentProj);
        addLog(`Conclusão concluída (~${concData.wordCount} palavras).`);
      } else {
        finishedSteps += 1;
        setCompletedCount(finishedSteps);
      }

      setStatus('completed');
      addLog('E-book completo produzido com sucesso!');
    } catch (error: any) {
      console.error('Error in chapter generation:', error);
      setErrorMessage(error.message || 'Erro durante a produção dos capítulos.');
      setStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Single Chapter Generation
  const handleGenerateSingleChapter = async (chapterNumber: number) => {
    if (!outline || !project) return;
    if (!validateUserCanGenerate()) return;

    setIsGenerating(true);
    setErrorMessage(null);
    addLog(`Iniciando geração individual do Capítulo ${chapterNumber}...`);

    try {
      const chRes = await fetch('/api/ebook/chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ebookInput: input,
          outline,
          chapterNumber,
          previousSummaries: 'Foco no capítulo atual conforme esboço.',
        }),
      });

      if (!chRes.ok) {
        const errData = await chRes.json();
        throw new Error(errData.error || 'Erro ao gerar capítulo.');
      }

      const chData = await chRes.json();

      const updatedChapters = project.chapters.map((c) =>
        c.chapterNumber === chapterNumber
          ? {
              ...c,
              content: chData.content,
              wordCount: chData.wordCount,
              status: 'completed' as const,
            }
          : c
      );

      const updatedProj = {
        ...project,
        chapters: updatedChapters,
      };

      setProject(updatedProj);
      await persistProjectToCloud(updatedProj);
      addLog(`Capítulo ${chapterNumber} atualizado com sucesso (~${chData.wordCount} palavras).`);
    } catch (error: any) {
      console.error('Single chapter generation error:', error);
      setErrorMessage(error.message || 'Erro ao gerar capítulo.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Content edits
  const handleUpdateChapterContent = (chapterNumber: number, newContent: string) => {
    if (!project) return;
    const words = newContent.trim().split(/\s+/).filter(Boolean).length;
    const updated = project.chapters.map((c) =>
      c.chapterNumber === chapterNumber ? { ...c, content: newContent, wordCount: words } : c
    );
    const updatedProj = { ...project, chapters: updated };
    setProject(updatedProj);
    persistProjectToCloud(updatedProj);
  };

  const handleUpdateIntroContent = (newContent: string) => {
    if (!project) return;
    const updatedProj = { ...project, introduction: newContent };
    setProject(updatedProj);
    persistProjectToCloud(updatedProj);
  };

  const handleUpdateConclusionContent = (newContent: string) => {
    if (!project) return;
    const updatedProj = { ...project, conclusion: newContent };
    setProject(updatedProj);
    persistProjectToCloud(updatedProj);
  };

  const handleNewEbook = () => {
    setOutline(null);
    setProject(null);
    setStatus('idle');
    setInput(DEFAULT_INPUT);
  };

  const handleOpenEbookFromModal = (selectedEbook: EbookProject) => {
    setProject(selectedEbook);
    setInput(selectedEbook.input);
    if (selectedEbook.outline) {
      setOutline(selectedEbook.outline);
      setStatus('completed');
    }
  };

  // Exports
  const getFullBookMarkdownText = () => {
    if (!project) return '';
    let md = `# ${project.outline?.title || project.input.title}\n`;
    if (project.outline?.subtitle) {
      md += `*${project.outline.subtitle}*\n\n`;
    }
    md += `**Autor:** ${project.input.author}\n`;
    md += `**Gênero:** ${project.input.genre}\n\n`;
    md += `---\n\n`;

    if (project.introduction) {
      md += `${project.introduction}\n\n---\n\n`;
    }

    project.chapters.forEach((ch) => {
      if (ch.content) {
        md += `${ch.content}\n\n---\n\n`;
      }
    });

    if (project.conclusion) {
      md += `${project.conclusion}\n\n`;
    }

    return md;
  };

  const checkCanExport = (): boolean => {
    if (isAdmin) return true;
    const limits = getUserPlanLimits(userProfile);
    if (limits.canExport) return true;

    setErrorMessage(
      `A exportação (PDF, TXT, HTML) está bloqueada no seu plano (${limits.name}). Faça upgrade para o Plano Básico ou Pro para baixar e imprimir seus livros!`
    );
    setIsPlansOpen(true);
    return false;
  };

  const handleExportTxt = () => {
    if (!checkCanExport()) return;
    const text = getFullBookMarkdownText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = (project?.outline?.title || input.title || 'ebook')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_');
    link.download = `${cleanTitle}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMd = () => {
    if (!checkCanExport()) return;
    const text = getFullBookMarkdownText();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = (project?.outline?.title || input.title || 'ebook')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_');
    link.download = `${cleanTitle}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHtml = () => {
    if (!checkCanExport()) return;
    if (!project) return;
    const htmlContent = generatePrintableHtml(project);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = (project?.outline?.title || input.title || 'ebook')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_');
    link.download = `${cleanTitle}_livro_impressao.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    if (!checkCanExport()) return;
    const text = getFullBookMarkdownText();
    navigator.clipboard.writeText(text);
  };

  const handlePrint = () => {
    if (!checkCanExport()) return;
    if (!project) {
      window.print();
      return;
    }

    const htmlContent = generatePrintableHtml(project);
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      handleExportHtml();
      alert('O seu navegador bloqueou a janela pop-up de impressão. O arquivo HTML completo foi baixado automaticamente!');
    }
  };

  const hasContent = !!(project && (project.introduction || project.chapters.some((c) => c.content)));

  // Render initial auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 space-y-4">
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <BookOpen className="w-8 h-8 animate-pulse" />
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
          <span>Carregando plataforma...</span>
        </div>
      </div>
    );
  }

  // If visitor is NOT logged in, show the Landing Page!
  if (!user) {
    return (
      <>
        <LandingPage
          onOpenLogin={() => {
            setAuthModalTab('login');
            setIsAuthOpen(true);
          }}
          onOpenRegister={() => {
            setAuthModalTab('register');
            setIsAuthOpen(true);
          }}
          onLoadExample={handleLoadExample}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          requiredForAction={false}
          initialTab={authModalTab}
        />
      </>
    );
  }

  // If user IS logged in, render the main production app workspace!
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      <Header
        hasContent={hasContent}
        onExportTxt={handleExportTxt}
        onExportMd={handleExportMd}
        onExportHtml={handleExportHtml}
        onCopyMarkdown={handleCopyMarkdown}
        onPrint={handlePrint}
        onNewEbook={handleNewEbook}
        onLoadExample={handleLoadExample}
        isGenerating={isGenerating}
        onOpenAuth={() => {
          setAuthModalTab('login');
          setIsAuthOpen(true);
        }}
        onOpenMyEbooks={() => setIsMyEbooksOpen(true)}
        onOpenAdminPanel={() => setIsAdminOpen(true)}
        onOpenPlans={() => setIsPlansOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error Alert Box */}
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-start gap-3 shadow-sm animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-red-900 text-sm">Atenção</h4>
              <p className="text-xs text-red-700 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Live Generation Progress Bar */}
        {isGenerating && (
          <ChapterGeneratorProgress
            currentStepName={currentStepName}
            completedCount={completedCount}
            totalCount={totalCount}
            totalWordsGenerated={totalWordsGenerated}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(!isPaused)}
            logs={logs}
          />
        )}

        {/* View Switcher based on status */}
        {status === 'idle' || status === 'generating_outline' || !outline ? (
          <EbookForm
            input={input}
            onChange={setInput}
            onSubmit={handleGenerateOutline}
            onLoadExample={handleLoadExample}
            isGenerating={isGenerating}
            userProfile={userProfile}
            onOpenPlans={() => setIsPlansOpen(true)}
          />
        ) : status === 'outline_ready' && !hasContent ? (
          <OutlineView
            outline={outline}
            input={input}
            onStartFullGeneration={handleStartFullGeneration}
            onGenerateSingleChapter={handleGenerateSingleChapter}
            onRegenerateOutline={handleGenerateOutline}
            onUpdateOutline={(updated) => {
              setOutline(updated);
              if (project) {
                const updatedProj = { ...project, outline: updated };
                setProject(updatedProj);
                persistProjectToCloud(updatedProj);
              }
            }}
            isGenerating={isGenerating}
            completedChaptersCount={project?.chapters.filter((c) => c.status === 'completed').length || 0}
          />
        ) : (
          project && (
            <EbookReader
              project={project}
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              onUpdateChapterContent={handleUpdateChapterContent}
              onUpdateIntroContent={handleUpdateIntroContent}
              onUpdateConclusionContent={handleUpdateConclusionContent}
              onExportTxt={handleExportTxt}
              onExportMd={handleExportMd}
              onExportHtml={handleExportHtml}
              onCopyMarkdown={handleCopyMarkdown}
              onPrint={handlePrint}
              onContinueGeneration={handleStartFullGeneration}
              onGenerateSingleChapter={handleGenerateSingleChapter}
              isGenerating={isGenerating}
            />
          )
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 space-y-1 no-print">
        <p className="font-medium text-slate-600">
          Gerador de E-books com I.A. • Sistema Profissional e Seguro
        </p>
        <p className="text-slate-400">
          Alimentado por Gemini AI API • Cada usuário possui acesso exclusivo aos seus próprios livros.
        </p>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        requiredForAction={false}
        initialTab={authModalTab}
      />

      <UserEbooksModal
        isOpen={isMyEbooksOpen}
        onClose={() => setIsMyEbooksOpen(false)}
        onOpenEbook={handleOpenEbookFromModal}
        onNewEbookClick={handleNewEbook}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenEbook={handleOpenEbookFromModal}
      />

      <PlansModal
        isOpen={isPlansOpen}
        onClose={() => setIsPlansOpen(false)}
        userProfile={userProfile}
        onSelectPlanForPix={(plan) => {
          setSelectedPixPlan(plan);
          setIsPlansOpen(false);
          setIsPixModalOpen(true);
        }}
      />

      <PixCheckoutModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        plan={selectedPixPlan}
        userProfile={userProfile}
        onPaymentSuccess={() => {
          // Re-load or notify
          setErrorMessage(null);
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
