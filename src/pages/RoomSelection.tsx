import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Minus, Plus } from "lucide-react";

interface RoomItem {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export default function RoomSelection() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomItem[]>([
    { id: "living", name: "Living room", icon: "🛋️", count: 0 },
    { id: "bedroom", name: "Bedroom", icon: "🛏️", count: 0 },
    { id: "kitchen", name: "Kitchen", icon: "🥘", count: 0 },
    { id: "bathroom", name: "Bathroom", icon: "🛁", count: 0 },
    { id: "loo", name: "Loo / WC", icon: "🚽", count: 0 },
    { id: "hallway", name: "Hallway", icon: "🚪", count: 0 },
    { id: "garden", name: "Garden", icon: "🏡", count: 0 },
    { id: "patio", name: "Patio", icon: "🏠", count: 0 },
  ]);

  const updateCount = (id: string, delta: number) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === id
          ? { ...room, count: Math.max(0, room.count + delta) }
          : room
      )
    );
  };

  const handleSubmit = () => {
    const selectedRooms = rooms.filter((room) => room.count > 0);
    localStorage.setItem("selectedRooms", JSON.stringify(selectedRooms));
    // Navigate to start reporting page
    navigate("/report/start");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      {/* Mobile container */}
      <div className="relative min-h-screen w-full min-w-[375px] max-w-[430px] bg-white shadow-2xl">
        {/* Main content wrapper */}
        <div className="flex min-h-screen flex-col px-6">
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

          {/* Title Section */}
          <div className="mb-6 text-center">
            <h1 className="text-[24px] font-semibold tracking-[-0.04em] text-slate-900 mb-2">
              What do you have in your home?
            </h1>
            <p className="text-[16px] text-slate-500 tracking-[-0.04em]">
              Select rooms
            </p>
          </div>

          {/* Room Selection Container */}
          <div className="flex-1">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="bg-slate-50 px-4 py-3 text-center">
                <span className="text-[14px] font-medium text-slate-500  tracking-[-0.04em]">
                  Choose all that apply
                </span>
              </div>

              {/* Room List */}
              <div className="divide-y divide-slate-100">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between px-4 py-4"
                  >
                    {/* Icon and Label */}
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{room.icon}</span>
                      <span className="text-[16px] text-slate-900">
                        {room.name}
                      </span>
                    </div>

                    {/* Counter */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateCount(room.id, -1)}
                        disabled={room.count === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label={`Decrease ${room.name} count`}
                      >
                        <Minus className="h-4 w-4 text-slate-600" />
                      </button>
                      <span className="w-6 text-center text-[16px] font-medium text-slate-900">
                        {room.count}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCount(room.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                        aria-label={`Increase ${room.name} count`}
                      >
                        <Plus className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with button */}
          <footer className="pb-10 pt-6">
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-full h-[56px] text-[16px] font-semibold bg-slate-900 hover:bg-slate-800"
            >
              Next
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
}
