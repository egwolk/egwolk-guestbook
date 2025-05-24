import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/createMessage')({
  component: CreateMessage,
})

function CreateMessage() {
  return <div>Hello "/createMessage"!</div>
}
