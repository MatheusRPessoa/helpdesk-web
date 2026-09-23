import { Badge } from "./badge";
import { TICKET_STATUS } from "@/config/ticket-status";
import type { TicketStatus } from "@/types";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, variant, Icon } = TICKET_STATUS[status];

  return (
    <Badge variant={variant} icon={<Icon size={12} />}>
      {label}
    </Badge>
  );
}
