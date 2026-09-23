import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import AnimatedBackground from "./AnimatedBackground.jsx";

export default function SiteLayout() {
  return (
    <div className="relative isolate min-h-screen">
      <AnimatedBackground />
      <Header />
      <main className="w-full pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
