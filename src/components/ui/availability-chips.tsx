interface AvailabilityChipsProps {
    hours: string[]
    max?: number
}

export function AvailabilityChips({ hours, max = 4 }: AvailabilityChipsProps) {
    const visible = hours.slice(0, max)
    const remaining = hours.length - visible.length

    return (
        <div className="flex flex-wrap items-center gap-1">
            {visible.map((hour) => (
                <span
                  key={hour}
                  className="rounded-full border border-gray-300 px-2.5 py-1 text-xxs text-gray-600"
                >
                    {hour}
                </span>
            ))}

            {remaining > 0 && (
                <span className="rounded-full border border-gray-300 px-2.5 py-1 text-xxs text-gray-500">
                    +{remaining}
                </span>
            )}
        </div>
    )
}