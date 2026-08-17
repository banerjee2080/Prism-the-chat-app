const SKELETON_CONTACTS = Array(7).fill(null);

const SideBarSkeleton = () => (
  <aside className="h-full w-full lg:w-[23rem] lg:border-r border-base-content/5 flex flex-col">
    <div className="px-5 pt-5 pb-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="shimmer h-5 w-28 rounded-full" />
          <div className="shimmer h-3 w-20 rounded-full" />
        </div>
        <div className="shimmer size-11 rounded-2xl" />
      </div>
      <div className="shimmer h-11 w-full rounded-full" />
      <div className="shimmer h-11 w-full rounded-2xl" />
    </div>

    <div className="mx-5 h-px bg-gradient-to-r from-transparent via-base-content/10 to-transparent" />

    <div className="flex-1 overflow-hidden px-3 py-3 flex flex-col gap-1.5">
      {SKELETON_CONTACTS.map((_, idx) => (
        <div
          key={idx}
          style={{ "--i": idx }}
          className="stagger animate-fade-in w-full p-3 flex items-center gap-3.5 rounded-2xl"
        >
          <div className="shimmer size-12 rounded-[1.1rem] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="shimmer h-3.5 w-32 rounded-full" />
            <div className="shimmer h-2.5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </aside>
);

export default SideBarSkeleton;
