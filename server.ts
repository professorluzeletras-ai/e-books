import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to instantiate GoogleGenAI client lazily on demand
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "A chave GEMINI_API_KEY não está configurada no ambiente. Adicione-a no painel Secrets."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Servidor de geração de e-books operacional." });
});

// 1. Generate E-book Outline (Sumário e Estrutura)
app.post("/api/ebook/outline", async (req, res) => {
  try {
    const { title, author, genre, chaptersCount, targetWordsPerChapter, instructions } = req.body;

    if (!title || !author || !genre || !chaptersCount) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const ai = getGenAI();

    const systemInstruction = `Você é um autor e editor sênior especialista na criação de e-books em Português.
Sua tarefa é planejar a estrutura completa (Sumário e Visão Geral) de um e-book de alta qualidade.
Mantenha um tom profissional, engajante e alinhado com o gênero especificado.
Gere a estrutura rigorosamente em formato JSON.`;

    const prompt = `Crie o plano e o sumário detalhado para o seguinte e-book:

- Título/Tema: "${title}"
- Autor: "${author}"
- Gênero/Tipo: "${genre}"
- Número de Capítulos solicitados: ${chaptersCount}
- Meta de palavras por capítulo: aproximadamente ${targetWordsPerChapter} palavras
- Instruções e Observações do Autor: "${instructions || "Nenhuma observação adicional."}"

Requisitos para a estrutura:
1. Crie um subtítulo cativante para o e-book.
2. Escreva uma sinopse motivadora do e-book.
3. Descreva o público-alvo principal.
4. Crie o esboço da Introdução.
5. Crie exatamente ${chaptersCount} capítulos. Para cada capítulo, forneça um título impactante, um breve resumo do que será abordado e 3 a 5 tópicos/pontos-chave fundamentais.
6. Crie o esboço da Conclusão.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            author: { type: Type.STRING },
            genre: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            synopsis: { type: Type.STRING },
            introductionOutline: { type: Type.STRING },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  chapterNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  keyPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["chapterNumber", "title", "summary", "keyPoints"],
              },
            },
            conclusionOutline: { type: Type.STRING },
          },
          required: [
            "title",
            "subtitle",
            "author",
            "genre",
            "targetAudience",
            "synopsis",
            "introductionOutline",
            "chapters",
            "conclusionOutline",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Resposta vazia da I.A.");
    }

    const outline = JSON.parse(text);
    return res.json({ outline });
  } catch (error: any) {
    console.error("Erro ao gerar outline do e-book:", error);
    return res.status(500).json({ error: error.message || "Erro interno ao gerar o esboço." });
  }
});

// 2. Generate Introduction
app.post("/api/ebook/introduction", async (req, res) => {
  try {
    const { ebookInput, outline } = req.body;
    const ai = getGenAI();

    const systemInstruction = `Você é um escritor profissional de e-books em Português do Brasil.
Escreva uma Introdução marcante e envolvente para o e-book.
Siga as convenções de formatação em Markdown (títulos, negritos, itálicos, citações).
A introdução deve preparar o leitor para o livro, criar conexão emocional e explicitar os benefícios da leitura.`;

    const prompt = `Escreva a INTRODUÇÃO completa do e-book em Markdown.

Informações do Livro:
- Título: ${outline.title}
- Subtítulo: ${outline.subtitle}
- Autor: ${ebookInput.author}
- Gênero: ${ebookInput.genre}
- Sinopse: ${outline.synopsis}
- Esboço da Introdução: ${outline.introductionOutline}
- Diretrizes do Autor: ${ebookInput.instructions || "Seguir o fluxo do e-book."}

Instruções de Formatação:
- Comece com "# INTRODUÇÃO: [Título da Introdução]"
- Divida o texto com subtítulos de nível 2 (##) e nível 3 (###) quando adequado.
- Inclua uma citação inspiradora ou caixa de destaque (usando > citação em markdown).
- Tamanho aproximado: 600 a 1000 palavras.
- Escreva o texto completo diretamente em Markdown sem cercar com blocos de código extra.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const content = response.text || "";
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    return res.json({ content, wordCount });
  } catch (error: any) {
    console.error("Erro ao gerar introdução:", error);
    return res.status(500).json({ error: error.message || "Erro ao gerar introdução." });
  }
});

// 3. Generate Individual Chapter
app.post("/api/ebook/chapter", async (req, res) => {
  try {
    const { ebookInput, outline, chapterNumber, previousSummaries } = req.body;

    const chapterInfo = outline.chapters.find((c: any) => c.chapterNumber === chapterNumber);
    if (!chapterInfo) {
      return res.status(400).json({ error: "Capítulo não encontrado no esboço." });
    }

    const ai = getGenAI();

    const targetWords = ebookInput.targetWordsPerChapter || 2000;

    const systemInstruction = `Você é um autor especialista escrevendo o Capítulo ${chapterNumber} do e-book "${outline.title}".
Seu objetivo é escrever um capítulo rico, aprofundado, bem estruturado, prático e cativante em Português.
O capítulo DEVE ter aproximadamente ${targetWords} palavras (não escreva resumos curtos, desenvolva os argumentos com profundidade, exemplos práticos, histórias, analogias e orientações claras).
Respeite a formatação Markdown elegante.`;

    const prompt = `Escreva o CAPÍTULO ${chapterNumber} completo para o e-book.

DADOS DO E-BOOK:
- Título Geral: ${outline.title} (${outline.subtitle})
- Autor: ${ebookInput.author}
- Gênero: ${ebookInput.genre}
- Observações do Autor: ${ebookInput.instructions}

DADOS DO CAPÍTULO ${chapterNumber}:
- Título do Capítulo: ${chapterInfo.title}
${chapterInfo.subtitle ? `- Subtítulo: ${chapterInfo.subtitle}` : ""}
- Resumo planejado: ${chapterInfo.summary}
- Tópicos obrigatórios a desenvolver: ${chapterInfo.keyPoints ? chapterInfo.keyPoints.join(", ") : ""}

CONTEXTO DOS CAPÍTULOS ANTERIORES:
${previousSummaries || "Este é um dos primeiros capítulos do livro."}

REQUISITOS DE CONTEÚDO E FORMATO:
1. Comece diretamente com "# CAPÍTULO ${chapterNumber}: ${chapterInfo.title.toUpperCase()}"
2. Desenvolva o texto em seções lógicas com subtítulos Markdown (## e ###).
3. Inclua reflexões práticas, histórias/exemplos de aplicação e caixa de destaque com "> **Reflexão para o Leitor:**" ou "> **Ponto de Ação:**".
4. Mantenha fluidez narrativa para conectar com o capítulo anterior e preparar para o próximo.
5. META DE TAMANHO: Escreva um texto denso e valioso de aproximadamente ${targetWords} palavras.
6. Retorne APENAS o texto em Markdown formatado.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    const content = response.text || "";
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    return res.json({ chapterNumber, title: chapterInfo.title, content, wordCount });
  } catch (error: any) {
    console.error(`Erro ao gerar capítulo ${req.body.chapterNumber}:`, error);
    return res.status(500).json({ error: error.message || "Erro ao gerar capítulo." });
  }
});

// 4. Generate Conclusion
app.post("/api/ebook/conclusion", async (req, res) => {
  try {
    const { ebookInput, outline, allChaptersSummaries } = req.body;
    const ai = getGenAI();

    const systemInstruction = `Você é um autor de e-books em Português do Brasil.
Escreva a CONCLUSÃO final do e-book.
A conclusão deve sintetizar os aprendizados principais do livro, inspirar o leitor a agir e encantar com uma mensagem final poderosa.`;

    const prompt = `Escreva a CONCLUSÃO do e-book em Markdown.

DADOS DO LIVRO:
- Título: ${outline.title} - ${outline.subtitle}
- Autor: ${ebookInput.author}
- Gênero: ${ebookInput.genre}
- Esboço da Conclusão: ${outline.conclusionOutline}
- Resumo dos Capítulos Desenvolvidos: ${allChaptersSummaries || "Desenvolvimento do tema principal."}
- Observações do Autor: ${ebookInput.instructions || ""}

Instruções:
- Comece com "# CONCLUSÃO: [Título da Conclusão ou Transformação Final]"
- Use subtítulos (##) e destaques (> Citação).
- Forneça um plano de ação em 5 passos práticos para o leitor aplicar imediatamente o conhecimento.
- Finalize com uma mensagem inspiradora e a assinatura do autor (${ebookInput.author}).
- Tamanho aproximado: 600 a 1000 palavras.
- Retorne apenas o texto em Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const content = response.text || "";
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    return res.json({ content, wordCount });
  } catch (error: any) {
    console.error("Erro ao gerar conclusão:", error);
    return res.status(500).json({ error: error.message || "Erro ao gerar conclusão." });
  }
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EbookAI Server] Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
