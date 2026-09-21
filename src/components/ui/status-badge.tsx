import { Circle, Clock, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge, type BadgeVariant } from "./badge";
import type { TicketStatus } from "@/types";

type StatusConfig = {
  label: string;
  variant: BadgeVariant;
  Icon: LucideIcon;
};

const config: Record<TicketStatus, StatusConfig> = {
  OPEN: { label: "Aberto", variant: "danger", Icon: Circle },
  IN_PROGRESS: { label: "Em atendimento", variant: "info", Icon: Clock },
  CLOSED: { label: "Encerrado", variant: "success", Icon: CheckCircle2 },
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, variant, Icon } = config[status];

  return (
    <Badge variant={variant} icon={<Icon size={12} />}>
      {label}
    </Badge>
  );
}
