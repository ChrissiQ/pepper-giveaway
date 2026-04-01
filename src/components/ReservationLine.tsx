export default function ReservationLine({
  name,
  isOwner,
  onRemove,
}: {
  name: string;
  isOwner: boolean;
  onRemove: () => void;
}) {
  return (
    <p className="flex items-center gap-1 text-lg text-gray-500">
      {isOwner ? (
        <>
          Reserved by you!
          <button
            onClick={onRemove}
            className="ml-1 inline-flex size-5 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
            aria-label="Remove reservation"
          >
            &times;
          </button>
        </>
      ) : (
        `Reserved by ${name}`
      )}
    </p>
  );
}
