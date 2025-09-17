import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import VSCodeLayout from "@/components/VSCodeLayout";
import { useUIStore } from "@/store/uiStore";
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  const { state: uiState } = useUIStore();
  
  // Apply theme class to document
  useEffect(() => {
    if (uiState.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [uiState.theme]);
  
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <VSCodeLayout />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/sign-in"
				element={
					<div className="min-h-screen flex items-center justify-center">
						<SignIn routing="path" path="/sign-in" />
					</div>
				}
          />
          <Route
            path="/sign-up"
				element={
					<div className="min-h-screen flex items-center justify-center">
						<SignUp routing="path" path="/sign-up" />
					</div>
				}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
