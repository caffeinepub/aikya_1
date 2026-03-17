import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("aikya-dark-mode");
    return (
      saved === "true" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("aikya-dark-mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("aikya-dark-mode", "false");
    }
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
      data-ocid="darkmode.toggle"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}
