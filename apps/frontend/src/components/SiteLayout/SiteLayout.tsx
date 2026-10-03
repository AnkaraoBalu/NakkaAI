import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import AmbientBackground from "../AmbientBackground";
import AuthModalProvider from "../../context/AuthModalProvider";
import { styles } from "./SiteLayout.style";

export default function SiteLayout() {
  return (
    <AuthModalProvider>
      <div className={styles.root}>
        <AmbientBackground />
        <Header />
        <main className={styles.main}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthModalProvider>
  );
}
