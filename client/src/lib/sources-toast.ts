import { toast } from "sonner";

const SOURCES_TOAST_ID = "sources-references";

const SOURCES_DESCRIPTION =
  "Data compiled from: Northwest Harvest (2024-2025 Reports), University of Washington WAFOOD Wave 5 (2025), USDA ERS, Feeding America WA, and WSDA EFAP Reports.";

let sourcesToastOpen = false;

/** Show sources toast once; click again or X to dismiss. */
export function toggleSourcesToast() {
  if (sourcesToastOpen) {
    toast.dismiss(SOURCES_TOAST_ID);
    sourcesToastOpen = false;
    return;
  }

  sourcesToastOpen = true;
  toast("Data Sources & References", {
    id: SOURCES_TOAST_ID,
    description: SOURCES_DESCRIPTION,
    duration: 10000,
    closeButton: true,
    classNames: {
      description: "!text-[#2B1B17]",
      closeButton:
        "!absolute !right-3 !top-3 !left-auto !border-0 !bg-[#2B1B17]/10 !text-[#2B1B17] hover:!bg-[#2B1B17]/20 !rounded-full !w-7 !h-7",
    },
    onDismiss: () => {
      sourcesToastOpen = false;
    },
    onAutoClose: () => {
      sourcesToastOpen = false;
    },
  });
}
