import { EbookProject } from '../types';

/**
 * Simple, robust Markdown to HTML parser for printing and PDF export.
 */
function markdownToHtml(md: string): string {
  if (!md) return '';

  let html = md
    // Escape standard html brackets
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headings
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="chapter-title">$1</h1>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gim, '<hr />')
    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Unordered lists
    .replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>')
    // Ordered lists
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');

  // Wrap contiguous <li> into <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)/gim, '<ul>$1</ul>');

  // Paragraphs: split by double line breaks
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs
    .map((p) => {
      p = p.trim();
      if (!p) return '';
      if (
        p.startsWith('<h1') ||
        p.startsWith('<h2') ||
        p.startsWith('<h3') ||
        p.startsWith('<blockquote') ||
        p.startsWith('<ul') ||
        p.startsWith('<ol') ||
        p.startsWith('<hr')
      ) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n\n');

  return html;
}

export function generatePrintableHtml(project: EbookProject): string {
  const title = project.outline?.title || project.input.title;
  const subtitle = project.outline?.subtitle || '';
  const author = project.input.author;
  const genre = project.input.genre;

  const introHtml = project.introduction ? markdownToHtml(project.introduction) : '';
  const conclusionHtml = project.conclusion ? markdownToHtml(project.conclusion) : '';

  const chaptersHtml = project.chapters
    .map((ch) => {
      if (!ch.content) return '';
      return `
        <div class="chapter-page">
          ${markdownToHtml(ch.content)}
        </div>
      `;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${title} - ${author}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Merriweather', Georgia, serif;
      color: #1e293b;
      line-height: 1.8;
      font-size: 11pt;
      margin: 0;
      padding: 0;
      background: #f8fafc;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 3rem 4rem;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
    }

    /* Cover Page */
    .cover-page {
      height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      padding: 4rem 2rem;
      border: 2px solid #e2e8f0;
      border-radius: 1rem;
      background: linear-gradient(to bottom, #0f172a, #1e1b4b);
      color: #f8fafc;
      page-break-after: always;
      margin-bottom: 3rem;
    }

    .cover-genre {
      font-family: 'Plus Jakarta Sans', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-size: 9pt;
      font-weight: 800;
      color: #fbbf24;
      background: rgba(251, 191, 36, 0.1);
      padding: 0.4rem 1rem;
      border-radius: 999px;
      display: inline-block;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .cover-title {
      font-family: 'Merriweather', serif;
      font-size: 26pt;
      font-weight: 700;
      line-height: 1.3;
      color: #ffffff;
      margin: 1.5rem 0 1rem;
    }

    .cover-subtitle {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12pt;
      font-style: italic;
      color: #cbd5e1;
      max-width: 600px;
      margin: 0 auto;
    }

    .cover-author {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13pt;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #f59e0b;
      text-transform: uppercase;
      border-top: 1px solid rgba(255,255,255,0.15);
      padding-top: 1.5rem;
    }

    /* Chapter Formatting */
    .chapter-page {
      page-break-before: always;
      padding-top: 1rem;
    }

    .chapter-page:first-of-type {
      page-break-before: auto;
    }

    h1.chapter-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 0.75rem;
      margin-top: 2rem;
      margin-bottom: 1.5rem;
      line-height: 1.3;
    }

    h2 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
    }

    h3 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12pt;
      font-weight: 600;
      color: #334155;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }

    p {
      margin-bottom: 1.25rem;
      text-align: justify;
    }

    blockquote {
      border-left: 4px solid #f59e0b;
      background-color: #fffbeb;
      padding: 1rem 1.25rem;
      margin: 1.5rem 0;
      border-radius: 0.5rem;
      font-style: italic;
      color: #78350f;
    }

    ul, ol {
      margin-bottom: 1.25rem;
      padding-left: 1.5rem;
    }

    li {
      margin-bottom: 0.4rem;
    }

    hr {
      border: 0;
      height: 1px;
      background: #cbd5e1;
      margin: 2.5rem 0;
    }

    /* Print Specific Styles */
    @media print {
      body {
        background: #ffffff !important;
      }
      .container {
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      .cover-page {
        height: 100vh !important;
        border: none !important;
        background: #0f172a !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .chapter-page {
        page-break-before: always !original;
      }
      blockquote {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div className="no-print" style="background:#0f172a; color:#ffffff; padding:12px; text-align:center; font-family:sans-serif; font-size:13px; border-bottom:1px solid #334155;">
    💡 <strong>Dica de Impressão / PDF:</strong> Esta janela abriu a formatação pronta do livro.
    Sua janela de impressão do navegador abrirá automaticamente. Escolha a opção <strong>"Salvar como PDF"</strong>.
    <button onclick="window.print()" style="margin-left:12px; padding:6px 16px; background:#f59e0b; color:#0f172a; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
      🖨️ Abrir Janela de Impressão / PDF
    </button>
  </div>

  <div class="container">
    <!-- Capa -->
    <div class="cover-page">
      <div>
        <span class="cover-genre">${genre}</span>
      </div>
      <div>
        <h1 class="cover-title">${title}</h1>
        ${subtitle ? `<p class="cover-subtitle">${subtitle}</p>` : ''}
      </div>
      <div>
        <p class="cover-author">${author}</p>
      </div>
    </div>

    <!-- Introdução -->
    ${introHtml ? `<div class="chapter-page">${introHtml}</div>` : ''}

    <!-- Capítulos -->
    ${chaptersHtml}

    <!-- Conclusão -->
    ${conclusionHtml ? `<div class="chapter-page">${conclusionHtml}</div>` : ''}
  </div>

  <script>
    // Trigger window.print automatically on load
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;
}
