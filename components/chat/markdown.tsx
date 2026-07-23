import type { ReactNode } from 'react'
import { Fragment } from 'react'

// Renders inline **bold** segments within a line of text.
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

// Lightweight renderer for the "simple markdown" (bold, bullet lists, paragraphs)
// returned by the /ask endpoint. Not a full markdown parser by design.
export function Markdown({ content }: { content: string }) {
  const blocks: ReactNode[] = []
  const lines = content.split('\n')
  let listItems: string[] = []
  let key = 0

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={`ul-${key++}`}>
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>,
      )
      listItems = []
    }
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      flushList()
      continue
    }
    if (/^[-*]\s+/.test(line)) {
      listItems.push(line.replace(/^[-*]\s+/, ''))
      continue
    }
    flushList()
    blocks.push(<p key={`p-${key++}`}>{renderInline(line)}</p>)
  }
  flushList()

  return <div className="prose-ai">{blocks}</div>
}
