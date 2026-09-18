import { Circle, Clock, CheckCircle2 } from "lucide-react"

type Status = "OPEN" | "IN_PROGRESS" | "CLOSED"

const config = {
  OPEN: {
    label: "Aberto",
    className: "bg-red-50 text-red-700",
    Icon: Circle,
  },
  IN_PROGRESS: {
    label: "Em atendimento",
    className: "bg-blue-light text-blue-base",
    Icon: Clock,
  },
  CLOSED: {
    label: "Encerrado",
    className: "bg-green-50 text-green-700",
    Icon: CheckCircle2,
  },
}

export function StatusBadge({ status }: { status: Status }) {
  const { label, className, Icon } = config[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xxs font-bold ${className}`}
    >
      <Icon size={12} />
      {label}
    </span>
  )
}