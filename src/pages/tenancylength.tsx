import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TenancyLength() {
  const navigate = useNavigate();
  const [tenancyStartDate, setTenancyStartDate] = useState<Date | undefined>();
  const [moveInDate, setMoveInDate] = useState<Date | undefined>();
  const [lengthOfTenancy, setLengthOfTenancy] = useState("");
  const [syncDates, setSyncDates] = useState(false);
  const [isLengthOpen, setIsLengthOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isShaking, setIsShaking] = useState<Record<string, boolean>>({});

  const tenancyLengthOptions = [
    "6 months",
    "12 months",
    "18 months",
    "24 months",
    "Rolling / Periodic",
  ];

  const triggerShake = (field: string) => {
    setIsShaking((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setIsShaking((prev) => ({ ...prev, [field]: false }));
    }, 500);
  };

  const handleSyncChange = (checked: boolean) => {
    setSyncDates(checked);
    if (checked && tenancyStartDate) {
      setMoveInDate(tenancyStartDate);
    }
  };

  const handleTenancyStartChange = (date: Date | undefined) => {
    setTenancyStartDate(date);
    if (syncDates && date) {
      setMoveInDate(date);
    }
    if (errors.tenancyStartDate) {
      setErrors((prev) => ({ ...prev, tenancyStartDate: "" }));
    }
  };

  const handleMoveInDateChange = (date: Date | undefined) => {
    setMoveInDate(date);
    if (errors.moveInDate) {
      setErrors((prev) => ({ ...prev, moveInDate: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!tenancyStartDate) {
      newErrors.tenancyStartDate = "Please select a tenancy start date";
      triggerShake("tenancyStartDate");
    }

    if (!moveInDate) {
      newErrors.moveInDate = "Please select a move in date";
      triggerShake("moveInDate");
    }

    if (!lengthOfTenancy) {
      newErrors.lengthOfTenancy = "Please select length of tenancy";
      triggerShake("lengthOfTenancy");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and proceed
    setErrors({});
    localStorage.setItem(
      "tenancyDetails",
      JSON.stringify({
        tenancyStartDate: tenancyStartDate?.toISOString(),
        moveInDate: moveInDate?.toISOString(),
        lengthOfTenancy,
      })
    );
    // Navigate to next step
    navigate("/property/rooms");
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
          <div className="mb-8 text-center">
            <h1 className="text-[24px] font-semibold tracking-[-0.04em] text-slate-900 mb-2">
              Now, let's set up your property.
            </h1>
            <p className="text-[16px] text-slate-500 tracking-[-0.04em]">
              When is your tenancy start date?
            </p>
          </div>

          {/* Form */}
          <form className="flex-1" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              {/* Tenancy Start Date */}
              <div className="grid gap-2">
                <Label className="text-[14px] font-medium text-slate-900 tracking-[-0.04em]">
                  Tenancy start date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full h-[52px] rounded-xl px-4 text-[16px] text-left border bg-white flex items-center justify-between hover:border-slate-300 transition-colors",
                        errors.tenancyStartDate
                          ? "border-red-500"
                          : "border-slate-200",
                        isShaking.tenancyStartDate ? "animate-shake" : ""
                      )}
                    >
                      <span
                        className={
                          tenancyStartDate ? "text-slate-900" : "text-slate-400"
                        }
                      >
                        {tenancyStartDate
                          ? format(tenancyStartDate, "PPP")
                          : "Choose date"}
                      </span>
                      <CalendarIcon className="h-5 w-5 text-slate-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tenancyStartDate}
                      onSelect={handleTenancyStartChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.tenancyStartDate && (
                  <p className="text-[13px] text-red-500">
                    {errors.tenancyStartDate}
                  </p>
                )}
              </div>

              {/* Move In Date */}
              <div className="grid gap-2">
                <Label className="text-[14px] font-medium text-slate-900 tracking-[-0.04em]">
                  Move in date
                </Label>
                <Popover>
                  <PopoverTrigger asChild disabled={syncDates}>
                    <button
                      type="button"
                      disabled={syncDates}
                      className={cn(
                        "w-full h-[52px] rounded-xl px-4 text-[16px] text-left border bg-white flex items-center justify-between transition-colors",
                        syncDates
                          ? "bg-slate-50 cursor-not-allowed"
                          : "hover:border-slate-300",
                        errors.moveInDate
                          ? "border-red-500"
                          : "border-slate-200",
                        isShaking.moveInDate ? "animate-shake" : ""
                      )}
                    >
                      <span
                        className={
                          moveInDate ? "text-slate-900" : "text-slate-400"
                        }
                      >
                        {moveInDate ? format(moveInDate, "PPP") : "Choose date"}
                      </span>
                      <CalendarIcon className="h-5 w-5 text-slate-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={moveInDate}
                      onSelect={handleMoveInDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.moveInDate && (
                  <p className="text-[13px] text-red-500">
                    {errors.moveInDate}
                  </p>
                )}
              </div>

              {/* Sync Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncDates}
                  onChange={(e) => handleSyncChange(e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-slate-300 accent-slate-900 focus:ring-slate-500"
                />
                <span className="text-[14px] text-slate-600 leading-relaxed tracking-[-0.04em]">
                  My move in date is the same as the tenancy start date.
                </span>
              </label>

              {/* Length of Tenancy */}
              <div className="grid gap-2">
                <Label className="text-[14px] font-medium text-slate-900 tracking-[-0.04em]">
                  Length of tenancy
                </Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsLengthOpen(!isLengthOpen)}
                    className={cn(
                      "w-full h-[52px] rounded-xl px-4 text-[16px] text-left border bg-white flex items-center justify-between hover:border-slate-300 transition-colors",
                      errors.lengthOfTenancy
                        ? "border-red-500"
                        : "border-slate-200",
                      isShaking.lengthOfTenancy ? "animate-shake" : ""
                    )}
                  >
                    <span
                      className={
                        lengthOfTenancy ? "text-slate-900" : "text-slate-400"
                      }
                    >
                      {lengthOfTenancy || "Select"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-slate-400 transition-transform",
                        isLengthOpen ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  {isLengthOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {tenancyLengthOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setLengthOfTenancy(option);
                            setIsLengthOpen(false);
                            if (errors.lengthOfTenancy) {
                              setErrors((prev) => ({
                                ...prev,
                                lengthOfTenancy: "",
                              }));
                            }
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left text-[16px] hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl",
                            lengthOfTenancy === option
                              ? "bg-slate-50 text-slate-900 font-medium"
                              : "text-slate-700"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.lengthOfTenancy && (
                  <p className="text-[13px] text-red-500">
                    {errors.lengthOfTenancy}
                  </p>
                )}
              </div>
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
