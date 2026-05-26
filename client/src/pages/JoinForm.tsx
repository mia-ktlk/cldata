import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Wheat, Heart, Cookie, Send, Sparkles, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="h-screen bg-[#FFFBE7] text-[#2B1B17] flex flex-col relative overflow-hidden font-sans">
      
      {/* Dynamic Background Graphics */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#FEB522]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-94 bg-[#DF4C08]/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <header className="shrink-0 px-6 py-3 w-full flex items-center justify-between z-10">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="text-[#2B1B17] hover:bg-[#2B1B17]/10 font-bold flex items-center gap-2 rounded-full px-4"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </Button>
        <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#DF4C08]">
          <img
            src={OFFICIAL_LOGO_URL}
            alt="Community Loaves Logo"
            className="w-8 h-8 md:w-9 md:h-9 object-contain bg-white rounded-full p-0.5"
          />
          <span>Community Loaves</span>
        </div>
      </header>

      {/* FORM BODY */}
      <main className="flex-1 min-h-0 flex items-center justify-center px-[15vw] py-2 z-10 overflow-y-auto md:overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border-2 border-[#FEB522] rounded-3xl p-5 md:p-6 shadow-2xl w-[70vw] max-w-[70vw] max-h-full overflow-hidden"
        >
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-5 lg:gap-8 items-start">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start gap-2">
            <div className="bg-[#DF4C08]/10 p-2 rounded-full text-[#DF4C08]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#DF4C08] tracking-tight leading-tight">
              Rise to the Occasion!
            </h1>
            <p className="text-xs md:text-sm font-medium opacity-80 leading-snug">
              Fill out this form to learn more about how you can volunteer, drop off bread, and nurture your local Washington community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* First Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#2B1B17]/80">First Name *</label>
                <input 
                  type="text" 
                  name="firstName"
                  required
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#FEB522]/30 focus:border-[#DF4C08] focus:outline-none bg-[#FFFBE7]/20 transition-all font-medium text-sm"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#2B1B17]/80">Last Name *</label>
                <input 
                  type="text" 
                  name="lastName"
                  required
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#FEB522]/30 focus:border-[#DF4C08] focus:outline-none bg-[#FFFBE7]/20 transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#2B1B17]/80">Email Address *</label>
              <input 
                type="email" 
                name="email"
                required
                placeholder="jane.doe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border-2 border-[#FEB522]/30 focus:border-[#DF4C08] focus:outline-none bg-[#FFFBE7]/20 transition-all font-medium text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Interest Level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#2B1B17]/80">Interest Level (Optional)</label>
                <select 
                  name="interestLevel"
                  value={formData.interestLevel}
                  onChange={(e) => setFormData({ ...formData, interestLevel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#FEB522]/30 focus:border-[#DF4C08] focus:outline-none bg-white transition-all font-medium text-sm appearance-none"
                >
                  <option value="high">🔥 I'm ready to start baking!</option>
                  <option value="medium">✨ I'd like more information first</option>
                  <option value="low">🌱 Just exploring options</option>
                </select>
              </div>

              {/* Baking Experience */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#2B1B17]/80">Baking Experience (Optional)</label>
                <select 
                  name="bakingExperience"
                  value={formData.bakingExperience}
                  onChange={(e) => setFormData({ ...formData, bakingExperience: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#FEB522]/30 focus:border-[#DF4C08] focus:outline-none bg-white transition-all font-medium text-sm appearance-none"
                >
                  <option value="none">🥚 None (Ready to learn!)</option>
                  <option value="beginner">🍞 Beginner (Some bread/cookies)</option>
                  <option value="intermediate">🥐 Intermediate (Regular baker)</option>
                  <option value="advanced">🥖 Advanced (Sourdough/Pastry master)</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#2B1B17]/80">Your Message (Optional)</label>
              <textarea 
                name="message"
                rows={2}
                placeholder="Tell us why you'd like to join or ask any questions you have!"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border-2 border-[#FEB522]/30 focus:border-[#DF4C08] focus:outline-none bg-[#FFFBE7]/20 transition-all font-medium text-sm resize-none"
              />
            </div>

            {/* Newsletter Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="receiveNewsletter"
                checked={formData.receiveNewsletter}
                onChange={(e) => setFormData({ ...formData, receiveNewsletter: e.target.checked })}
                className="w-4 h-4 rounded border-[#FEB522]/30 text-[#DF4C08] focus:ring-[#DF4C08] accent-[#DF4C08]"
              />
              <span className="text-xs font-bold opacity-80">Send me updates on local baking schedules and hub events</span>
            </label>

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#DF4C08] hover:bg-[#DF4C08]/90 text-white font-black py-2.5 rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Submitting..." : <>Send Message <Send className="w-4 h-4" /></>}
            </Button>
          </form>
          </div>
        </motion.div>
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="shrink-0 w-full py-3 px-6 md:px-12 border-t border-[#2B1B17]/10 relative z-10 bg-[#FFFBE7]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-[#2B1B17]/60">
          
          <div className="flex items-center gap-2">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Community Loaves Logo"
              className="w-5 h-5 md:w-6 md:h-6 object-contain"
            />
            <span className="opacity-80">© 2026 Community Loaves. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
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
              onClick={() => {
                toast("Data Sources & References", {
                  description:
                    "Data compiled from: Northwest Harvest (2024-2025 Reports), University of Washington WAFOOD Wave 5 (2025), USDA ERS, Feeding America WA, and WSDA EFAP Reports.",
                  duration: 8000,
                  classNames: {
                    description: "!text-[#2B1B17]",
                  },
                });
              }}
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
