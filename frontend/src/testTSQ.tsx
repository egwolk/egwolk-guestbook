import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query'
import { api } from './lib/api'


async function getTotalMessages() {
  const res = await api.messages['total-messages'].$get()
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await res.json()
  return data
} 

function TestTSQ() {
  const { isPending, error, data } = useQuery({ 
    queryKey: ['get-total-messages'], 
    queryFn: getTotalMessages 
  })

  // if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>View All Messages</CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? "..." : data.total}
        </CardContent>
      </Card>
    </>
  )
}

export default TestTSQ
