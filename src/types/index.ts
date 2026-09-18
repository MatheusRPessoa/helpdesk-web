export type UserRole = "ADMIN" | "TECHNICIAN" | "CUSTOMER"

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    avatarUrl: string | null
    mustChangePassword?: boolean
    createdAt: string
    updatedAt: string
}

export interface SignInResponse {
    token: string
    user: User
}

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED"

export interface TicketService {
  id: string
  price: string
  isAdditional: boolean
  service: { id: string; title: string }
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  createdAt: string
  updatedAt: string
  total: string
  customer: { id: string; name: string; email: string; avatarUrl: string | null }
  technician: { id: string; name: string; email: string; avatarUrl: string | null }
  services: TicketService[]
}
