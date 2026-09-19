interface UserBadgeProps {
    name: string
    email?: string
    avatarUrl?: string | null
    size?: "sm" | "md"
}

export function UserBadge({ name, email, avatarUrl, size = "sm" }: UserBadgeProps) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()

    const dimensions = size === "sm" ? "h-5 w-5 text-[8px]" : "h-8 w-8 text-xxs"

    return (
        <div className="flex items-center gap-2">
            {avatarUrl ? (
                <img
                src={`${import.meta.env.VITE_API_URL}/files/${avatarUrl}`}
                alt=""
                className={`rounded-full object-cover ${dimensions}`}
                />
            ) : (
                <span
                className={`flex items-center justify-center rounded-full bg-blue-base font-bold text-gray-100 ${dimensions}`}
                >
                {initials}
                </span>
            )}
            <div className="flex flex-col">
                <span className="text-xs text-gray-600">{name}</span>
                {email && <span className="text-xxs text-gray-500">{email}</span>}
            </div>
        </div>
    )
}