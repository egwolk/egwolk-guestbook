import { CenteredSeparator } from "@/components/ui/centered-separator"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageDeleteButton, MessageEditButton } from "@/components/ui/MessageButtons"
// import { SelectMessage } from "@backend/sharedTypes"

interface Message {
  id: number
  userId: string
  createdAt: string
  modifiedAt: string
  message: string
}

interface UserMap {
  [key: string]: { preferred_username: string }
}

interface MessageListProps {
  messages: Message[]
  userMap: UserMap
  loadingEditMessage?: { id: number }
}

export function MessageList({ messages, userMap, loadingEditMessage }: MessageListProps) {
  let lastDate: string | null = null

  return (
    <>
      {messages.slice().reverse().map((message) => {
        const messageDate = new Date(message.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })

        const showSeparator = messageDate !== lastDate
        lastDate = messageDate

        return (
          <div key={message.id}>
            {showSeparator && <CenteredSeparator text={messageDate} />}
            {loadingEditMessage?.id === message.id ? (
              <Skeleton className="w-[100px] h-[20px] rounded-full" />
            ) : (
              <div>
                {userMap[message.userId]?.preferred_username ?? "Unknown"} &nbsp;
                {new Date(message.createdAt).toLocaleString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })} <br />
                {message.modifiedAt !== message.createdAt && (
                  <div>
                    edited: &nbsp;
                    {new Date(message.modifiedAt).toLocaleString(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })} <br />
                  </div>
                )}
                {message.message}
                <MessageDeleteButton id={message.id} />
                <MessageEditButton id={message.id} />
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}