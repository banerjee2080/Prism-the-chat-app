const SKELETON_ROWS = [
  { sent: false, w: "12rem" },
  { sent: false, w: "8rem" },
  { sent: true, w: "14rem" },
  { sent: false, w: "16rem" },
  { sent: true, w: "9rem" },
  { sent: true, w: "12rem" },
];

const MessageSkeleton = () => (
  <div className="flex-1 min-h-0 overflow-hidden px-4 sm:px-6 py-5 flex flex-col gap-3">
    {SKELETON_ROWS.map((row, idx) => (
      <div
        key={idx}
        style={{ "--i": idx }}
        className={`stagger animate-fade-in flex items-end gap-2 ${
          row.sent ? "justify-end" : "justify-start"
        }`}
      >
        {!row.sent && <div className="shimmer size-8 rounded-full shrink-0" />}
        <div
          className="shimmer h-11 rounded-[1.35rem]"
          style={{ width: row.w, maxWidth: "70%" }}
        />
      </div>
    ))}
  </div>
);

export default MessageSkeleton;
