import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import DeviceEntry from "../components/DeviceEntry";
import { useNavigate } from "react-router-dom";
import { X, MonitorSmartphone } from "lucide-react";

const Devices = () => {
  const { devices, getDevices } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-300/60 backdrop-blur-sm">
      <div className="glass w-full max-w-md bg-base-100/50 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <button
          onClick={() => navigate("/profile")}
          className="absolute top-4 right-4 p-2 bg-base-200/50 hover:bg-base-300/50 rounded-full transition-colors z-20"
        >
          <X className="size-5" />
        </button>

        {/* Subtle background glow effect */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col flex-1 overflow-hidden">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 shadow-inner">
              <MonitorSmartphone className="size-8" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-base-content mb-2">
              Your Devices
            </h1>
            <p className="text-base-content/60 text-sm">
              Devices currently logged into your account.
            </p>
          </div>

          <div className="overflow-y-auto pr-2 space-y-2 custom-scrollbar flex-1">
            {devices.length === 0 ? (
              <div className="text-center text-base-content/50 py-8 bg-base-200/30 rounded-2xl border border-base-content/5">
                No devices found.
              </div>
            ) : (
              devices.map((device) => (
                <DeviceEntry key={device._id || device.deviceId} device={device} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devices;
