const PERIODS = [
  {
    label: "Manhã",
    hours: ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"],
  },
  {
    label: "Tarde",
    hours: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  },
  { label: "Noite", hours: ["19:00", "20:00", "21:00", "22:00", "23:00"] },
];

interface HourPickerProps {
  selected: string[];
  onChange: (hours: string[]) => void;
}

export function HourPicker({ selected, onChange }: HourPickerProps) {
  function toggle(hour: string) {
    if (selected.includes(hour)) {
      onChange(selected.filter((item) => item !== hour));
    } else {
      onChange([...selected, hour].sort());
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {PERIODS.map((period) => (
        <div key={period.label}>
          <p className="mb-2 text-xxs font-bold uppercase tracking-wider text-gray-500">
            {period.label}
          </p>

          <div className="flex flex-wrap gap-2">
            {period.hours.map((hour) => {
              const isSelected = selected.includes(hour);

              return (
                <button
                  key={hour}
                  type="button"
                  onClick={() => toggle(hour)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-xxs transition${
                    isSelected
                      ? "border-blue-base bg-blue-light font-bold text-blue-base"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {hour}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
