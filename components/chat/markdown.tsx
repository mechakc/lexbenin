import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Rendu markdown complet pour les réponses de l'IA (titres ###, listes à puces
// et numérotées, citations >, gras/italique, séparateurs ---). Remplace un
// ancien parseur maison qui ne gérait que le gras et les listes -- les titres
// et citations généré·e·s par le LLM s'affichaient en texte brut ("### Titre")
// au lieu d'être mis en forme.
export function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h3 className="mt-3 mb-1 text-base font-semibold">{children}</h3>
          ),
          h2: ({ children }) => (
            <h3 className="mt-3 mb-1 text-base font-semibold">{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className="mt-3 mb-1 text-sm font-semibold">{children}</h4>
          ),
          h4: ({ children }) => (
            <h4 className="mt-2 mb-1 text-sm font-semibold">{children}</h4>
          ),
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-meta/60 pl-3 italic text-ai-foreground/85">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-3 border-ai-foreground/15" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-meta"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-black/10 px-1 py-0.5 text-[0.85em]">
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="mb-2 overflow-x-auto last:mb-0">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-ai-foreground/20 py-1 pr-3 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-ai-foreground/10 py-1 pr-3 align-top">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
