import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import OnboardingName from "@/pages/OnboardingName";
import OnboardingEmail from "@/pages/OnboardingEmail";
import OnboardingPassword from "@/pages/password";
import PropertySetup from "@/pages/propertysetup";
import TenancyLength from "@/pages/tenancylength";
import RoomSelection from "@/pages/RoomSelection";
import StartReport from "@/pages/startReport";
import LivingRoomPhotos from "@/pages/LivingRoomPhotos";
import PhotoConditionNotes from "@/pages/PhotoConditionNotes";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Redirect root to first onboarding screen */}
        <Route path="/" element={<Navigate to="/onboarding/name" replace />} />

        {/* Onboarding flow */}
        <Route path="/onboarding/name" element={<OnboardingName />} />
        <Route path="/onboarding/email" element={<OnboardingEmail />} />
        <Route path="/onboarding/password" element={<OnboardingPassword />} />

        {/* Property setup */}
        <Route path="/property/setup" element={<PropertySetup />} />
        <Route path="/property/tenancy" element={<TenancyLength />} />
        <Route path="/property/rooms" element={<RoomSelection />} />

        {/* Reporting */}
        <Route path="/report/start" element={<StartReport />} />
        <Route path="/report/living-room" element={<LivingRoomPhotos />} />
        <Route
          path="/report/living-room/notes"
          element={<PhotoConditionNotes />}
        />
      </Routes>
    </Router>
  );
}

export default App;
