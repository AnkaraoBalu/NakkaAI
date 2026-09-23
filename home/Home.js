import { createElement, useState } from "react";
import HeroSection from "./components/HeroSection.jsx";
import EditorDemo from "./components/EditorDemo.jsx";
import ProviderStrip from "./components/ProviderStrip.jsx";
import FeaturesSection from "./components/FeaturesSection.jsx";
import HowItWorksSection from "./components/HowItWorksSection.jsx";
import ProvidersSection from "./components/ProvidersSection.jsx";
import TerminalDemo from "./components/TerminalDemo.jsx";
import WhyNakkaSection from "./components/WhyNakkaSection.jsx";
import FaqSection from "./components/FaqSection.jsx";
import InstallSection from "./components/InstallSection.jsx";

export default function Home() {
  const [selectedProvider, setSelectedProvider] = useState("anthropic");
  return createElement(
    "div",
    {
      className:
        "flex flex-col w-full text-on-surface selection:bg-primary-container/20 selection:text-primary",
    },
    createElement(HeroSection),
    createElement(EditorDemo),
    createElement(ProviderStrip, {
      selectedProvider,
      onSelectProvider: setSelectedProvider,
    }),
    createElement(FeaturesSection),
    createElement(HowItWorksSection),
    createElement(ProvidersSection, { selectedProvider }),
    createElement(TerminalDemo),
    createElement(WhyNakkaSection),
    createElement(FaqSection),
    createElement(InstallSection),
  );
}
