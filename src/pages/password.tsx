import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isShaking, setIsShaking] = useState<{
    password: boolean;
    confirmPassword: boolean;
  }>({
    password: false,
    confirmPassword: false,
  });

  const validatePassword = (pwd: string) => {
    // At least 8 characters, mix of upper and lowercase, at least one number
    const hasMinLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    return hasMinLength && hasUppercase && hasLowercase && hasNumber;
  };

  const triggerShake = (field: "password" | "confirmPassword") => {
    setIsShaking((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setIsShaking((prev) => ({ ...prev, [field]: false }));
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { password?: string; confirmPassword?: string } = {};

    // Validate password
    if (!password.trim()) {
      newErrors.password = "Please enter a password";
      triggerShake("password");
    } else if (!validatePassword(password)) {
      newErrors.password = "Password doesn't meet requirements";
      triggerShake("password");
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      triggerShake("confirmPassword");
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      triggerShake("confirmPassword");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and proceed
    setErrors({});
    localStorage.setItem("userPassword", password); // In a real app, never store passwords like this!

    // Show success toast
    toast.success("Account created", {
      description: "Your account has been created successfully.",
    });

    // Navigate to property setup after a short delay
    setTimeout(() => navigate("/property/setup"), 1500);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
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
            Create your password
          </h1>

          {/* Form */}
          <form className="flex-1" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Password field */}
              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="text-[14px] font-medium text-slate-900 tracking-[-0.04em]"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`h-[52px] rounded-xl px-4 pr-12 text-[16px] placeholder:text-slate-400 transition-colors
                      ${
                        errors.password
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-slate-200"
                      }
                      ${isShaking.password ? "animate-shake" : ""}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[13px] text-red-500 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password field */}
              <div className="grid gap-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-[14px] font-medium text-slate-900 tracking-[-0.04em]"
                >
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`h-[52px] rounded-xl px-4 pr-12 text-[16px] placeholder:text-slate-400 transition-colors
                      ${
                        errors.confirmPassword
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-slate-200"
                      }
                      ${isShaking.confirmPassword ? "animate-shake" : ""}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[13px] text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Password requirements hint */}
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Use at least 8 characters, mix upper and lowercase letters and
                at least one number.
              </p>
            </div>
          </form>

          {/* Footer with button */}
          <footer className="pb-10 pt-6">
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-full h-[56px] text-[16px] font-semibold bg-slate-900 hover:bg-slate-800"
            >
              Create account
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
}
