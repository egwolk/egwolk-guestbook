import { useState, useEffect  } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from '../lib/api'

function TestNoTSQ() {
  const [totalMessages, setTotalMessages] = useState(0)
  useEffect(() => { //for development
    async function fetchMessages() {
      const res = await api.messages["total-messages"].$get()
      const data = await res.json()
      setTotalMessages(data.total)
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
            {totalMessages}
          </ul>
        </CardContent>
      </Card>
    </>
  )
}

export default TestNoTSQ