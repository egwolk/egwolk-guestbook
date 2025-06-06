import { createFileRoute } from '@tanstack/react-router'

// import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"


import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'

import { createMessage, getAllMessagesQueryOptions, loadingCreateMessageQueryOptions } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

import { createMessageSchema } from '@backend/sharedTypes'

export const Route = createFileRoute('/_authenticated/createMessage')({
  component: CreateMessage,
})

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {/* {field.state.meta.isValidating ? 'Validating...' : null} */}
    </>
  )
}

function CreateMessage() {
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: {
      message: '',
    },
    onSubmit: async ({ value, formApi }) => {
      const existingMessages = await queryClient.ensureQueryData(getAllMessagesQueryOptions)
      //await new Promise(r => setTimeout(r, 3000)) // Simulate network delay
      // Do something with form data
      
      formApi.reset()

      queryClient.setQueryData(loadingCreateMessageQueryOptions.queryKey, {message: value})

      try{
        const newMessage = await createMessage({ value })
        queryClient.setQueryData(getAllMessagesQueryOptions.queryKey, {
          ...existingMessages,
          messages: [newMessage, ...existingMessages.messages],
        })
        toast("Message Created", {
          description: `Message created successfully!`,
        })
      }catch (e) {
        toast("Error", {
          description: `An error occurred while creating the message: ${e instanceof Error ? e.message : 'Unknown error'}`,
        })
      }finally {
        queryClient.setQueryData(loadingCreateMessageQueryOptions.queryKey, {})
      }
      
      

      
      console.log(value)
      
    },
  })

  return (
    <div className="p-2">
      <h2>Send Message</h2>
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
                createMessageSchema.shape.message.safeParse(value)
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
              {isSubmitting ? '...' : 'Post'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
