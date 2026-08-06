/* global document, console, Excel, Office, HTMLElement */

import templateDataUrl from "../assets/templates/Template-Registry.xlsx";

const TEMPLATE_SHEET_NAME = "DIR_Template";

function getTemplateBase64(): string {
  const commaIndex = templateDataUrl.indexOf(",");
  return commaIndex >= 0 ? templateDataUrl.slice(commaIndex + 1) : templateDataUrl;
}

async function templateSheetExists(): Promise<boolean> {
  return Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getItemOrNullObject(TEMPLATE_SHEET_NAME);
    sheet.load("isNullObject");
    await context.sync();
    return !sheet.isNullObject;
  });
}

function setStatus(statusEl: HTMLElement, message: string, isError: boolean): void {
  statusEl.textContent = message;
  statusEl.className = isError ? "text-xs text-red-400" : "text-xs text-ink-muted";
  statusEl.classList.remove("hidden");
}

async function insertTemplate(statusEl: HTMLElement): Promise<void> {
  try {
    await Excel.run(async (context) => {
      context.workbook.insertWorksheetsFromBase64(getTemplateBase64(), {
        positionType: Excel.WorksheetPositionType.end,
      });
      await context.sync();
    });
  } catch (error) {
    console.error(error);
    setStatus(statusEl, "Couldn't insert the template. See the console for details.", true);
  }
}

export function initTemplateSection(): void {
  const loadBtn = document.getElementById("load-template-btn");
  const confirmBox = document.getElementById("template-confirm");
  const confirmYes = document.getElementById("template-confirm-yes");
  const confirmNo = document.getElementById("template-confirm-no");
  const statusEl = document.getElementById("template-status");

  if (!loadBtn || !confirmBox || !confirmYes || !confirmNo || !statusEl) {
    return;
  }

  loadBtn.addEventListener("click", async () => {
    statusEl.classList.add("hidden");

    if (!Office.context.requirements.isSetSupported("ExcelApi", "1.13")) {
      setStatus(
        statusEl,
        "This version of Excel doesn't support inserting the template automatically. Please update Excel.",
        true
      );
      return;
    }

    const exists = await templateSheetExists();
    if (exists) {
      confirmBox.classList.remove("hidden");
      confirmBox.classList.add("flex");
    } else {
      await insertTemplate(statusEl);
    }
  });

  confirmYes.addEventListener("click", async () => {
    confirmBox.classList.add("hidden");
    confirmBox.classList.remove("flex");
    await insertTemplate(statusEl);
  });

  confirmNo.addEventListener("click", () => {
    confirmBox.classList.add("hidden");
    confirmBox.classList.remove("flex");
  });
}
