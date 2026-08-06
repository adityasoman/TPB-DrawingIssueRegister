/* global document, console, HTMLInputElement */

export type IssueMode = "single" | "multiple";

export function getIssueMode(): IssueMode {
  const checked = document.querySelector<HTMLInputElement>('input[name="issue-mode"]:checked');
  return (checked?.value as IssueMode) ?? "single";
}

export function initIssueModeSection(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="issue-mode"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      console.log(`Issue mode set to: ${getIssueMode()}`);
    });
  });
}
