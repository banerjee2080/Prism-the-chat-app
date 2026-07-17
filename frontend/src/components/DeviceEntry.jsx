import React, { useState } from "react";
import {
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  HardDrive,
  MapPin,
  Monitor,
  LogOut,
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
    return <Smartphone className="size-6 text-primary" />;
  if (type.includes("tablet") || osName.includes("ipad"))
    return <Tablet className="size-6 text-secondary" />;
  if (
    type.includes("desktop") ||
    type.includes("mac") ||
    type.includes("windows") ||
    type.includes("pc")
  )
    return <Monitor className="size-6 text-accent" />;

  // Default fallback
  return <Laptop className="size-6 text-primary" />;
};

const DeviceEntry = ({ device }) => {
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
    <div className={`bg-base-100/50 backdrop-blur-md rounded-2xl p-4 border ${isCurrentDevice ? "border-primary/30" : "border-base-content/10"} hover:bg-base-100/70 transition-all duration-300 mb-3`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-base-200/50 flex items-center justify-center shadow-inner shrink-0">
          {getDeviceIcon(device.deviceType, device.os)}
        </div>

        <div className="flex-1 space-y-1 min-w-0">
          <h3 className="font-semibold text-base-content flex items-center gap-2 truncate">
            {device.deviceName || "Unknown Device"}
            {isCurrentDevice && (
              <span className="badge badge-sm badge-primary badge-outline text-[10px]">
                This Device
              </span>
            )}
          </h3>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-base-content/60 mt-2">
            {device.os && (
              <div className="flex items-center gap-1.5">
                <HardDrive className="size-3.5" />
                <span className="truncate">{device.os}</span>
              </div>
            )}

            {device.browser && (
              <div className="flex items-center gap-1.5">
                <Globe className="size-3.5" />
                <span className="truncate">{device.browser}</span>
              </div>
            )}

            {device.ipAddress && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                <span className="truncate">{device.ipAddress}</span>
              </div>
            )}
          </div>

          {!isOnlyDevice && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleLogout(device.deviceId)}
                disabled={isRemoving}
                className="btn btn-sm btn-error btn-outline rounded-xl flex items-center gap-2"
              >
                {isRemoving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogOutIcon className="size-4" />
                )}
                {isCurrentDevice ? "Log Out" : "Remove Device"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceEntry;
