import { Users } from "lucide-react";

const SideBarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-content/10 
      flex flex-col transition-all duration-300 bg-base-100/30 backdrop-blur-xl"
    >
      {/* Header Skeleton */}
      <div className="border-b border-base-content/10 w-full p-5 flex items-center justify-center lg:justify-start gap-3">
        <Users className="w-5 h-5 text-base-content/30" />
        <div className="hidden lg:block h-4 w-24 bg-base-content/10 rounded-full animate-pulse" />
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3 px-2 flex flex-col gap-2">
        {skeletonContacts.map((_, idx) => (
          <div 
            key={idx} 
            className="w-full p-3 flex items-center gap-3 rounded-2xl glass-liquid opacity-70"
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="size-12 rounded-full bg-base-content/20 animate-pulse shadow-sm border border-white/5" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:flex flex-col gap-2 flex-1 min-w-0">
              <div className="h-4 w-28 bg-base-content/20 rounded-full animate-pulse border border-white/5" />
              <div className="h-3 w-16 bg-base-content/10 rounded-full animate-pulse border border-white/5" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideBarSkeleton;
