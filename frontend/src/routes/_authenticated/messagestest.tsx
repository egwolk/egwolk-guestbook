import { createFileRoute } from '@tanstack/react-router'
import { useQuery} from '@tanstack/react-query'
import { useRef, useEffect } from "react"
import { 
  userQueryOptions, 
  getAllMessagesQueryOptions, 
  loadingCreateMessageQueryOptions,
  loadingEditMessageQueryOptions
} from '../../lib/api'

import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageList } from "@/components/ui/MessageList"


import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute('/_authenticated/messagestest')({
  component: Messages,
})



function Messages() {
  const { isPending: isMessagesPending, error: messagesError, data: messagesData } = useQuery(getAllMessagesQueryOptions)
  const { isPending: isUsersPending, error: usersError, data: usersData } = useQuery(userQueryOptions)
  const { data: loadingCreateMessage } = useQuery(loadingCreateMessageQueryOptions)
  const { data: loadingEditMessage } = useQuery(loadingEditMessageQueryOptions)
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messagesData?.messages, isMessagesPending, isUsersPending])
  
  if (messagesError || usersError) return 'An error has occurred: ' + (messagesError?.message || usersError?.message) 

  const userMap = usersData?.user
    ? { [usersData.user.id]: usersData.user }
    : {}

  return (
    <div className="p-2 max-w-3xl m-auto">
      <pre>
        <ScrollArea className="h-[500px]">
          <div ref={scrollRef} style={{ maxHeight: 500, overflowY: "auto" }}>
            {loadingCreateMessage?.message && (
              <div>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </div>
            )}
            {isMessagesPending || isUsersPending ? (
              Array(10).fill(0).map((_, i) => (
                <div key={i}>
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </div>
              ))
            ) : messagesData?.messages.length === 0 ? (
              <div>No messages yet</div>
            ) : (
              <MessageList
                messages={messagesData.messages}
                userMap={userMap}
                loadingEditMessage={
                  loadingEditMessage && typeof loadingEditMessage.id === "number"
                    ? { id: loadingEditMessage.id }
                    : undefined
                }
              />
            )}
          </div>
        </ScrollArea>
      </pre>
    </div>
  );
} 







