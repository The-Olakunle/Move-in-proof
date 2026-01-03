import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { PanInfo } from "framer-motion";

interface PhotoComment {
  photo: string;
  comment: string;
}

export default function PhotoConditionNotes() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoComments, setPhotoComments] = useState<PhotoComment[]>([]);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );

  // Motion values for drag
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.5, 1, 1, 1, 0.5]
  );

  // Load photos from localStorage on mount
  useEffect(() => {
    const storedPhotos = localStorage.getItem("livingRoomPhotos");
    if (storedPhotos) {
      const photos: string[] = JSON.parse(storedPhotos);
      setPhotoComments(
        photos.map((photo) => ({
          photo,
          comment: "",
        }))
      );
    }
  }, []);

  const handleCommentChange = (value: string) => {
    setPhotoComments((prev) =>
      prev.map((item, i) =>
        i === currentIndex ? { ...item, comment: value } : item
      )
    );
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset < -threshold || velocity < -500) {
      // Swiped left - go to next
      if (currentIndex < photoComments.length - 1) {
        setExitDirection("left");
        animate(x, -400, { duration: 0.3 }).then(() => {
          setCurrentIndex((prev) => prev + 1);
          setExitDirection(null);
          x.set(0);
        });
      } else {
        // Bounce back
        animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
      }
    } else if (offset > threshold || velocity > 500) {
      // Swiped right - go to previous
      if (currentIndex > 0) {
        setExitDirection("right");
        animate(x, 400, { duration: 0.3 }).then(() => {
          setCurrentIndex((prev) => prev - 1);
          setExitDirection(null);
          x.set(0);
        });
      } else {
        // Bounce back
        animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
      }
    } else {
      // Return to center
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  const handleSaveReport = () => {
    localStorage.setItem("livingRoomReport", JSON.stringify(photoComments));
    navigate("/report/bedroom");
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
            Add condition notes
          </h1>

          {/* Instruction Text */}
          <p className="text-[14px] text-slate-500 text-center leading-relaxed mb-6 tracking-[-0.04em] px-4">
            Use comments to note the condition or any existing issues. You can
            swipe through each photo and add a comment where needed.
          </p>

          {/* Photo Cards Stack */}
          <div className="relative mb-4 flex justify-center h-[440px]">
            {/* Stacked Cards Container */}
            <div className="relative w-[320px] h-[420px]">
              {/* Back card 2 (Light Blue) - furthest back */}
              {photoComments.length > currentIndex + 2 && (
                <motion.div
                  className="absolute rounded-[32px]"
                  style={{
                    background: "#DAF2FF",
                    top: "20px",
                    left: "6px",
                    right: "6px",
                    bottom: "-12px",
                    zIndex: 1,
                  }}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0.8 }}
                />
              )}

              {/* Back card 1 (Mint Green) - middle */}
              {photoComments.length > currentIndex + 1 && (
                <motion.div
                  className="absolute rounded-[32px]"
                  style={{
                    background: "#D1FAE5",
                    top: "10px",
                    left: "3px",
                    right: "3px",
                    bottom: "-6px",
                    zIndex: 2,
                  }}
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0.9 }}
                />
              )}

              {/* Main Photo Card - Draggable */}
              <motion.div
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                style={{
                  x,
                  rotate,
                  opacity: exitDirection ? opacity : 1,
                  zIndex: 10,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                whileTap={{ cursor: "grabbing" }}
              >
                <div
                  className="w-full h-full rounded-[32px] p-[4px]"
                  style={{
                    background:
                      "linear-gradient(135deg, #FEF9C3 0%, #D1FAE5 50%, #DAF2FF 100%)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <div className="w-full h-full rounded-[28px] overflow-hidden bg-slate-100">
                    <img
                      src={photoComments[currentIndex]?.photo}
                      alt={`Photo ${currentIndex + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Photo Counter */}
          <p className="text-[14px] text-slate-600 text-center mb-4 tracking-[-0.04em]">
            Photo {currentIndex + 1} of {photoComments.length}
          </p>

          {/* Comment Input */}
          <div className="flex-1 mb-4">
            <textarea
              value={photoComments[currentIndex]?.comment || ""}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder="Add comment to note the condition shown in the image for example, small scuff on wall near window."
              className="w-full h-[120px] bg-slate-50 rounded-2xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all tracking-[-0.04em]"
            />
          </div>

          {/* Save Button */}
          <footer className="pb-10 pt-2">
            <Button
              type="button"
              onClick={handleSaveReport}
              className="w-full rounded-full h-[56px] text-[16px] font-semibold bg-slate-900 hover:bg-slate-800"
            >
              Save report and continue
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
}
