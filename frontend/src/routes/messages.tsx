import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Skeleton } from "@/components/ui/skeleton"


export const Route = createFileRoute('/messages')({
  component: Messages,
})

async function getAllMessages() {
  await new Promise(r => setTimeout(r, 3000)) // Simulate network delay
  const res = await api.messages.$get()
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await res.json()
  return data
} 

function Messages() {
  const { isPending, error, data } = useQuery({ 
    queryKey: ['get-all-messages'], 
    queryFn: getAllMessages 
  })

  // if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return <div className="p-2 max-w-3xl m-auto">
    <pre>
      <Table>
        <TableCaption>Show all messages.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Messages</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending 
            ? Array(1).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </TableCell>
              </TableRow>
            )) 
            : data?.messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium whitespace-pre-wrap">{message.message}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {/* {isPending ? "Loading..." : JSON.stringify(data, null, 2)} */}
    </pre>
  </div>
}   






