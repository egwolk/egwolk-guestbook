import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"
import { toast } from 'sonner'
import { deleteMessage, getAllMessagesQueryOptions } from '../../lib/api'

export function MessageEditButton({ id }: { id: number }) {
  const navigate = useNavigate()
  return (
    <Button
      onClick={() => navigate({ to: `/message/${id}/edit` })}
      variant="outline"
      size="icon"
      className="size-8"
    >
      <Pencil />
    </Button>
  )
}

export function MessageDeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: deleteMessage,
    onError: () => {
      toast("Error", {
        description: `An error occurred while deleting the message.`,
      })
    },
    onSuccess: () => {
      toast("Message Deleted", {
        description: `Message deleted successfully!`,
      })
      queryClient.setQueryData(
        getAllMessagesQueryOptions.queryKey,
        (existingMessages) => ({
          ...existingMessages,
          messages: existingMessages!.messages.filter((m) => m.id !== id),
        })
      )
    },
  })
  return (
    <Button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ id })}
      variant="outline"
      size="icon"
      className="size-8"
    >
      {mutation.isPending ? "..." : <Trash />}
    </Button>
  )
}