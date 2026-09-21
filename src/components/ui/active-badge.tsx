import { Badge } from "./badge";

export function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "success" : "danger"}>
      {isActive ? "Ativo" : "Inativo"}
    </Badge>
  );
}
