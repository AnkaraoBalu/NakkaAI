import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import EditorDemo from "./components/EditorDemo";
import PricingSection from "./components/PricingSection";

export default function Home() {
  // The hero's "Try prompting" pills fill the demo agent's input.
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // /product and /pricing are the same page; /pricing scrolls to its section.
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === "/pricing") {
      document
        .getElementById("pricing")
        ?.scrollIntoView({ behavior: "smooth" });
    } else if (pathname === "/product") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  function applyPrompt(text: string) {
    setDraft(text);
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col w-full">
      <HeroSection onPrompt={applyPrompt} />
      <EditorDemo draft={draft} onDraftChange={setDraft} inputRef={inputRef} />
      <PricingSection />
    </div>
  );
}
