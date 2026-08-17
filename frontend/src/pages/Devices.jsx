import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import DeviceEntry from "../components/DeviceEntry";
import { useNavigate } from "react-router-dom";
import { MonitorSmartphone } from "lucide-react";
import GlassModal from "../components/GlassModal.jsx";

const Devices = () => {
  const { devices, getDevices } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  return (
    <GlassModal
      onClose={() => navigate("/profile")}
      icon={MonitorSmartphone}
      title="Your devices"
      subtitle="Everywhere you're currently signed in"
    >
      <div className="scroll-area flex-1 min-h-0 overflow-y-auto -mr-2 pr-2 space-y-2.5">
        {devices.length === 0 ? (
          <div className="glass-card text-center p-8 rounded-[1.4rem] text-sm text-base-content/50">
            No devices found.
          </div>
        ) : (
          devices.map((device, index) => (
            <DeviceEntry
              key={device._id || device.deviceId}
              device={device}
              index={index}
            />
          ))
        )}
      </div>
    </GlassModal>
  );
};

export default Devices;
