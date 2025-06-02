import * as React from "react"
import { Slot as RadixSlot } from "@radix-ui/react-slot"

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    return <RadixSlot ref={ref} {...props}>{children}</RadixSlot>
  }
)
Slot.displayName = "Slot"

export { Slot }