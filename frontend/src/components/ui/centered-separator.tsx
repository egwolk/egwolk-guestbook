import { Separator } from "./separator"

export function CenteredSeparator({ text }: { text: string }) {
  return (
    <div className="flex items-center w-full my-4">
      <Separator className="flex-1" />
      <span className="mx-4 text-muted-foreground whitespace-nowrap">{text}</span>
      <Separator className="flex-1" />
    </div>
  )
}