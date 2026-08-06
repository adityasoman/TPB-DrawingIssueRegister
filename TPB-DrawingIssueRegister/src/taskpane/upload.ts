/* global document, DragEvent, KeyboardEvent, File, FileList, HTMLElement, HTMLInputElement, HTMLUListElement */

import { createElement, FileSpreadsheet, X } from "lucide";

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv"];

let acceptedFiles: File[] = [];

function hasAcceptedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function renderFileList(listEl: HTMLUListElement, clearAllBtn: HTMLElement): void {
  listEl.innerHTML = "";

  acceptedFiles.forEach((file, index) => {
    const item = document.createElement("li");
    item.className =
      "flex flex-row items-center justify-between gap-2 bg-surface border border-line rounded px-3 py-1.5 text-sm text-ink";

    const nameWrap = document.createElement("span");
    nameWrap.className = "flex flex-row items-center gap-2 min-w-0";
    nameWrap.appendChild(
      createElement(FileSpreadsheet, { class: "h-4 w-4 text-ink-muted shrink-0" })
    );

    const name = document.createElement("span");
    name.textContent = file.name;
    name.className = "truncate";
    nameWrap.appendChild(name);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.setAttribute("aria-label", `Remove ${file.name}`);
    removeBtn.className =
      "text-ink-muted hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent rounded shrink-0";
    removeBtn.appendChild(createElement(X, { class: "h-4 w-4" }));
    removeBtn.addEventListener("click", () => {
      acceptedFiles.splice(index, 1);
      renderFileList(listEl, clearAllBtn);
    });

    item.appendChild(nameWrap);
    item.appendChild(removeBtn);
    listEl.appendChild(item);
  });

  clearAllBtn.classList.toggle("hidden", acceptedFiles.length === 0);
}

function showError(errorEl: HTMLElement, message: string): void {
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

function clearError(errorEl: HTMLElement): void {
  errorEl.textContent = "";
  errorEl.classList.add("hidden");
}

function handleFiles(
  files: FileList | null,
  listEl: HTMLUListElement,
  errorEl: HTMLElement,
  clearAllBtn: HTMLElement
): void {
  if (!files || files.length === 0) {
    return;
  }

  const rejected: string[] = [];
  Array.from(files).forEach((file) => {
    if (hasAcceptedExtension(file.name)) {
      acceptedFiles.push(file);
    } else {
      rejected.push(file.name);
    }
  });

  if (rejected.length > 0) {
    showError(
      errorEl,
      `Unsupported file type, not added: ${rejected.join(", ")}. Only .xlsx, .xls, and .csv files are accepted.`
    );
  } else {
    clearError(errorEl);
  }

  renderFileList(listEl, clearAllBtn);
}

export function initUploadSection(): void {
  const dropzone = document.getElementById("upload-dropzone");
  const input = document.getElementById("upload-input") as HTMLInputElement | null;
  const listEl = document.getElementById("upload-file-list") as HTMLUListElement | null;
  const errorEl = document.getElementById("upload-error");
  const clearAllBtn = document.getElementById("upload-clear-all");

  if (!dropzone || !input || !listEl || !errorEl || !clearAllBtn) {
    return;
  }

  // input.click() bubbles a synthetic click back up to dropzone; ignore it
  // here so this handler doesn't re-trigger itself.
  dropzone.addEventListener("click", (event) => {
    if (event.target === input) {
      return;
    }
    input.click();
  });

  dropzone.addEventListener("keydown", (event) => {
    const key = (event as KeyboardEvent).key;
    if (key === "Enter" || key === " ") {
      event.preventDefault();
      input.click();
    }
  });

  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("border-accent");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("border-accent");
  });

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("border-accent");
    handleFiles((event as DragEvent).dataTransfer?.files ?? null, listEl, errorEl, clearAllBtn);
  });

  input.addEventListener("change", () => {
    handleFiles(input.files, listEl, errorEl, clearAllBtn);
    input.value = "";
  });

  clearAllBtn.addEventListener("click", () => {
    acceptedFiles = [];
    clearError(errorEl);
    renderFileList(listEl, clearAllBtn);
  });
}
