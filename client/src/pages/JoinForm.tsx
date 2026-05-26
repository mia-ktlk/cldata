import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Send, Sparkles, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleSourcesToast } from "@/lib/sources-toast";
import { toast } from "sonner";
import { OFFICIAL_LOGO_URL } from "@shared/const";

export default function JoinForm() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    interestLevel: "high",
    bakingExperience: "none",
    receiveNewsletter: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields (First Name, Last Name, and Email).");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("https://formspree.io/f/meedrpkp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          interestLevel: formData.interestLevel,
          bakingExperience: formData.bakingExperience,
          message: formData.message,
          receiveNewsletter: formData.receiveNewsletter ? "Yes" : "No"
        })
      });

      if (response.ok) {
        toast.success("Thank you for your interest!", {
          description: "We've received your details and will reach out shortly to get you baking!",
          duration: 5000,
        });
        // Redirect back to presentation
        setTimeout(() => setLocation("/"), 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to submit form. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FFFBE7] text-[#2B1B17] flex flex-col relative font-sans">
      
      {/* Dynamic Background Graphics */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#FEB522]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-94 bg-[#DF4C08]/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER — compact on mobile */}
      <header className="shrink-0 relative z-10 flex items-center justify-between gap-2 border-b border-[#2B1B17]/8 bg-[#FFFBE7]/90 px-3 py-1.5 md:px-6 md:py-2.5">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setLocation("/")}
          className="h-7 shrink-0 px-2 text-[11px] md:text-sm text-[#2B1B17] hover:bg-[#2B1B17]/10 font-bold flex items-center gap-0.5 rounded-full"
        >
          <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Back
        </Button>
        <div className="flex min-w-0 items-center justify-center gap-1.5">
          <img
            src={OFFICIAL_LOGO_URL}
            alt="Community Loaves"
            className="h-5 w-5 shrink-0 object-contain md:h-7 md:w-7"
          />
          <span className="hidden font-serif text-xs font-bold text-[#DF4C08] sm:inline md:text-sm">
            Community Loaves
          </span>
        </div>
        <div className="w-[52px] shrink-0 md:w-[60px]" aria-hidden />
      </header>

      {/* FORM BODY */}
      <main className="relative z-10 flex-1 px-3 py-3 md:flex md:items-center md:justify-center md:px-[15vw] md:py-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-2xl rounded-2xl border-2 border-[#FEB522] bg-white p-4 shadow-xl md:w-[70vw] md:max-w-[70vw] md:rounded-3xl md:p-6 md:shadow-2xl"
        >
          <div className="mb-3 flex flex-col items-center gap-1 text-center md:mb-5 md:gap-2">
            <div className="hidden bg-[#DF4C08]/10 p-1.5 rounded-full text-[#DF4C08] sm:block">
              <Sparkles className="h-4 w-4 animate-pulse md:h-5 md:w-5" />
            </div>
            <h1 className="font-serif text-base font-black leading-tight tracking-tight text-[#DF4C08] sm:text-lg md:text-2xl">
              Rise to the Occasion!
            </h1>
            <p className="max-w-md text-[11px] font-medium leading-snug opacity-80 sm:text-xs md:text-sm">
              Fill out this form to learn more about how you can volunteer, drop off bread, and nurture your local Washington community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-3">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {/* First Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-wide text-[#2B1B17]/80 sm:text-xs">
                  First Name *
                </label>
                <input 
                  type="text" 
                  name="firstName"
                  required
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full min-h-10 rounded-lg border-2 border-[#FEB522]/30 bg-[#FFFBE7]/20 px-3 py-2 text-base font-medium transition-all focus:border-[#DF4C08] focus:outline-none sm:text-sm"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-wide text-[#2B1B17]/80 sm:text-xs">
                  Last Name *
                </label>
                <input 
                  type="text" 
                  name="lastName"
                  required
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full min-h-10 rounded-lg border-2 border-[#FEB522]/30 bg-[#FFFBE7]/20 px-3 py-2 text-base font-medium transition-all focus:border-[#DF4C08] focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-wide text-[#2B1B17]/80 sm:text-xs">
                Email Address *
              </label>
              <input 
                type="email" 
                name="email"
                required
                placeholder="jane.doe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full min-h-10 rounded-lg border-2 border-[#FEB522]/30 bg-[#FFFBE7]/20 px-3 py-2 text-base font-medium transition-all focus:border-[#DF4C08] focus:outline-none sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {/* Interest Level */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-wide text-[#2B1B17]/80 sm:text-xs">
                  Interest Level (Optional)
                </label>
                <select 
                  name="interestLevel"
                  value={formData.interestLevel}
                  onChange={(e) => setFormData({ ...formData, interestLevel: e.target.value })}
                  className="w-full min-h-10 rounded-lg border-2 border-[#FEB522]/30 bg-white px-3 py-2 text-base font-medium transition-all appearance-none focus:border-[#DF4C08] focus:outline-none sm:text-sm"
                >
                  <option value="high">🔥 I'm ready to start baking!</option>
                  <option value="medium">✨ I'd like more information first</option>
                  <option value="low">🌱 Just exploring options</option>
                </select>
              </div>

              {/* Baking Experience */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-wide text-[#2B1B17]/80 sm:text-xs">
                  Baking Experience (Optional)
                </label>
                <select 
                  name="bakingExperience"
                  value={formData.bakingExperience}
                  onChange={(e) => setFormData({ ...formData, bakingExperience: e.target.value })}
                  className="w-full min-h-10 rounded-lg border-2 border-[#FEB522]/30 bg-white px-3 py-2 text-base font-medium transition-all appearance-none focus:border-[#DF4C08] focus:outline-none sm:text-sm"
                >
                  <option value="none">🥚 None (Ready to learn!)</option>
                  <option value="beginner">🍞 Beginner (Some bread/cookies)</option>
                  <option value="intermediate">🥐 Intermediate (Regular baker)</option>
                  <option value="advanced">🥖 Advanced (Sourdough/Pastry master)</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-wide text-[#2B1B17]/80 sm:text-xs">
                Your Message (Optional)
              </label>
              <textarea
                name="message"
                rows={2}
                placeholder="Tell us why you'd like to join or ask any questions you have!"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full resize-none rounded-lg border-2 border-[#FEB522]/30 bg-[#FFFBE7]/20 px-3 py-2 text-base font-medium transition-all focus:border-[#DF4C08] focus:outline-none sm:text-sm"
              />
            </div>

            {/* Newsletter Toggle */}
            <label className="flex cursor-pointer items-start gap-2.5 sm:items-center sm:gap-3">
              <input
                type="checkbox"
                name="receiveNewsletter"
                checked={formData.receiveNewsletter}
                onChange={(e) => setFormData({ ...formData, receiveNewsletter: e.target.checked })}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#FEB522]/30 text-[#DF4C08] accent-[#DF4C08] focus:ring-[#DF4C08] sm:mt-0"
              />
              <span className="text-[11px] font-bold leading-snug opacity-80 sm:text-xs">
                Send me updates on local baking schedules and hub events
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#DF4C08] py-3 text-sm font-black text-white shadow-lg transition-all hover:bg-[#DF4C08]/90 hover:scale-[1.01] active:scale-[0.99] md:rounded-xl md:py-2.5"
            >
              {isSubmitting ? "Submitting..." : <>Send Message <Send className="w-4 h-4" /></>}
            </Button>
          </form>
        </motion.div>
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="relative z-10 shrink-0 w-full border-t border-[#2B1B17]/10 bg-[#FFFBE7] px-3 py-2 md:px-12 md:py-3">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-[10px] font-bold text-[#2B1B17]/60 sm:flex-row sm:gap-4 sm:text-xs">
          <div className="flex items-center gap-1.5">
            <img
              src={OFFICIAL_LOGO_URL}
              alt=""
              className="h-3.5 w-3.5 object-contain md:h-5 md:w-5"
            />
            <span className="opacity-80">© 2026 Community Loaves</span>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* Privacy Policy Link */}
            <a 
              href="https://communityloaves.org/privacy-policy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 hover:text-[#DF4C08] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Privacy Policy
            </a>

            {/* Sources Trigger */}
            <button
              type="button"
              onClick={toggleSourcesToast}
              className="hover:underline flex items-center gap-1 hover:text-[#DF4C08] transition-colors"
            >
              <Info className="w-3.5 h-3.5" /> Sources
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
