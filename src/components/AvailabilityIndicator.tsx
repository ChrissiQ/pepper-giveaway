import clsx from "clsx";

function Dot({ state }: { state: "available" | "taken" | "yours" }) {
  if (state === "yours") {
    return (
      <span className="flex size-5 select-none items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
        {"\u2713"}
      </span>
    );
  }

  return (
    <span
      className={clsx(
        "inline-block size-5 rounded-full",
        state === "taken"
          ? "bg-gray-400 dark:bg-gray-500"
          : "border-2 border-gray-300 bg-transparent dark:border-gray-400",
      )}
    />
  );
}

export default function AvailabilityIndicator({
  count,
  reserved,
  hasReserved,
  loading,
}: {
  count: number;
  reserved: number;
  hasReserved: boolean;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex animate-pulse items-center gap-3">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i.toString()}
              className="inline-block size-5 rounded-full bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
        <span className="invisible text-md font-medium">
          {count.toString()} available
        </span>
      </div>
    );
  }

  const available = count - reserved;
  const othersReserved = hasReserved ? reserved - 1 : reserved;

  const dots: Array<"yours" | "taken" | "available"> = [];
  if (hasReserved) dots.push("yours");
  for (let i = 0; i < othersReserved; i++) dots.push("taken");
  for (let i = 0; i < available; i++) dots.push("available");

  const label =
    available > 0 ? `${available.toString()} available` : "All gone!";

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        {dots.map((state, i) => (
          <Dot key={i.toString()} state={state} />
        ))}
      </div>
      <span className="text-md font-medium">{label}</span>
    </div>
  );
}
