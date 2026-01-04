import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Camera } from "lucide-react";
import tiltedImage from "@/assets/tilted image.png";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { initializeRoomQueue, getRoomPath } from "@/hooks/useRoomQueue";

export default function StartReport() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleStartReporting = () => {
    // Open the drawer to request camera access
    setIsDrawerOpen(true);
  };

  const handleAllowCamera = async () => {
    try {
      // Request camera access
      await navigator.mediaDevices.getUserMedia({ video: true });
      // If permission granted, initialize the room queue
      const queue = initializeRoomQueue();
      setIsDrawerOpen(false);

      if (queue.length > 0) {
        // Navigate to first room in queue
        navigate(getRoomPath(queue[0]));
      } else {
        // No rooms selected, go back to room selection
        navigate("/property/rooms");
      }
    } catch (error) {
      // Handle permission denied or error
      console.error("Camera access denied:", error);
      setIsDrawerOpen(false);
      alert(
        "Camera access was denied. Please enable camera access in your browser settings to continue."
      );
    }
  };

  const handleNotNow = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      {/* Mobile container */}
      <div className="relative min-h-screen w-full min-w-[375px] max-w-[430px] bg-white shadow-2xl overflow-hidden">
        {/* Background Gradient Ellipses */}
        {/* First ellipse - Pink */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "300px",
            height: "300px",
            left: "-111px",
            top: "-13px",
            background: "#FDF2F8",
            opacity: 0.5,
            borderRadius: "50%",
            filter: "blur(72px)",
          }}
        />
        {/* Second ellipse - Blue */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "350px",
            height: "350px",
            right: "-100px",
            top: "100px",
            background: "#EFF6FF",
            borderRadius: "50%",
            filter: "blur(154px)",
          }}
        />

        {/* Main content wrapper */}
        <div className="relative flex min-h-screen flex-col px-6">
          {/* Header with back button */}
          <header className="pt-14 pb-6">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Go back"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-6 w-6 text-slate-600" />
            </button>
          </header>

          {/* Title */}
          <h1 className="text-[24px] font-bold tracking-[-0.04em] text-slate-950 leading-tight mb-8">
            Get ready to create your first inventory report.
          </h1>

          {/* Tilted Images */}
          <div className="flex justify-center mb-8">
            <img
              src={tiltedImage}
              alt="Room photos preview"
              className="w-full max-w-[300px] h-auto"
            />
          </div>

          {/* Info Cards */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Card 1 */}
            <div
              className="relative rounded-xl p-[2px]"
              style={{
                background: "linear-gradient(90deg, #FDF2F8 0%, #EFF6FF 100%)",
                boxShadow: "1px 8px 40px 0px rgba(100, 116, 139, 0.15)",
              }}
            >
              <div className="bg-white rounded-[10px] p-4">
                <p className="text-[14px] text-slate-700 leading-relaxed tracking-[-0.04em]">
                  You're creating a time-stamped record of the property's
                  condition at move in.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="relative rounded-xl p-[2px]"
              style={{
                background: "linear-gradient(90deg, #FDF2F8 0%, #EFF6FF 100%)",
                boxShadow: "1px 8px 40px 0px rgba(100, 116, 139, 0.15)",
              }}
            >
              <div className="bg-white rounded-[10px] p-4">
                <p className="text-[14px] text-slate-700 leading-relaxed tracking-[-0.04em]">
                  This report can be used as evidence for move-in and move-out,
                  helping avoid disputes later.
                </p>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer Disclaimer */}
          <p className="text-[12px] text-slate-500 text-center leading-relaxed mb-4 tracking-[-0.04em]">
            This usually takes about 5 minutes per room and we'll ask for camera
            access when you click 'Start reporting'.
          </p>

          {/* Start Reporting Button */}
          <Button
            type="button"
            onClick={handleStartReporting}
            className="w-full rounded-full h-[56px] text-[16px] font-semibold bg-slate-950 hover:bg-slate-900 mb-10"
          >
            Start reporting
          </Button>
        </div>

        {/* Camera Access Drawer */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="mx-auto mb-4 left-4 right-4 max-w-[398px] bg-transparent border-0 data-[vaul-drawer-direction=bottom]:border-0 [&>div:first-child]:hidden">
            {/* Gradient border wrapper */}
            <div
              className="rounded-2xl p-[2px]"
              style={{
                background: "linear-gradient(90deg, #FDF2F8 0%, #EFF6FF 100%)",
              }}
            >
              <div className="bg-white rounded-[14px] px-6 pb-8 pt-4">
                {/* Drag Handle */}
                <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-300" />

                {/* Camera Icon */}
                <div className="flex justify-center mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <Camera className="h-8 w-8 text-slate-600" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-[20px] font-bold text-slate-950 text-center mb-2 tracking-[-0.04em]">
                  Enable camera access
                </h2>

                {/* Description */}
                <p className="text-[14px] text-slate-500 text-center mb-8 tracking-[-0.04em]">
                  Allow Move-in proof to access your camera
                </p>

                {/* Buttons */}
                <DrawerFooter className="p-0 gap-3">
                  <Button
                    onClick={handleAllowCamera}
                    className="w-full rounded-full h-[56px] text-[16px] font-semibold bg-slate-950 hover:bg-slate-900"
                  >
                    Allow camera access
                  </Button>
                  <DrawerClose asChild>
                    <button
                      onClick={handleNotNow}
                      className="text-[14px] font-medium text-slate-500 hover:text-slate-700 transition-colors py-2"
                    >
                      Not now
                    </button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
