import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./firebase";
import App from "./App.tsx";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { DataDeletionPage } from "./pages/DataDeletionPage";
import { LinkGeneratorPage } from "./pages/LinkGeneratorPage";
import "./index.css";

function RootRouter() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === "undefined") return "/";
    return window.location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  });

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname.replace(/\/+$/, "").toLowerCase() || "/");
    };

    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  if (currentPath === "/generator" || currentPath === "/admin/generator") {
    return <LinkGeneratorPage />;
  }

  if (currentPath === "/privacy-policy" || currentPath === "/chinh-sach-quyen-rieng-tu") {
    return <PrivacyPolicyPage />;
  }

  if (currentPath === "/data-deletion" || currentPath === "/xoa-du-lieu") {
    return <DataDeletionPage />;
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(<RootRouter />);

