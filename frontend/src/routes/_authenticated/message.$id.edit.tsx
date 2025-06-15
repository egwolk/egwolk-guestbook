import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { loadingEditMessageQueryOptions, editMessage, getAllMessagesQueryOptions } from '@/lib/api'
import { editMessageSchema } from '@backend/sharedTypes'
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'

import { toast } from "sonner"
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/message/$id/edit')({
  component: EditMessage,
})




function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

function EditMessage() {
  const { id } = Route.useParams()
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const form  = useForm({
    defaultValues: {
      message: '',
    },
    onSubmit: async ({ value, formApi }) => {
      const existingMessages = await queryClient.ensureQueryData(getAllMessagesQueryOptions)
      formApi.reset()
      navigate({ to: '/messages' })
      queryClient.setQueryData(loadingEditMessageQueryOptions.queryKey, {id: Number(id)})

      try{
          const updatedMessage = await editMessage({ id: Number(id), value })
          const updatedMessageWithStrings = {
          ...updatedMessage,
          createdAt: updatedMessage.createdAt instanceof Date
            ? updatedMessage.createdAt.toISOString()
            : updatedMessage.createdAt,
          modifiedAt: updatedMessage.modifiedAt instanceof Date
            ? updatedMessage.modifiedAt.toISOString()
            : updatedMessage.modifiedAt,
}
          queryClient.setQueryData(getAllMessagesQueryOptions.queryKey, {
            ...existingMessages,
            messages: existingMessages.messages.map((msg) =>
              msg.id === updatedMessageWithStrings.id ? updatedMessageWithStrings : msg
            ),
          })
          toast("Message Updated", {
            description: `Message updated successfully!`,
          })
        }catch (e) {
          toast("Error", {
            description: `An error occurred while updating the message: ${e instanceof Error ? e.message : 'Unknown error'}`,
          })
        }finally {
          queryClient.setQueryData(loadingEditMessageQueryOptions.queryKey, {})
        }
    }

    
  })
  
  // const { data: messageData } = useQuery(getMessageQueryOptions(Number(id)))
  // const {data: userData } = useQuery(userQueryOptions)

  

  // const userMap = userData?.user
  //   ? { [userData.user.id]: userData.user }
  //   : {}

  return (
    <div className="p-2">
      <h2>Update Message</h2>
      {/* <p>Message ID: {id}</p> */}
      {/* <pre>{JSON.stringify(messageData, null, 2)}</pre> */}
      {/* <p>Message: {messageData?.message}</p> */}

      <form className='max-w-xl m-auto'
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="message"
          validators={{
            onChange: (value) => {
              editMessageSchema.shape.message.safeParse(value)
            }
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <>
                <Label className='mb-1' htmlFor={field.name}>Message</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )
          }}
        /> 
        <form.Subscribe
          selector={(state) => [
            state.canSubmit && state.values.message.trim().length > 0, 
            state.isSubmitting
          ]}
          children={([canSubmit, isSubmitting]) => (
            <Button className='mt-4' type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Update'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
