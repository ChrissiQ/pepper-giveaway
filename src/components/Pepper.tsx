import clsx from "clsx";
import { useReservations, useAuth } from "@/hooks";
import HeartIcon from "@/components/HeartIcon";
import ReservationLine from "@/components/ReservationLine";

function getHeatLevel(heat: number): { level: string; className: string } {
  if (heat <= 100) {
    return { level: "mild", className: "text-green-600" };
  } else if (heat <= 10000) {
    return { level: "medium", className: "text-yellow-400" };
  } else if (heat <= 100000) {
    return { level: "hot", className: "text-red-600" };
  } else {
    return { level: "very hot", className: "text-red-800" };
  }
}

export default function Pepper({
  active,
  count,
  format = "regular",
  heat,
  image,
  name,
  onActivate,
}: {
  active: boolean;
  count: number;
  format?: "regular" | "wide";
  heat: number;
  image: string;
  name: string;
  onActivate: () => void;
}) {
  const { level, className } = getHeatLevel(heat);
  const { user } = useAuth();
  const { reservations, reserve, unreserve } = useReservations(name, count);

  const userEmail = user?.email ?? null;
  const hasReserved =
    userEmail !== null && reservations.some((r) => r.email === userEmail);
  const isFull = reservations.length >= count;
  const showOverlay = !hasReserved && !isFull;

  return (
    <article
      className={clsx("flex flex-col", format === "wide" && "md:col-span-2")}
    >
      <h1 className="text-3xl">
        {name} ({count.toString()})
      </h1>
      <p className={clsx(className, "font-bold text-2xl")} data-heat={heat}>
        {heat.toLocaleString()} SHU ({level})
      </p>
      <div className="mb-4">
        {reservations.map((r) => (
          <ReservationLine
            key={r.key}
            name={r.name}
            isOwner={userEmail === r.email}
            onRemove={() => unreserve(r.key)}
          />
        ))}
      </div>
      <div
        className="relative mt-auto group"
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
      >
        <img
          src={image}
          alt=""
          className={clsx(
            "mb-0 mt-auto w-full object-cover",
            format === "wide" ? "aspect-3/2" : "aspect-5/7",
          )}
        />
        {showOverlay && (
          <div
            className={clsx(
              "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
              "opacity-0 group-hover:opacity-100",
              active && "opacity-100",
            )}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                reserve();
              }}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-lg font-semibold text-gray-900 shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <HeartIcon className="size-6" />I want this!
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
