import { useState, useEffect  } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


type Message = {
  id: number
  message: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch("/api/messages")
      const data = await res.json()
      setMessages(data.messages)
    }
    fetchMessages()
  }, [])

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>View All Messages</CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            {messages.map(msg => (
              <li key={msg.id}>{msg.message}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  )
}

export default App
