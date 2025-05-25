import { createFileRoute } from '@tanstack/react-router'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'

import { api } from '@/lib/api'

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
  const form = useForm({
    defaultValues: {
      message: '',
    },
    onSubmit: async ({ value, formApi }) => {
      await new Promise(r => setTimeout(r, 3000)) // Simulate network delay
      // Do something with form data
      const res = await api.messages.$post({ json: value })
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      console.log(value)
      formApi.reset()
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
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <Label className='mb-1' htmlFor={field.name}>Message</Label>
                  <Input
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
