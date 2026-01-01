import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronDown } from "lucide-react";

export default function PropertySetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    addressLine1: "",
    city: "",
    country: "United Kingdom",
    postcode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isShaking, setIsShaking] = useState<Record<string, boolean>>({});
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const countries = [
    "United Kingdom",
    "United States",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Ireland",
    "Netherlands",
  ];

  const triggerShake = (field: string) => {
    setIsShaking((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setIsShaking((prev) => ({ ...prev, [field]: false }));
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Please enter your address";
      triggerShake("addressLine1");
    }

    if (!formData.city.trim()) {
      newErrors.city = "Please enter your city";
      triggerShake("city");
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = "Please enter your postcode";
      triggerShake("postcode");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and proceed
    setErrors({});
    localStorage.setItem("propertyAddress", JSON.stringify(formData));
    // Navigate to tenancy length page
    navigate("/property/tenancy");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
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
              What's your address?
            </p>
          </div>

          {/* Form */}
          <form className="flex-1" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              {/* Address Line 1 */}
              <div className="grid gap-2">
                <Label
                  htmlFor="addressLine1"
                  className="text-[14px] font-medium text-slate-900 tracking-[-0.04em]"
                >
                  Address line 1
                </Label>
                <Input
                  id="addressLine1"
                  type="text"
                  placeholder="Enter the first line of your address"
                  value={formData.addressLine1}
                  onChange={(e) =>
                    handleInputChange("addressLine1", e.target.value)
                  }
                  className={`h-[52px] rounded-xl px-4 text-[16px] placeholder:text-slate-400 transition-colors
                    ${
                      errors.addressLine1
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-slate-200"
                    }
                    ${isShaking.addressLine1 ? "animate-shake" : ""}
                  `}
                />
                {errors.addressLine1 && (
                  <p className="text-[13px] text-red-500">
                    {errors.addressLine1}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="grid gap-2">
                <Label
                  htmlFor="city"
                  className="text-[14px] font-medium text-slate-900 tracking-[-0.04em]"
                >
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={`h-[52px] rounded-xl px-4 text-[16px] placeholder:text-slate-400 transition-colors
                    ${
                      errors.city
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-slate-200"
                    }
                    ${isShaking.city ? "animate-shake" : ""}
                  `}
                />
                {errors.city && (
                  <p className="text-[13px] text-red-500">{errors.city}</p>
                )}
              </div>

              {/* Country Dropdown */}
              <div className="grid gap-2">
                <Label
                  htmlFor="country"
                  className="text-[14px] font-medium text-slate-900 tracking-[-0.04em]"
                >
                  Country
                </Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="w-full h-[52px] rounded-xl px-4 text-[16px] text-left border border-slate-200 bg-white flex items-center justify-between hover:border-slate-300 transition-colors"
                  >
                    <span className="text-slate-900">{formData.country}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${
                        isCountryOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isCountryOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {countries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => {
                            handleInputChange("country", country);
                            setIsCountryOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-[16px] hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl
                            ${
                              formData.country === country
                                ? "bg-slate-50 text-slate-900 font-medium"
                                : "text-slate-700"
                            }
                          `}
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Postcode */}
              <div className="grid gap-2">
                <Label
                  htmlFor="postcode"
                  className="text-[14px] font-medium text-slate-900 tracking-[-0.04em]"
                >
                  Postcode
                </Label>
                <Input
                  id="postcode"
                  type="text"
                  placeholder="Enter your postcode"
                  value={formData.postcode}
                  onChange={(e) =>
                    handleInputChange("postcode", e.target.value)
                  }
                  className={`h-[52px] rounded-xl px-4 text-[16px] placeholder:text-slate-400 transition-colors
                    ${
                      errors.postcode
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-slate-200"
                    }
                    ${isShaking.postcode ? "animate-shake" : ""}
                  `}
                />
                {errors.postcode && (
                  <p className="text-[13px] text-red-500">{errors.postcode}</p>
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
