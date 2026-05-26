import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast bg-white text-[#2B1B17] border-2 border-[#FEB522]/30 shadow-2xl rounded-2xl p-4 font-sans",
          title: "text-[#2B1B17] font-black text-sm uppercase tracking-wide",
          description: "text-[#2B1B17]/85 font-medium text-xs leading-relaxed mt-1",
          actionButton: "bg-[#DF4C08] hover:bg-[#DF4C08]/90 text-white font-bold text-xs rounded-xl px-3 py-1.5 transition-all shadow-md",
          cancelButton: "bg-neutral-100 hover:bg-neutral-200 text-[#2B1B17] font-bold text-xs rounded-xl px-3 py-1.5 transition-all",
        }
      }}
      style={
        {
          "--normal-bg": "#FFFFFF",
          "--normal-text": "#2B1B17",
          "--normal-border": "rgba(254, 181, 34, 0.3)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
