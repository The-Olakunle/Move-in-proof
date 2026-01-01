import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";

export default function OnboardingName() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the input
    if (!fullName.trim()) {
      setError("Please enter your full name");
      setIsShaking(true);

      // Remove shake class after animation completes
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
      return;
    }

    // Clear error and navigate to next screen
    setError("");
    // Store the name (you might want to use context or state management)
    localStorage.setItem("userName", fullName.trim());
    navigate("/onboarding/email");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      {/* Mobile container - restricts to mobile viewport */}
      <div className="relative min-h-screen w-full min-w-[375px] max-w-[430px] bg-white shadow-2xl">
        {/* Main content wrapper */}
        <div className="flex min-h-screen flex-col px-6">
          {/* Header with back button */}
          <header className="pt-14 pb-10">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Go back"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-6 w-6 text-slate-900" />
            </button>
          </header>

          {/* Title */}
          <h1 className="text-[24px] font-semibold tracking-[-0.04em] text-slate-900 text-center mb-10">
            What's your full name?
          </h1>

          {/* Form */}
          <form className="flex-1" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label
                htmlFor="fullName"
                className="text-[14px] font-medium text-slate-900 tracking-[-0.04em]"
              >
                Full name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={handleInputChange}
                className={`h-[52px] rounded-xl px-4 text-[16px] placeholder:text-slate-400 transition-colors
                  ${
                    error
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-slate-200"
                  }
                  ${isShaking ? "animate-shake" : ""}
                `}
              />
              {error && (
                <p className="text-[13px] text-red-500 mt-1">{error}</p>
              )}
            </div>
          </form>

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
