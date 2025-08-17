import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import VSCodeLayout from "@/components/VSCodeLayout";
import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";

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
          <Route path="/" element={<VSCodeLayout />} />
          <Route path="*" element={<VSCodeLayout />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
