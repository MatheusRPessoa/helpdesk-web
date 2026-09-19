export function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatCurrency(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}