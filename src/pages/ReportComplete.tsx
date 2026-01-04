import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { clearRoomQueue, getRoomQueue } from "@/hooks/useRoomQueue";
import type { RoomQueueItem } from "@/hooks/useRoomQueue";

export default function ReportComplete() {
  const navigate = useNavigate();
  const roomQueue = getRoomQueue();

  const handleFinish = () => {
    // Clear the room queue
    clearRoomQueue();
    // Navigate to home or dashboard
    navigate("/");
  };

  // Get count of photos per room
  const getRoomPhotoCount = (room: RoomQueueItem): number => {
    const photosJson = localStorage.getItem(`${room.storageKey}_photos`);
    if (!photosJson) return 0;
    return JSON.parse(photosJson).length;
  };

  const totalPhotos = roomQueue.reduce(
    (sum, room) => sum + getRoomPhotoCount(room),
    0
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      {/* Mobile container */}
      <div className="relative min-h-screen w-full min-w-[375px] max-w-[430px] bg-white shadow-2xl overflow-hidden">
        {/* Main content wrapper */}
        <div className="flex min-h-screen flex-col px-6">
          {/* Spacer */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-slate-950 text-center mb-3">
              Report Complete!
            </h1>

            {/* Subtitle */}
            <p className="text-[16px] text-slate-500 text-center mb-8 tracking-[-0.04em] px-4">
              Your move-in inventory report has been saved successfully.
            </p>

            {/* Summary Card */}
            <div className="w-full bg-slate-50 rounded-2xl p-6 mb-8">
              <h2 className="text-[16px] font-semibold text-slate-900 mb-4 tracking-[-0.04em]">
                Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[14px] text-slate-600">
                    Rooms documented
                  </span>
                  <span className="text-[14px] font-medium text-slate-900">
                    {roomQueue.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-slate-600">
                    Total photos
                  </span>
                  <span className="text-[14px] font-medium text-slate-900">
                    {totalPhotos}
                  </span>
                </div>
              </div>

              {/* Room List */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <ul className="space-y-2">
                  {roomQueue.map((room, index) => (
                    <li
                      key={`${room.storageKey}-${index}`}
                      className="flex items-center justify-between text-[14px]"
                    >
                      <span className="flex items-center gap-2">
                        <span>{room.icon}</span>
                        <span className="text-slate-700">{room.name}</span>
                      </span>
                      <span className="text-slate-500">
                        {getRoomPhotoCount(room)} photos
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="pb-10 pt-4">
            <Button
              type="button"
              onClick={handleFinish}
              className="w-full rounded-full h-[56px] text-[16px] font-semibold bg-slate-900 hover:bg-slate-800"
            >
              Done
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
}
