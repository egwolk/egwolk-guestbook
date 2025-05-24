import { createFileRoute } from '@tanstack/react-router'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute('/createMessage')({
  component: CreateMessage,
})

function CreateMessage() {
  return (
    <div className="p-2">
      <h2>Send Message</h2>
      <form action="" className='max-w-xl m-auto'>
        <Label className='mb-1' htmlFor="message">Message</Label>
        <Input type="text" id="message" placeholder="message" />
        <Button className='mt-4' type='submit'>Send</Button>
      </form>
    </div>
  )
}
