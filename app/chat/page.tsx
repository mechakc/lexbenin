import { PageShell } from '@/components/page-shell'
import { ChatClient } from '@/components/chat/chat-client'

export default function ChatPage() {
  return (
    <PageShell footer={false}>
      <ChatClient />
    </PageShell>
  )
}
