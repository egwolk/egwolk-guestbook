import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { userQueryOptions,getAllMessagesQueryOptions, loadingCreateMessageQueryOptions } from '../../lib/api'

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


export const Route = createFileRoute('/_authenticated/messages')({
  component: Messages,
})



function Messages() {
  const { isPending: isMessagesPending, error: messagesError, data: messagesData } = useQuery(getAllMessagesQueryOptions)
  const { isPending: isUsersPending, error: usersError, data: usersData } = useQuery(userQueryOptions)
  const { data: loadingCreateMessage } = useQuery(loadingCreateMessageQueryOptions)
  // if (isPending) return 'Loading...'

  // if (error) return 'An error has occurred: ' + error.message
  if (messagesError || usersError) return 'An error has occurred: ' + (messagesError?.message || usersError?.message) 

  const userMap = usersData?.user
    ? { [usersData.user.id]: usersData.user }
    : {}

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
          {loadingCreateMessage?.message &&  (
            <TableRow>
                <TableCell className="font-medium whitespace-pre-wrap">
                  {userMap[loadingCreateMessage?.message.message]?.preferred_username ?? <Skeleton className="w-[100px] h-[20px] rounded-full" />} &nbsp;
                  {loadingCreateMessage?.message.message ?? <Skeleton className="w-[100px] h-[20px] rounded-full" />} <br/>
                  {loadingCreateMessage?.message.message}
                </TableCell>
              </TableRow>
          )}
          
          {
          isMessagesPending || isUsersPending ? (
            Array(1).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </TableCell>
              </TableRow>
            ))
          ) : 
          messagesData?.messages.length === 0 ? (
            <TableRow>
              <TableCell className="font-medium text-center" colSpan={2}>
                No messages yet
              </TableCell>
            </TableRow>
          ) : (
            messagesData?.messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-medium whitespace-pre-wrap">
                  {userMap[message.userId]?.preferred_username ?? "Unknown"} &nbsp;
                  {new Date(message.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })} <br/>
                  {message.message}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </pre>
  </div>
} 






