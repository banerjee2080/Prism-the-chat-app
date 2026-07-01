import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/20 backdrop-blur-md">
      <div className="max-w-md text-center space-y-6 glass-panel p-10 flex flex-col items-center">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center
             justify-center shadow-lg border border-primary/30"
            >
              <MessageSquare className="w-8 h-8 text-primary drop-shadow-sm" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold tracking-tight">Welcome to Prism</h2>
        <p className="text-base-content/70">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
