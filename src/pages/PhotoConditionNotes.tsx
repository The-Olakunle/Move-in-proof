import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PhotoComment {
  photo: string;
  comment: string;
}

export default function PhotoConditionNotes() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoComments, setPhotoComments] = useState<PhotoComment[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const animateToIndex = (newIndex: number) => {
    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setSwipeOffset(0);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isAnimating || !touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);

    const diff = currentTouch - touchStart;
    const maxOffset = 100;
    const limitedOffset = Math.max(-maxOffset, Math.min(maxOffset, diff));
    setSwipeOffset(limitedOffset);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isAnimating) {
      setSwipeOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (
      distance > minSwipeDistance &&
      currentIndex < photoComments.length - 1
    ) {
      animateToIndex(currentIndex + 1);
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      animateToIndex(currentIndex - 1);
    } else {
      setSwipeOffset(0);
    }

    setTouchStart(null);
    setTouchEnd(null);
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
      <div className="relative min-h-screen w-full min-w-[375px] max-w-[430px] bg-white shadow-2xl">
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
          <div
            className="relative mb-4 flex justify-center h-[420px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Stacked Cards Container */}
            <div className="relative w-[320px] h-[400px]">
              {/* Back card 2 (Light Blue) - shows if there are 2+ more photos */}
              {photoComments.length > currentIndex + 2 && (
                <div
                  className="absolute rounded-[24px] transition-all duration-300"
                  style={{
                    background: "#DAF2FF",
                    top: "16px",
                    left: "-8px",
                    right: "-8px",
                    bottom: "-16px",
                    zIndex: 1,
                  }}
                />
              )}

              {/* Back card 1 (Light Green) - shows if there is 1+ more photo */}
              {photoComments.length > currentIndex + 1 && (
                <div
                  className="absolute rounded-[24px] transition-all duration-300"
                  style={{
                    background: "#D1FAE5",
                    top: "8px",
                    left: "-4px",
                    right: "-4px",
                    bottom: "-8px",
                    zIndex: 2,
                  }}
                />
              )}

              {/* Main Photo Card with Gradient Border */}
              <div
                className="absolute inset-0 transition-all duration-300 ease-out"
                style={{
                  transform: `translateX(${swipeOffset}px)`,
                  zIndex: 10,
                }}
              >
                <div
                  className="w-full h-full rounded-[24px] p-[4px]"
                  style={{
                    background:
                      "linear-gradient(135deg, #FEF9C3 0%, #D1FAE5 50%, #DAF2FF 100%)",
                  }}
                >
                  <div className="w-full h-full rounded-[20px] overflow-hidden bg-slate-100">
                    <img
                      src={photoComments[currentIndex]?.photo}
                      alt={`Photo ${currentIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
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
