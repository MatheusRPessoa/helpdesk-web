import { Circle, Clock, CheckCircle2, type LucideIcon } from "lucide-react"

import type { BadgeVariant } from "@/components/ui/badge"
import type { TicketStatus } from "@/types"

interface TicketStatusConfig {
  label: string
  variant: BadgeVariant
  Icon: LucideIcon
  iconClassName: string
}

export const TICKET_STATUS: Record<TicketStatus, TicketStatusConfig> = {
  OPEN: {
    label: "Aberto",
    variant: "danger",
    Icon: Circle,
    iconClassName: "text-red-600",
  },
  IN_PROGRESS: {
    label: "Em atendimento",
    variant: "info",
    Icon: Clock,
    iconClassName: "text-blue-base",
  },
  CLOSED: {
    label: "Encerrado",
    variant: "success",
    Icon: CheckCircle2,
    iconClassName: "text-green-700",
  },
}