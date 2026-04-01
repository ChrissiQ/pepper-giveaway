import clsx from "clsx";
import { useReservations, useAuth } from "../hooks";

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
  name,
  count,
  heat,
  image,
  format = "regular",
  active,
  onActivate,
}: {
  name: string;
  count: number;
  heat: number;
  image: string;
  format?: "regular" | "wide";
  active: boolean;
  onActivate: () => void;
}) {
  const { level, className } = getHeatLevel(heat);
  const { user } = useAuth();
  const { reservations, reserve, unreserve } = useReservations(name, count);

  const displayName = user?.displayName ?? user?.email ?? null;
  const hasReserved =
    displayName !== null && reservations.some((r) => r.name === displayName);
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
      {reservations.map((r) => (
        <p
          key={r.key}
          className="flex items-center gap-1 text-sm text-gray-500"
        >
          Reserved by {r.name}
          {displayName === r.name && (
            <button
              onClick={() => unreserve(r.key)}
              className="ml-1 inline-flex size-5 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
              aria-label="Remove reservation"
            >
              &times;
            </button>
          )}
        </p>
      ))}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              I want this!
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
