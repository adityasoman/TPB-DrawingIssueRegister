import { createIcons, FilePlus, SquarePen, Trash2, UploadCloud } from "lucide";

export function initStaticIcons(): void {
  createIcons({ icons: { UploadCloud, Trash2, SquarePen, FilePlus } });
}
