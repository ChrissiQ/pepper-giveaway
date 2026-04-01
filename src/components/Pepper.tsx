import clsx from "clsx";
import { useReservations, useAuth } from "@/hooks";
import ReserveIcon from "@/components/ReserveIcon";
import UnreserveIcon from "@/components/UnreserveIcon";
import AvailabilityIndicator from "@/components/AvailabilityIndicator";

function getHeatLevel(heat: number): { level: string; className: string } {
  if (heat <= 100) {
    return { level: "mild", className: "text-green-600" };
  } else if (heat <= 10000) {
    return {
      level: "medium",
      className: "text-yellow-600 dark:text-yellow-400",
    };
  } else if (heat <= 100000) {
    return { level: "hot", className: "text-red-600" };
  } else {
    return { level: "very hot", className: "text-red-800 dark:text-pink-400" };
  }
}

export default function Pepper({
  count,
  format = "regular",
  heat,
  image,
  name,
}: {
  count: number;
  format?: "regular" | "wide";
  heat: number;
  image: string;
  name: string;
}) {
  const { level, className: heatColorBase } = getHeatLevel(heat);
  const { user } = useAuth();
  const { reservations, reserve, unreserve, loading } = useReservations(
    name,
    count,
  );

  const userEmail = user?.email ?? null;
  const hasReserved =
    userEmail !== null && reservations.some((r) => r.email === userEmail);
  const heatColor =
    hasReserved && level === "very hot" ? "text-pink-400" : heatColorBase;
  const isFull = reservations.length >= count;
  const canReserve = !hasReserved && !isFull;

  return (
    <article
      className={clsx(
        "group grid grid-rows-subgrid row-span-2 overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-900",
        format === "wide" && "md:col-span-2",
        hasReserved && "shadow-xl shadow-black/40",
      )}
    >
      <div className="relative col-start-1 row-span-full">
        <img
          src={image}
          alt=""
          className={clsx(
            "h-full w-full object-cover",
            format === "wide" ? "aspect-3/2" : "aspect-5/7",
          )}
        />

        {hasReserved && (
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/0 to-transparent" />
        )}

        {canReserve && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              reserve();
            }}
            className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-base font-medium text-gray-900 shadow-lg transition cursor-pointer hover:scale-105"
            aria-label="Reserve this pepper"
          >
            Claim
            <ReserveIcon className="size-5" />
          </button>
        )}

        {hasReserved && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const mine = reservations.find((r) => r.email === userEmail);
              if (mine) unreserve(mine.key);
            }}
            className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-red-500 px-4 py-2.5 text-base font-medium text-white shadow-lg transition cursor-pointer hover:scale-105"
            aria-label="Remove your reservation"
          >
            Cancel
            <UnreserveIcon className="size-5" />
          </button>
        )}
      </div>

      <div
        className={clsx(
          "@container/card relative z-10 col-start-1 row-start-2",
          hasReserved
            ? "text-white"
            : "bg-white dark:bg-gray-900/90 dark:backdrop-blur-sm",
        )}
      >
        <div className="flex flex-col justify-start px-[4cqw] py-[6cqw] @min-[24rem]/card:px-6 @min-[24rem]/card:py-8">
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className={clsx("text-lg font-bold", heatColor)}>
            {heat.toLocaleString()} SHU ({level})
          </p>
          <div className="mt-2">
            <AvailabilityIndicator
              count={count}
              reserved={reservations.length}
              hasReserved={hasReserved}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
