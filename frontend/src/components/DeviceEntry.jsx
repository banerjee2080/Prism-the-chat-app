import { useState } from "react";
import {
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  HardDrive,
  MapPin,
  Monitor,
  LogOutIcon,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

const getDeviceIcon = (deviceType, os) => {
  const type = (deviceType || "").toLowerCase();
  const osName = (os || "").toLowerCase();

  if (
    type.includes("mobile") ||
    type.includes("phone") ||
    osName.includes("android") ||
    osName.includes("ios")
  )
    return <Smartphone className="size-5" />;
  if (type.includes("tablet") || osName.includes("ipad"))
    return <Tablet className="size-5" />;
  if (
    type.includes("desktop") ||
    type.includes("mac") ||
    type.includes("windows") ||
    type.includes("pc")
  )
    return <Monitor className="size-5" />;

  return <Laptop className="size-5" />;
};

const Meta = ({ icon: Icon, value }) =>
  value ? (
    <span className="flex items-center gap-1.5 text-[11px] text-base-content/50 min-w-0">
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{value}</span>
    </span>
  ) : null;

const DeviceEntry = ({ device, index = 0 }) => {
  const { removeDevice, devices } = useAuthStore();
  const [isRemoving, setIsRemoving] = useState(false);

  const currentDeviceId = localStorage.getItem("deviceId");
  const isCurrentDevice = currentDeviceId === device.deviceId;
  const isOnlyDevice = devices.length <= 1;

  const handleLogout = async (deviceId) => {
    setIsRemoving(true);
    try {
      await removeDevice(deviceId);
    } catch (error) {
      console.log("Error removing device: ", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div
      style={{ "--i": index }}
      className={`stagger animate-glass-rise glass-card glass-hover p-4 rounded-[1.4rem] ${
        isCurrentDevice ? "!border-primary/35" : ""
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`size-11 rounded-[1.1rem] grid place-items-center shrink-0 ${
            isCurrentDevice
              ? "bg-primary/15 text-primary"
              : "bg-base-content/8 text-base-content/60"
          }`}
        >
          {getDeviceIcon(device.deviceType, device.os)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm text-base-content/90 truncate">
              {device.deviceName || "Unknown Device"}
            </h3>
            {isCurrentDevice && (
              <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[9px] font-bold uppercase tracking-[0.12em]">
                This device
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            <Meta icon={HardDrive} value={device.os} />
            <Meta icon={Globe} value={device.browser} />
            <Meta icon={MapPin} value={device.ipAddress} />
          </div>

          {!isOnlyDevice && (
            <div className="flex justify-end mt-3">
              <button
                onClick={() => handleLogout(device.deviceId)}
                disabled={isRemoving}
                className="press h-8 px-3 rounded-xl border border-error/30 text-error text-[11px] font-bold uppercase tracking-[0.1em] flex items-center gap-1.5 hover:bg-error/12 transition-colors disabled:opacity-60"
              >
                {isRemoving ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <LogOutIcon className="size-3.5" />
                )}
                {isCurrentDevice ? "Log out" : "Remove"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceEntry;
