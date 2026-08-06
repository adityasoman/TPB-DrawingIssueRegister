/* global document, HTMLImageElement */

import "./excel";
import { initUploadSection } from "./upload";
import { initIssueModeSection } from "./issueMode";
import { initStaticIcons } from "./icons";
import { initTemplateSection } from "./template";

function initBrandLogo(): void {
  const logo = document.getElementById("brand-logo") as HTMLImageElement | null;
  const fallback = document.getElementById("brand-logo-fallback");
  if (!logo || !fallback) {
    return;
  }

  logo.addEventListener("load", () => {
    logo.classList.remove("hidden");
    fallback.classList.add("hidden");
  });
  logo.addEventListener("error", () => {
    logo.classList.add("hidden");
    fallback.classList.remove("hidden");
  });
  // No file at this path yet (src/assets/branding/logo.png is empty until supplied) —
  // the error handler above keeps the "TP BENNETT" text fallback visible until it exists.
  logo.src = "assets/branding/logo.png";
}

document.addEventListener("DOMContentLoaded", () => {
  initBrandLogo();
  initStaticIcons();
  initUploadSection();
  initIssueModeSection();
  initTemplateSection();
});
