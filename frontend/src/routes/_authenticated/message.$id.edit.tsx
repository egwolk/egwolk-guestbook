import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getMessageQueryOptions } from '@/lib/api'

export const Route = createFileRoute('/_authenticated/message/$id/edit')({
  component: Message,
})

function Message() {
  const { id } = Route.useParams()
  const { data: messageData } = useQuery(getMessageQueryOptions(Number(id)))
  // const {data: userData } = useQuery(userQueryOptions)

  

  // const userMap = userData?.user
  //   ? { [userData.user.id]: userData.user }
  //   : {}

  return (
    <div>
      update message
      <p>Message ID: {id}</p>
      {/* <pre>{JSON.stringify(messageData, null, 2)}</pre> */}
      <p>Message: {messageData?.message}</p>
    </div>
  )
}
