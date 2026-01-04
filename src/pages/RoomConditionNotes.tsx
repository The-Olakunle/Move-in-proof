import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import type { PanInfo } from "framer-motion";
import {
  getCurrentRoom,
  advanceToNextRoom,
  isLastRoom,
  getRoomPath,
} from "@/hooks/useRoomQueue";

interface PhotoComment {
  photo: string;
  comment: string;
}

export default function RoomConditionNotes() {
  const navigate = useNavigate();
  const { roomType, roomIndex } = useParams<{
    roomType: string;
    roomIndex: string;
  }>();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photoComments, setPhotoComments] = useState<PhotoComment[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Get current room info
  const currentRoom = getCurrentRoom();
  const roomName = currentRoom?.name || `${roomType} ${roomIndex}`;
  const storageKey = currentRoom?.storageKey || `${roomType}_${roomIndex}`;

  // Motion values for drag
  const x = useMotionValue(0);
  const rotateZ = useTransform(x, [-300, 0, 300], [-25, 2.77, 30]);
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);

  // Load photos from localStorage on mount
  useEffect(() => {
    const storedPhotos = localStorage.getItem(`${storageKey}_photos`);
    if (storedPhotos) {
      const photos: string[] = JSON.parse(storedPhotos);
      setPhotoComments(
        photos.map((photo) => ({
          photo,
          comment: "",
        }))
      );
    }
  }, [storageKey]);

  const handleCommentChange = (value: string) => {
    setPhotoComments((prev) =>
      prev.map((item, i) =>
        i === currentPhotoIndex ? { ...item, comment: value } : item
      )
    );
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const swipeCard = useCallback(
    (direction: "left" | "right") => {
      const exitX = direction === "left" ? -500 : 500;

      animate(x, exitX, {
        type: "spring",
        stiffness: 200,
        damping: 30,
        velocity: direction === "left" ? -1000 : 1000,
      }).then(() => {
        if (
          direction === "left" &&
          currentPhotoIndex < photoComments.length - 1
        ) {
          setCurrentPhotoIndex((prev) => prev + 1);
        } else if (direction === "right" && currentPhotoIndex > 0) {
          setCurrentPhotoIndex((prev) => prev - 1);
        }
        x.set(0);
        setIsDragging(false);
      });
    },
    [currentPhotoIndex, photoComments.length, x]
  );

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    const velocityThreshold = 500;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -threshold || velocity < -velocityThreshold) {
      if (currentPhotoIndex < photoComments.length - 1) {
        swipeCard("left");
      } else {
        animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
        setIsDragging(false);
      }
    } else if (offset > threshold || velocity > velocityThreshold) {
      if (currentPhotoIndex > 0) {
        swipeCard("right");
      } else {
        animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
        setIsDragging(false);
      }
    } else {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
      setIsDragging(false);
    }
  };

  const handleSaveAndContinue = () => {
    // Save the report for this room
    localStorage.setItem(`${storageKey}_report`, JSON.stringify(photoComments));

    // Check if there are more rooms
    if (isLastRoom()) {
      // Navigate to report complete page
      navigate("/report/complete");
    } else {
      // Advance to next room and navigate to its photo capture
      const nextRoom = advanceToNextRoom();
      if (nextRoom) {
        navigate(getRoomPath(nextRoom));
      }
    }
  };

  if (photoComments.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="relative min-h-screen w-full min-w-[375px] max-w-[430px] bg-white shadow-2xl flex items-center justify-center">
          <p className="text-slate-500">No photos to review</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      {/* Mobile container */}
      <div className="relative min-h-screen w-full min-w-[375px] max-w-[430px] bg-white shadow-2xl overflow-hidden">
        {/* Main content wrapper */}
        <div className="flex min-h-screen flex-col px-5">
          {/* Header */}
          <header className="pt-14 pb-4">
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
          <h1 className="text-[20px] font-bold tracking-[-0.04em] text-slate-950 text-center mb-3">
            {roomName} - Add condition notes
          </h1>

          {/* Instruction Text */}
          <p className="text-[14px] text-slate-500 text-center leading-relaxed mb-6 tracking-[-0.04em] px-4">
            Use comments to note the condition or any existing issues. You can
            swipe through each photo and add a comment where needed.
          </p>

          {/* Photo Cards Stack */}
          <div className="relative mb-4 flex justify-center items-center h-[460px]">
            {/* Stacked Cards Container */}
            <div className="relative w-[320px] h-[420px]">
              {/* Back card - Photo 3 (furthest back, 4.55 degrees) */}
              {photoComments.length > currentPhotoIndex + 2 && (
                <motion.div
                  className="absolute w-full h-full rounded-[32px] overflow-hidden"
                  style={{
                    zIndex: 1,
                    transformOrigin: "center center",
                  }}
                  animate={{ rotate: 4.55, opacity: 0.85 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={photoComments[currentPhotoIndex + 2]?.photo}
                    alt={`Photo ${currentPhotoIndex + 3}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </motion.div>
              )}

              {/* Middle card - Photo 2 (-7.95 degrees) */}
              {photoComments.length > currentPhotoIndex + 1 && (
                <motion.div
                  className="absolute w-full h-full rounded-[32px] overflow-hidden"
                  style={{
                    zIndex: 2,
                    transformOrigin: "center center",
                  }}
                  animate={{
                    rotate: -7.95,
                    opacity: 0.92,
                    scale: isDragging ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={photoComments[currentPhotoIndex + 1]?.photo}
                    alt={`Photo ${currentPhotoIndex + 2}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </motion.div>
              )}

              {/* Main Photo Card - Draggable with Tinder animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhotoIndex}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing rounded-[32px] overflow-hidden"
                  style={{
                    x,
                    rotate: rotateZ,
                    scale,
                    zIndex: 10,
                    transformOrigin: "center bottom",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                  }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  whileTap={{ cursor: "grabbing" }}
                >
                  <img
                    src={photoComments[currentPhotoIndex]?.photo}
                    alt={`Photo ${currentPhotoIndex + 1}`}
                    className="w-full h-full object-cover pointer-events-none select-none"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Photo Counter */}
          <p className="text-[14px] text-slate-600 text-center mb-4 tracking-[-0.04em]">
            Photo {currentPhotoIndex + 1} of {photoComments.length}
          </p>

          {/* Comment Input */}
          <div className="flex-1 mb-4">
            <textarea
              value={photoComments[currentPhotoIndex]?.comment || ""}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder="Add comment to note the condition shown in the image for example, small scuff on wall near window."
              className="w-full h-[120px] bg-slate-50 rounded-2xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all tracking-[-0.04em]"
            />
          </div>

          {/* Save Button */}
          <footer className="pb-10 pt-2">
            <Button
              type="button"
              onClick={handleSaveAndContinue}
              className="w-full rounded-full h-[56px] text-[16px] font-semibold bg-slate-900 hover:bg-slate-800"
            >
              {isLastRoom() ? "Complete report" : "Save and continue"}
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
}
