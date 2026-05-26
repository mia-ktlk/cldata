import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Heart, 
  Users, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  Wheat, 
  Cookie, 
  Info, 
  ExternalLink,
  RotateCcw,
  Play,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Truck,
  GraduationCap,
  Smile,
  Tv,
  FileText,
  Newspaper,
  Target,
  Gift
} from "lucide-react";
import { 
  FOOD_INSECURITY_TRENDS, 
  WASHINGTON_COUNTIES_DATA, 
  COMMUNITY_LOAVES_STATS,
  FoodInsecurityTrend,
  CountyData,
  OFFICIAL_LOGO_URL,
} from "../../../shared/const";
import { Button } from "@/components/ui/button";
import { toggleSourcesToast } from "@/lib/sources-toast";
import { publicAsset } from "@/lib/utils";
import { toast } from "sonner";

// Uploaded static asset URLs (under client/public/images/)
/** Bake with us illustration (1024×1024) — slide 10 */
const IMG_BAKE_WITH_US = publicAsset("images/girl-sit.webp");
const IMG_BAKE_DIFF = publicAsset("images/bake-diff.png");
/** Join us — It's as Easy as 1-2-3 (1024×576) */
const IMG_JOIN_US = publicAsset("images/easy-123.webp");
/** Three bakers illustration (1024×576) — slide 4 */
const IMG_THREE_BAKERS = publicAsset("images/three-bakers.png");
const IMG_GROCERY_CART = publicAsset("images/grocery-cart.svg");

// Interface for bread confetti items
interface ConfettiItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
}

// Custom hook for count-up animation
function useCountUp(target: number, duration: number = 1500, active: boolean = false) {
  const [count, setCount] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setCount(0);
      startTimeRef.current = null;
      return;
    }

    let animationFrameId: number;

    const updateCount = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease out cubic function for smooth slowing down at the end
      const easeOutCubic = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(easeOutCubic * target));

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration, active]);

  return count;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [selectedCounty, setSelectedCounty] = useState<string>("Ferry");
  const [displayInsecurityRate, setDisplayInsecurityRate] = useState<number>(0);
  const [displayClients, setDisplayClients] = useState<number>(0);
  const [confetti, setConfetti] = useState<ConfettiItem[]>([]);
  const [tvChannel, setTvChannel] = useState<number>(0); // 0: Today Show, 1: Washington Post, 2: Associated Press
  const [tvPower, setTvPower] = useState<boolean>(true); // true: ON, false: OFF
  const [tvBgColorIndex, setTvBgColorIndex] = useState<number>(0); // 0: Deep Purple, 1: Dark Forest Green, 2: Dark Charcoal
  const [tvFlicker, setTvFlicker] = useState<boolean>(false); // temporary static flicker when changing channels
  
  // Calculator states
  const [bakingFrequency, setBakingFrequency] = useState<number>(2); // times per month
  const [loavesPerBatch, setLoavesPerBatch] = useState<number>(4); // loaves per batch
  const [cookiesPerBatch, setCookiesPerBatch] = useState<number>(12); // cookies per batch
  const [bakeCookies, setBakeCookies] = useState<boolean>(true);
  const [bakeLoaves, setBakeLoaves] = useState<boolean>(true);
  const [simpleLoaves, setSimpleLoaves] = useState<number>(1); // simplified loaf count (1 to 10)

  // Stats count-up animation triggers
  const isStatsSlideActive = currentSlide === 4;
  const countDonated = useCountUp(500000, 2000, isStatsSlideActive);
  const countBakers = useCountUp(1000, 1800, isStatsSlideActive);
  const countStates = useCountUp(5, 1200, isStatsSlideActive);

  // Baker impact calculations
  const monthlyLoaves = bakeLoaves ? bakingFrequency * loavesPerBatch : 0;
  const monthlyCookies = bakeCookies ? bakingFrequency * cookiesPerBatch : 0;
  const annualLoaves = monthlyLoaves * 12;
  const annualCookies = monthlyCookies * 12;
  const mealsProvided = (annualLoaves * 12) + Math.floor(annualCookies / 3); // 12 sandwiches per loaf, 3 cookies per treat

  const activeCounty = WASHINGTON_COUNTIES_DATA.find((c: CountyData) => c.name === selectedCounty) || WASHINGTON_COUNTIES_DATA[0];

  // Smooth count-up effect when activeCounty changes
  useEffect(() => {
    let rateStart = 0;
    const rateTarget = activeCounty.insecurityRate;
    const rateDuration = 600; // ms
    const rateStepTime = 20; // ms
    const rateSteps = rateDuration / rateStepTime;
    const rateIncrement = rateTarget / rateSteps;

    let rateTimer = setInterval(() => {
      rateStart += rateIncrement;
      if (rateStart >= rateTarget) {
        setDisplayInsecurityRate(rateTarget);
        clearInterval(rateTimer);
      } else {
        setDisplayInsecurityRate(parseFloat(rateStart.toFixed(1)));
      }
    }, rateStepTime);

    let clientsStart = 0;
    const clientsTarget = activeCounty.totalClients;
    const clientsDuration = 600; // ms
    const clientsStepTime = 20; // ms
    const clientsSteps = clientsDuration / clientsStepTime;
    const clientsIncrement = Math.ceil(clientsTarget / clientsSteps);

    let clientsTimer = setInterval(() => {
      clientsStart += clientsIncrement;
      if (clientsStart >= clientsTarget) {
        setDisplayClients(clientsTarget);
        clearInterval(clientsTimer);
      } else {
        setDisplayClients(clientsStart);
      }
    }, clientsStepTime);

    return () => {
      clearInterval(rateTimer);
      clearInterval(clientsTimer);
    };
  }, [activeCounty]);

  const handleJoinNow = () => {
    setLocation("/join");
  };

  // We have 10 slides!
  const totalSlides = 10;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Touch Swipe Gesture Handlers for Mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  // Generate bread/cookie confetti when entering the final slide (Slide 9)
  // Strictly limited to: 🍞 (Bread), 🥖 (Dinner roll/baguette), 🍪 (Cookie)
  // Configured to burst ONCE (not repeat)
  useEffect(() => {
    if (currentSlide === 9) {
      const emojis = ["🍞", "🥖", "🍪"];
      const newConfetti: ConfettiItem[] = Array.from({ length: 45 }).map((_, idx) => ({
        id: idx,
        x: Math.random() * 100, // percentage of screen width
        y: -10 - Math.random() * 15, // start above viewport
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: 18 + Math.random() * 24, // px
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5, // tight delay for single burst feel
        duration: 2.5 + Math.random() * 2.5, // speed
      }));
      setConfetti(newConfetti);
    } else {
      setConfetti([]);
    }
  }, [currentSlide]);

  // Audited & Harmonized Spotify Wrapped Slide Colors
  // Slide 5 uses a beautiful animated pastel gradient (defined in index.css)
  const slideColors = [
    "bg-[#0D677E]", // Deep Teal (Intro)
    "bg-[#DF4C08]", // Burnt Orange (The Shocking Stat + Shopping Cart Infographic)
    "bg-[#1A3636]", // Dark Silt Green (County breakdown)
    "bg-[#3E125C]", // Deep Plum (Our Mission)
    "bg-[#0D677E]", // Deep Teal (Our Stats)
    "animate-pastel-gradient", // Slide 5: Beautiful animated pastel orange, yellow, and red gradient
    "bg-[#3E125C]", // Deep Plum (In the Media)
    "bg-[#DF4C08]", // Burnt Orange (Our 2026 Goals)
    "bg-[#1A3636]", // Dark Silt Green (Calculator: Every Loaf Counts)
    "bg-[#FEB522]", // Honey Gold (Final Slide + Confetti!)
  ];

  const textColors = [
    "text-[#FFFBE7]",
    "text-[#FFFBE7]",
    "text-[#FFFBE7]",
    "text-[#FFFBE7]",
    "text-[#FFFBE7]",
    "text-[#2B1B17]", // Slide 5: Dark text for the pastel background
    "text-[#FFFBE7]",
    "text-[#FFFBE7]",
    "text-[#FFFBE7]",
    "text-[#2B1B17]",
  ];

  // Helper component for beautiful SVG Donut Charts matching the exact CL website style
  const GoalDonut = ({ 
    percentage, 
    currentAmount, 
    label, 
    sublabel, 
    color, 
    bgColor 
  }: { 
    percentage: number; 
    currentAmount: string; 
    label: string; 
    sublabel: string; 
    color: string; 
    bgColor: string; 
  }) => {
    const radius = 36;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="bg-white p-3 md:p-4 rounded-3xl flex flex-col items-center gap-2 shadow-xl text-[#2B1B17]">
        {/* Category Header */}
        <div className="text-center">
          <span className="text-[10px] md:text-xs font-black block leading-tight tracking-tight">{label}</span>
          <span className="text-[8px] md:text-[10px] opacity-70 block mt-0.5 font-bold">{sublabel}</span>
        </div>

        {/* Legend */}
        <div className="flex gap-2 text-[8px] md:text-[9px] font-bold opacity-80">
          <span className="flex items-center gap-1">
            <span className="w-2 h-1 rounded-sm" style={{ backgroundColor: color }} /> Donated
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-1 rounded-sm" style={{ backgroundColor: bgColor }} /> Remaining
          </span>
        </div>

        {/* Interactive SVG Donut - normalized coordinates using viewBox so center numbers are perfectly aligned */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 my-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
            {/* Background circle (Remaining) */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={bgColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Foreground circle (Donated) */}
            <motion.circle
              cx="48"
              cy="48"
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Centered Donated Metric */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs md:text-sm font-black tracking-tight leading-none" style={{ color }}>
              {currentAmount}
            </span>
          </div>

          {/* Bottom Right Percentage */}
          <div className="absolute bottom-0.5 right-0.5 bg-white/90 backdrop-blur-sm px-1 py-0.5 rounded-md border border-gray-100 shadow-sm">
            <span className="text-[8px] md:text-[10px] font-black tracking-tighter" style={{ color }}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen md:h-screen flex flex-col bg-white overflow-y-auto md:overflow-hidden">
      
      {/* MAIN SLIDE VIEWPORT CONTAINER - PERFECTLY FIXED HEIGHT ON DESKTOP, SCROLLABLE ON MOBILE */}
      <div className={`relative flex-1 flex flex-col transition-colors duration-1000 ${
        currentSlide === 6 
          ? tvBgColorIndex === 0 
            ? "bg-[#3E125C]" // Deep Purple
            : tvBgColorIndex === 1 
              ? "bg-[#1A3636]" // Dark Forest Green
              : "bg-[#222]" // Dark Charcoal
          : slideColors[currentSlide]
      } ${textColors[currentSlide]} overflow-y-auto md:overflow-hidden select-none`}>
        
        {/* BACKGROUND GRAPHIC NOISE TEXTURE */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-5 pointer-events-none" />

        {/* AMBIENT BREAD CONFETTI BACKGROUND LAYER (ONLY ON THE FINAL SLIDE, BEHIND CONTENT) */}
        {currentSlide === 9 && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {confetti.map((item) => (
              <motion.div
                key={item.id}
                initial={{ 
                  x: `${item.x}vw`, 
                  y: `${item.y}vh`, 
                  rotate: item.rotation,
                  opacity: 0.8 
                }}
                animate={{ 
                  y: "110vh", 
                  rotate: item.rotation + 360,
                  opacity: 0 
                }}
                transition={{ 
                  duration: item.duration, 
                  delay: item.delay,
                  ease: "linear"
                }}
                style={{ 
                  position: "absolute", 
                  fontSize: `${item.size}px`,
                  userSelect: "none"
                }}
              >
                {item.emoji}
              </motion.div>
            ))}
          </div>
        )}

        {/* TOP PROGRESS BAR - WRAPPED IN A SAFE CONTAINER */}
        <div className="w-full px-6 pt-4 md:pt-6 z-50 shrink-0 select-none">
          <div className="flex gap-2 max-w-4xl mx-auto">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <div 
                key={idx} 
                className="h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden cursor-pointer"
                onClick={() => setCurrentSlide(idx)}
              >
                <motion.div 
                  className="h-full bg-white origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: idx < currentSlide ? 1 : idx === currentSlide ? 1 : 0 }}
                  transition={{ duration: idx === currentSlide ? 0.3 : 0.1 }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center max-w-4xl mx-auto mt-3 md:mt-4 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-80">
            <div className="flex items-center gap-2">
              <img 
                src={OFFICIAL_LOGO_URL} 
                alt="Community Loaves Logo" 
                className="w-6 h-6 md:w-7 h-7 object-contain bg-white rounded-full p-0.5"
              />
              <span>Community Loaves</span>
            </div>
            
            {/* Header Slide Info + Navigation Arrows for Mobile & Small Screens */}
            <div className="flex items-center gap-3">
              <button 
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="min-w-[56px] text-center">{currentSlide + 1} of {totalSlides}</span>
              <button 
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN STORYTELLING AREA - PERFECTLY FIXED VIEWPORT WITHOUT INNER SCROLLBARS ON DESKTOP, SCROLLABLE ON MOBILE */}
        <div 
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="flex-1 flex items-center justify-center w-full relative z-10 overflow-y-auto md:overflow-hidden px-6 py-4 md:py-6 min-h-0"
        >
          <div className="max-w-4xl mx-auto w-full flex items-center justify-center py-2 h-full md:h-auto">
            <AnimatePresence mode="wait">
              
              {/* SLIDE 0: THE INTRO */}
              {currentSlide === 0 && (
                <motion.div 
                  key="slide0"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center gap-4 md:gap-6 max-w-3xl py-2"
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-white p-2 rounded-full shadow-2xl border border-white/10"
                  >
                    <img 
                      src={OFFICIAL_LOGO_URL} 
                      alt="Community Loaves Anniversary Logo" 
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                  
                  <div className="flex flex-col gap-1 md:gap-2">
                    <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-[#FEB522]">Calling Washington Home Bakers</span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                      The <span className="text-[#FEB522] italic font-medium">Knead</span> <br />is Rising.
                    </h1>
                  </div>

                  <p className="text-xs md:text-sm lg:text-base font-medium opacity-90 max-w-xl leading-relaxed">
                    A critical food security crisis is unfolding across Washington. Discover how a dedicated community of home bakers is rising to meet this challenge, and see the massive impact you can make from your own kitchen.
                  </p>

                  <Button 
                    onClick={nextSlide}
                    size="lg"
                    className="bg-[#FEB522] hover:bg-[#FEB522]/90 text-[#2B1B17] text-xs md:text-sm font-black rounded-full px-5 py-3 md:px-6 md:py-4 shadow-2xl shadow-black/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all mt-1 md:mt-2"
                  >
                    Reveal the Data <Play className="w-3.5 h-3.5 fill-current" />
                  </Button>
                </motion.div>
              )}

              {/* MERGED SLIDE 1: THE SHOCKING STAT & GROCERY CART INFOGRAPHIC */}
              {currentSlide === 1 && (
                <motion.div 
                  key="slide1"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center w-full md:max-h-[72vh] md:overflow-hidden"
                >
                  {/* Left Column: 1-in-10 stat & Narrative */}
                  <div className="md:col-span-5 flex flex-col gap-2 text-left justify-center">
                    <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-[#FEB522]">The Reality Check</span>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-black leading-tight text-[#FFFBE7]">
                      The Expense Crisis:<br />
                      <span className="text-[#FEB522] italic font-medium">Rising Costs</span> <br />
                      Squeeze Washington Families.
                    </h2>

                    <div className="my-1.5 bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-2xl max-w-xs w-full shadow-xl">
                      <span className="text-2xl md:text-4xl font-black text-[#FEB522] tracking-tighter block leading-none mb-0.5">
                        1 in 10
                      </span>
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider block leading-tight text-white">
                        Households are currently food insecure
                      </span>
                    </div>

                    <p className="text-[11px] md:text-xs font-medium opacity-90 leading-relaxed text-white/95">
                      Families across our state are being forced to choose between paying rent and buying nutritious meals. Insecurity has jumped from 7.1% (2019) to 11.0% (2024)—creating a steep "hunger cliff" for Washingtonians.
                    </p>
                  </div>

                  {/* Right Column: Expanded & Transparent Grocery Cart Infographic */}
                  <div className="md:col-span-7 flex flex-col gap-3 h-full justify-center w-full min-h-0">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-[#FEB522]">Household Cost Pressures</span>
                      <span className="text-[9px] md:text-[10px] bg-[#DF4C08] text-white px-3 py-1 rounded-full font-bold">USDA ERS 2025</span>
                    </div>
                    
                    {/* Rebuilt Interactive Inline SVG Infographic for Perfect Readability */}
                    <div className="flex-1 flex items-center justify-center min-h-[240px] md:min-h-[360px] w-full py-2 relative">
                      <svg 
                        viewBox="0 0 1536 1024" 
                        className="w-full h-full max-h-[35vh] md:max-h-[48vh] object-contain"
                      >
                        {/* Shopping Cart Inner White Basin */}
                        <polygon 
                          fill="#FFFBE7" 
                          points="354.88 244.2 448.86 813.09 1243.58 813.09 1280.68 743.94 1352.39 279.26 1273.99 252.13 349.88 223.69 354.88 244.2"
                        />
                        
                        {/* Shopping Cart Structure & Wheels */}
                        <g>
                          {/* Wheels & Metal Chassis */}
                          <path fill="#C5C5C5" d="M1196.71,925.01l-4.03,5.67c-8.88,12.49-22.6,19.99-37.77,21.84-26.45,3.22-50.77-12.13-59.49-36.58-9.93-27.85,3.11-60.48,31.45-71.06l6.09-2.27-.7-6.23-153.15.56-51.23.16-140.55.31-127.22.62-11.27.2-130.71.08-.22,4.7c31.43,9.95,47.25,43.18,36.5,73-4.46,12.36-13.51,23.13-25.39,29.92-25.24,14.41-58.87,6.03-74.28-18.64l-3.32-5.32-1.24-3.24c-6.36-16.59-5.75-33.06,2.48-48.93,7.66-13.04,18.49-22.54,33.49-26.87-.1-1.28-.45-3.48-.72-4.49l-29.51-.05c-19.35-1.8-30.65-15.08-33.01-34.53l-16.1-132.83c-11.39-79.45-23.98-158.15-41.18-236.39l-32.82-149.23-4.4-18.54-10.68-42.57-2.96-11.08c-3.64-13.64-7.65-26.85-13.03-39.94-11.99-29.14-32.91-41.79-63.63-45.78l-1.01-.68c2.74-4.05,4.41-9.37,4.36-14.41l-.08-7.11c-.03-2.64-1.11-6.8-1.86-8.93l11.78,1.37c8.39,1.16,16.52,3.42,24.62,6.52,27.24,10.43,44.85,30.64,55.32,57.53,5.75,14.75,10.08,29.6,14.11,44.87l4.5,17.04,28.48.97,77.61,2.33,58.08,1.92,95,3.03,128.94,3.96,101.94,3.13,30.18.92,97.82,2.92,36.08,1.09,29.11.95,117.96,3.53,176.77,5.33c4.46.13,8.58.13,12.3,1.07,10.37,2.61,14.11,13.52,12.26,24.44l-5.09,30.04-8.93,55.02-9.62,60.66-5.53,36.29-7.86,51.1-19.8,131.49-14.87,100.08-6.39,44.35c-1.07,7.43-2.51,14.88-5.07,21.89-6.3,17.23-21.82,25.66-40.24,25.77l-65.58.36-.19,6.43c33.19,9.43,50.12,46.79,35.83,77.29l-2.34,4.99ZM1311.33,422.04l15.22-100.3,5.43-35.79c1.17-7.68-2.1-12.9-7-13.08l-26-.91-62.08-2.07-129.79-3.94-30.18-.9-70.89-2.1-33.05-.95-36-1.02-27.97-.79-24.22-.67-189.62-5.62-27.24-.81-70.94-2.03-72.97-2.09-34.03-.98-26.07-.78-75.88-2.27-33.18-.77,13.73,58.87,2.98,13.06,7.66,34.64,10.78,51.21,6.6,33.14,10.78,57.37,25.66,160.4,6.63,51.17,9.18,79.88c.62,5.41,1.17,10.45,2.82,15.36,2.75,8.18,10.17,13.81,19.5,13.81l171.85-.08,190.36-.46,389.29-.37c20.1-.02,30.21-7.36,33.24-27.27l17.47-114.86,26.85-175.84,2.05-13.26,9.03-58.91Z" />
                          <path fill="#EAEAEA" d="M1095.42,915.94c8.72,24.45,33.04,39.8,59.49,36.58,15.17-1.85,28.9-9.36,37.77-21.84l4.03-5.67,2.33-.05,53.02,6.77,9.03,2.25,8,2.66c3.37,1.12,5.82,4.76,4.58,6.21-1.39,1.62-5.26,3.77-7.37,4.35l-8.02,2.21-44.25,6.74-30.01,2.86-21.02,1.67-21,1.57-28.99,1.82-24.02,1.27-14.96.66-26.06.98-56.91,1.71-12.05.3-31.01.64-42.97.69-12.67.17-75.4.39-128.85-1.48-51.08-1.25-23.52-.71c-54.99-1.66-109.54-3.82-164.44-9.1l-19.45-1.87-46.64-6.44c-6.36-.88-17.72-5.08-17.99-8.54-.17-2.16,4.99-5.3,9.14-6.3l19.56-4.71,50.6-6.19,5.6-.52,1.57-1.84,3.32,5.32c15.4,24.67,49.03,33.05,74.28,18.64,11.88-6.78,20.93-17.55,25.39-29.92l2.47,1.2,23.11-1.09,14.34-.63,25.46-.98c88.37-3.4,176.33-3.95,264.92-2.92l10.31.12,70.91,1.17,48.02,1.08,10.01.27,31,1.08,38.01,1.53,2.41-.89Z" />
                          {/* Prominent Blue Handle Grip */}
                          <path fill="#124487" d="M239.53,96.35c.75,2.13,1.83,6.29,1.86,8.93l.08,7.11c.06,5.05-1.62,10.37-4.36,14.41-6.04,8.93-14.18,9.78-25.15,9.28l-58.24-2.66-9.87-.62c-4.58-.29-9.78-2.47-13.52-5.06-9.06-6.26-12.91-17.01-10.11-27.8,2.57-9.93,10.46-17.38,20.59-19.21,4.08-.73,8.77-.68,13.22-.5l57.31,2.33c12.89.52,22.08,2.54,28.2,13.79Z" />
                          
                          {/* Bar 1: Groceries (#DF4C08) */}
                          <path fill="#DF4C08" d="M658.54,662.89l-1.79,2.07-19.47-.24-14.66.03h-81.27s-13.22-.35-13.22-.35l-1.49-1.62.22-1.84-.41-1.11.05-3.09-.09-305.48-.1-19.39c-.02-3.24.99-7.18,3.09-9.12,2.45-2.27,5.98-3.22,9.71-3.21l111.81.13c4.59,0,9.03,5.09,9.03,9.31l.06,42.04-.29,45.97-.22,34.34-.18,28.09-.67,108.54-.11,74.92ZM579.56,567.65l1.64,7.45,1.37,2.43,5.54.15,1.78-5.71c3.07-9.87,6.47-22.65,2.46-30.35-1.95-3.74-10.7,1.93-11.57,9.08-.19,1.57,4.92-.56,5.07.9l.22,2.07c-1.64.13-4.6.3-5.6.99-1.27.88-1.77,4.55-1.96,6.41l5.01.27c.47.03,1.18,2.04.72,2.12l-2.37.43c-.58.1-2.31.56-2.4,1.13s-.03,2.05.1,2.64ZM577.85,571.68l-1.07-4.58c-.65-2.8-1.81-5.82-3.25-8.6-2.46-4.76-8.4-8.87-11.32-8.06-1.58.43-3.39,4.5-2.85,6.07l6.8,19.66c.08.41,2.14,1.85,2.92,1.81l9.89-.57-1.12-5.72ZM593.5,574.94l.31,2.81,21.16.19c.81,0,2.7-1.22,3.03-1.95,1.06-2.33-.5-6.36-2.85-6.56l-2.57-.22c-.18-.02-.85-3.79.03-4.3l2.33-1.36-2.05-1.73c-.2,1.14-.87,3.36-1.81,3.36l-4.54.02-2.53,4.64-.85-5.55c-5.09-.9-8.35,4-9.67,10.67ZM608.68,600.04l6.98,2.44,7,2.65,1.08-7.27c.12-.83.58-2.57,1.23-2.54,1.4.07,4.83-1.83,4.48-3.09-.43-1.53-1.58-4.17-2.32-5.2l-4.29-5.94-3.83-.07-55.91-.02-5.84,8.99c-.36.55-.68,2.78-.41,3.37s1.43,1.35,2.07,1.39l3.67.2-.06,9.13,8.57-2.13,4.74-1.29c4.92-1.34,10.51-2.37,15.38-.73,5.11,1.72,8.39-3.07,17.48.11ZM613.21,605.33l1.29,8.39c.08.55-.59,2.52-1.05,2.4l-1.9-.49-1.97-8.99c-.27-1.22-3.19-3.69-4.56-3.79l-7.57-.54,4.11,9.22c-1.92-.14-3.34-.24-2.03-.14l-5.52-6.6c-2.9-3.47-9.6-3.07-13.69-1.63l-5.19,1.83c1.98,3.57,2.41,4.65,2.99,8.28-3.44.04-3.89-5.46-8.81-7.57-10.27,3.12-17.12,10.46-14.58,19.69.95,3.44,4.92,7.78,9.34,7.78l56.93.04c3.56,0,7.29-2.27,8.94-4.77,1.52-2.31,2.09-6.51.91-9.33-3.26-7.78-10.44-12.34-17.64-13.78Z" />
                          
                          {/* Bar 2: Housing (#5FBDBF) */}
                          <path fill="#5FBDBF" d="M841.93,664.24c-.12-.02-.41.11-.92.29l-25.02.2h-11.72s-13.23-.04-13.23-.04l-11.38-.02-17.97.07-27.75.15-12.92-.56-.49-55.69-.48-52.6-.05-5.1-.64-70.89v-37.76c0-3.71,4.59-8.37,8.7-8.37l98.87-.09c8.04,0,12.2,1.49,14.31,9.14l.09,57.09.43,101.89.17,62.29ZM757.26,579.13l12.52-10.35,11.36-9.11,14.38,11.77,15.72,12.32,10.73,7.25c.96.65,3.62-3.11,2.69-3.82l-7.78-5.98-20.62-15.55-12.31-9.48c-.7-.54-3.39-1.6-4.06-1.09l-7.65,5.86-6.56,5.03-.3-7.71c-1.43-.4-4.69-1.11-6.29-1.05l-8.56.34-.04,19.72-11.25,8.93c-.68.54-1.56,2.47-1.22,3.16,1.17,2.4,5.8,1.02,6.96.05l12.29-10.29ZM818.96,628.73l-3.65-.29-.19-35.13-24.15-18.26-9.93-6.88-33.16,25.2-.11,34.63-4.17.61-1.49,1.89c-.34.43.92,1.82,1.24,1.95l75.34.05,2.1-1.65c.39-.31-1.33-2.07-1.83-2.11Z" />
                          
                          {/* Bar 3: Transportation (#FEB522) */}
                          <path fill="#FEB522" d="M1036.73,664.58l-.67.09-10.16.09-47.91.07-66.96.03-4.87-.31-.27-31.57-.39-45.6-.41-31.38-.6-43.39-.16-20.36c-.03-4.11,5-8.51,9.66-8.51h84.93s27.2,0,27.2,0c4.54,0,11.1,2.49,11.08,8.28l-.16,63.91-.15,18.06-.1,13.07-.06,77.51ZM954.89,620.97l1.9,7.24,30.72-.08c.49-4.28,2.49-7.75,5.16-9.14,3.58-1.87,7.85-1.96,11.05.4,2.56,1.89,3.55,5.03,4.46,8.73l6.1-.22c1.62-.06,3.08-4.11,2.96-5.73l-.45-6.26c-.28-3.8-2.66-7.3-6.6-8.11l-9.9-2.05-2.89-5.01-4.66-7.86c-1.75-2.95-7.06-5.69-10.52-5.75l-11.24-.18-18.36.7c-2.7.1-6.77,3.66-7.86,5.85l-4.9,9.82c-2.47,4.95-12.68.66-13.14,9.42l-.45,8.49c-.1,1.92,1.45,6.5,3.42,6.6l6.72.32c.37-5.14,2.6-8.77,7.18-9.88,1.27-.31,3.73-.05,6.04.25,1.76.05,2.21,2.97-.1,2.32-3.58-.73-6.79-.06-8.51,1.79-1.83,1.96-2.16,5.73-.99,8.35,1.45,3.25,5.15,4.71,8.36,3.99,2.06-.46,5.22-2.98,5.52-5.82.23-2.18-.35-3.55-1.68-6.33-.36.25.55-.38,2.64-1.83ZM1005.13,628.71c.66-5.89-4.1-8.81-8.33-8.23-3.81.52-6.79,4.14-6.35,8.03s3.87,7.36,8.69,6.56c2.57-.43,5.65-3.33,5.99-6.36Z" />
                          
                          {/* Bar 4: Healthcare (#785B8C) */}
                          <path fill="#785B8C" d="M1207.04,664.29l-7.41.59-104.56.07-3.05-.54v-23.41s-.12-15.01-.12-15.01l-.33-32.6-.24-18.37.28-21.34c.03-2.65,4.38-6.84,7.48-6.84l100.77.09c6.11,0,8.2,6.49,8.16,10.97l-.29,36.13-.25,30.64-.44,39.64ZM1156.85,635.25c.35,0,2.37-2.41,2.37-2.75l-.11-16.76,18.15-.27c.3-.34,1.82-2.21,1.82-2.73l.04-12.62c0-.98-1.47-3.47-2.11-4l-17.78-.16-.14-17.79c-.01-1.59-3.8-2.93-4.87-2.62l-12.22.12c-1.32.01-2.76,3.02-2.75,4.25l.12,16.07-17.51.12-2.05,2.97-.03,13.97,2.51,2.6,16.98-.05.09,17.81c.34.35,2.3,1.87,2.9,1.87l14.59-.02Z" />
                          
                          {/* Ground line/base */}
                          <path fill="#2B1B17" d="M1208.99,664.6l-1.95-.3-7.41.59-104.56.07-3.05-.54-2.04.25-53.24-.08-.67.09-10.16.09-47.91.07-66.96.03-4.87-.31-2.21.11-59.93-.08-2.1-.35c-.12-.02-.41.11-.92.29l-25.02.2h-11.72s-13.23-.04-13.23-.04l-11.38-.02-17.97.07-27.75.15-12.92-.56-3.16.28-57.69-.06-1.64-1.67-1.79,2.07-19.47-.24-14.66.03h-81.27s-13.22-.35-13.22-.35l-1.49-1.62-.93,1.72h-38.79s-2.02-1.2-2.02-1.2l-.4-15.31-.44-16.25-1.03-36.77-1.22-46.95-.03-1.4c-.26-1.2-.38-2.45-.35-3.72.03-1.26.12-2.51.21-3.77l-.07-3.93h.32c.01-.26.02-.51.03-.75l-.34.03-.58-19.48-.71-25.23-1.15-43.05-.94-33.98-1.13-45.96-2.02-73.85-2.91-.18.83,38.3,1.06,38.95.92,36.25.94,34,1.05,38,1.05,35.78.92,35.22.98,38.04,1.07,40.96.99,37.96,2.29,1.33h187.89s578.54.03,578.54.03c1.31,0,2.13.08,2.16-.29l.21-2.64-44.02-.04Z" />
                          <path fill="none" stroke="#72AEA6" strokeMiterlimit="10" strokeWidth="8" d="M472.78,316.75l758.79,5.57" />
                        </g>

                        {/* Labels removed for a clean, minimalist aesthetic */}
                      </svg>
                    </div>

                    <div className="flex justify-between items-center text-[10px] md:text-xs font-black text-[#FFFBE7] opacity-90 border-t border-white/10 pt-2">
                      <span>WA Insecurity Rate: 7.1% (2019) ➜ 11.0% (2024)</span>
                      <span className="text-[#FEB522] font-black">Household Cost Pressures</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SLIDE 2: COUNTY BREAKDOWN */}
              {currentSlide === 2 && (
                <motion.div 
                  key="slide3"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center w-full md:max-h-[72vh] md:overflow-hidden"
                >
                  {/* Left Column: Map and Header (Always visible, responsive) */}
                  <div className="flex md:col-span-7 flex-col gap-1.5 text-left h-full justify-center">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#DF4C08]">
                        <span className="text-[13px]">✨</span>
                        <span className="text-[10px] md:text-[11px] font-black tracking-widest uppercase text-[#DF4C08] font-sans">
                          <span className="hidden md:inline">Click a county to explore local food insecurity data.</span>
                          <span className="md:hidden">Washington State Food Insecurity Map</span>
                        </span>
                      </div>
                    </div>

                    {/* Interactive Washington State SVG Map */}
                    <div className="relative bg-transparent rounded-2xl flex items-center justify-center h-28 sm:h-40 md:h-64 overflow-hidden mt-0.5">
                      <svg 
                        viewBox="0 0 1542.27 922.49" 
                        className="w-full h-full object-contain filter drop-shadow-sm"
                        style={{ maxHeight: "100%" }}
                      >
                        {/* Washington State Outline / Base Map - exact path from WashingtonState.svg */}
                        <path 
                          d="M212.38,540.98s-43.79-22.49-60.36-22.49c0,0-15.39-73.38-39.06-86.4,0,0,26.04-101.79-53.26-121.91,0,0-11.84-57.99-8.28-61.55s-10.65-63.91,7.1-63.91l125.46,57.99s87.58,1.18,92.32,7.1,66.28,1.18,66.28,1.18c0,0,27.22,13.02,27.22,18.94s16.57,7.1,16.57,7.1l4.73,13.02,16.57-10.65s27.22,10.65,24.85,31.96-17.75,26.04-17.75,26.04c0,0-44.98,44.98,7.1,25.45l10.8,23.08s4.59,22.49,22.34,18.94-14.2,54.44-23.67,47.34c0,0-74.56,37.87-56.81,53.26,0,0,54.44,8.28,69.83-11.84,0,0,7-23.67,15.93-31.96,0,0,26.68,4.73,40.88-27.22,0,0-17.75-30.77-8.28-39.06,0,0,22.49-4.73-5.92-26.04l9.47-31.96,4.9-26.04,12.86-20.12s3.55-31.96-31.96-42.61c0,0-1.18-18.94,5.92-31.96s-31.96-31.96-31.96-31.96c0,0,39.06-42.61,7.1-88.77l-43.79-18.94s-1.18-42.61,21.3-44.98,1062.95,0,1062.95,0c0,0,24.62,10.36,15.52,42.21l-2.73,588.89s8.59-5.46,4.75,12.74-5.66,16.38,6.17,22.75,11.83,63.71,4.55,64.62,7.28-.91,7.28-.91c0,0,12.74,39.14-14.56,32.77s-419.6-3.64-419.6-3.64c0,0-13.56,7.35-21.12,7.01s-18.55,9.27-25.42,5.84-37.44,12.02-38.47,7.9-16.49,14.08-20.61,8.93-34.01,18.55-53.59,4.81l-47.4,26.45h-50.15s-15.11-13.4-29.88,0c0,0-1.37,10.65-14.43,8.93s-17.18,7.21-24.39,2.4l-28.51,5.15-21.98,13.74-31.95-24.73-25.08.34s-25.42-20.95-55.65,2.4c0,0-18.89-9.27-30.57,2.75l-40.19,25.42s-7.56-5.5-20.27,0c0,0-19.58,15.8-38.13,0l-35.04-1.37s-47.4-17.52-36.07-48.43l.22-26.12-17.71-29.15-9.22-16.6-24.35-20.29-9.96-.37s-11.07-11.07-30.62.74l-32.1-24.35s-64.57-7.75-69.37,1.11c0,0-50.92,1.84-39.48-33.21l15.13-26.57,2.58-46.12s45.01-5.17,2.21-21.77c0,0-63.46-16.23-2.21-48.33l11.02-7.02Z"
                          fill="#feb522" 
                          className="transition-all duration-300"
                        />

                        {/* Dynamic Top 10 Food Insecure Cities / Counties Markers with even larger Map Pins */}
                        {WASHINGTON_COUNTIES_DATA.map((county) => (
                          <g 
                            key={county.name} 
                            className="cursor-pointer" 
                            onClick={() => setSelectedCounty(county.name)}
                          >
                            <circle 
                              cx={county.cx} 
                              cy={county.cy} 
                              r="40" 
                              className={`fill-[#DF4C08]/25 ${selectedCounty === county.name ? "animate-ping opacity-75" : ""}`} 
                            />
                            {/* Larger vector map pin icon (scale 2.0) */}
                            <g transform={`translate(${county.cx - 24}, ${county.cy - 48}) scale(2.0)`}>
                              <path 
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                                fill={selectedCounty === county.name ? "#FFFBE7" : "#DF4C08"} 
                              />
                            </g>
                            <text 
                              x={county.textX} 
                              y={county.textY - 5} 
                              fill="#FFFFFF" 
                              fontSize="32" 
                              fontWeight="900" 
                              textAnchor={county.textAnchor || "middle"}
                              className="font-sans filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
                            >
                              {county.city}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>

                    {/* Bottom Helper Bar (Desktop Only) */}
                    <div className="hidden md:flex bg-[#F6EFE5] px-2.5 py-1 rounded-full items-center gap-1.5 border border-[#DF4C08]/10 w-fit mt-0.5 shadow-sm">
                      <div className="bg-[#DF4C08] text-white p-0.5 rounded-full text-[8px]">👆</div>
                      <span className="text-[9px] md:text-[10px] font-bold text-[#2B1B17]">Click on any county to see detailed food insecurity statistics.</span>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Statistics Card matching Mockup (Turns into Carousel on Mobile) */}
                  <div className="col-span-1 md:col-span-5 flex flex-col justify-center h-full">
                    {/* Mobile Header Hint */}
                    <div className="md:hidden text-center mb-3">
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#FEB522] font-sans">
                        Swipe or tap arrows to browse county statistics
                      </span>
                    </div>

                    <div className="relative flex items-center justify-between w-full">
                      {/* Left Carousel Arrow for Mobile */}
                      <button
                        onClick={() => {
                          const currentIndex = WASHINGTON_COUNTIES_DATA.findIndex(c => c.name === selectedCounty);
                          const prevIndex = currentIndex > 0 ? currentIndex - 1 : WASHINGTON_COUNTIES_DATA.length - 1;
                          setSelectedCounty(WASHINGTON_COUNTIES_DATA[prevIndex].name);
                        }}
                        className="md:hidden p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-white mr-2 shrink-0 flex items-center justify-center border border-white/10"
                        aria-label="Previous County"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {/* Main Card */}
                      <div className="bg-white border border-[#2B1B17]/10 p-4 md:p-6 rounded-3xl shadow-lg flex flex-col gap-4 text-left h-fit my-auto flex-1">
                        {/* Header Row */}
                        <div className="border-b border-[#2B1B17]/10 pb-2">
                          <h3 className="text-base md:text-lg font-black text-[#DF4C08] tracking-tight uppercase font-sans">
                            {`${selectedCounty.toUpperCase()} COUNTY`}
                          </h3>
                          <p className="text-xs text-[#2B1B17]/50 font-bold font-sans">
                            Principal City: {activeCounty.city}
                          </p>
                        </div>

                        {/* Circular Icon Statistics Rows with smooth count-up */}
                        <div className="flex flex-col gap-4 py-1">
                          {/* Row 1: Food Insecurity Rate */}
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#EAF5E5] border border-[#529947]/20 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                              👥
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] md:text-[11px] font-black tracking-wider uppercase text-[#2B1B17]/50 font-sans leading-none">Food Insecurity Rate</span>
                              <span className="text-lg md:text-xl font-black text-[#529947] mt-1 leading-none">{displayInsecurityRate}%</span>
                              <span className="text-[10px] md:text-[11px] text-[#2B1B17]/70 font-medium leading-none mt-1">of local households</span>
                            </div>
                          </div>

                          {/* Row 2: Clients Served */}
                          <div className="flex items-center gap-4 border-t border-[#2B1B17]/5 pt-4">
                            <div className="w-12 h-12 rounded-full bg-[#E5F3F7] border border-[#5299B5]/20 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                              🛒
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] md:text-[11px] font-black tracking-wider uppercase text-[#2B1B17]/50 font-sans leading-none">Annual Food Bank Clients</span>
                              <span className="text-lg md:text-xl font-black text-[#5299B5] mt-1 leading-none">{displayClients.toLocaleString()}</span>
                              <span className="text-[10px] md:text-[11px] text-[#2B1B17]/70 font-medium leading-none mt-1">estimated pantry visits</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Carousel Arrow for Mobile */}
                      <button
                        onClick={() => {
                          const currentIndex = WASHINGTON_COUNTIES_DATA.findIndex(c => c.name === selectedCounty);
                          const nextIndex = currentIndex < WASHINGTON_COUNTIES_DATA.length - 1 ? currentIndex + 1 : 0;
                          setSelectedCounty(WASHINGTON_COUNTIES_DATA[nextIndex].name);
                        }}
                        className="md:hidden p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-white ml-2 shrink-0 flex items-center justify-center border border-white/10"
                        aria-label="Next County"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Mobile County Indicator */}
                    <div className="md:hidden text-center mt-3">
                      <span className="text-xs font-black text-[#FFFBE7]/70">
                        {WASHINGTON_COUNTIES_DATA.findIndex(c => c.name === selectedCounty) + 1} of {WASHINGTON_COUNTIES_DATA.length} Counties
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SLIDE 3: OUR MISSION */}
              {currentSlide === 3 && (
                <motion.div 
                  key="slide4"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center w-full max-w-4xl px-1 sm:px-0"
                >
                  <div className="md:col-span-7 flex flex-col text-left gap-2 md:gap-3">
                    <span className="text-[10px] md:text-xs lg:text-sm font-black tracking-widest uppercase text-[#FEB522]">The Community Loaves Mission</span>
                    
                    <blockquote className="font-serif text-sm md:text-lg lg:text-xl font-semibold leading-relaxed italic border-l-4 border-[#FEB522] pl-3">
                      "{COMMUNITY_LOAVES_STATS.missionStatement}"
                    </blockquote>

                    <p className="text-[10px] md:text-xs lg:text-sm opacity-85 leading-relaxed">
                      We believe that simple ingredients combined with collective community action can nourish both bodies and souls. We don't just bake; we build strong, resilient connections.
                    </p>
                  </div>

                  <figure className="md:col-span-5 flex justify-center w-full mt-2 md:mt-0">
                    <div className="w-full max-w-[min(100%,40rem)] md:max-w-full">
                      <img
                        src={IMG_THREE_BAKERS}
                        alt="Three Community Loaves bakers preparing bread and cookies together"
                        width={1024}
                        height={576}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 360px"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto block"
                      />
                    </div>
                  </figure>
                </motion.div>
              )}

              {/* SLIDE 4: OUR STATS (WITH DYNAMIC COUNT-UP ANIMATIONS) */}
              {currentSlide === 4 && (
                <motion.div 
                  key="slide5"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center gap-2.5 md:gap-3 max-w-4xl"
                >
                  <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-[#FEB522]">Our Collective Impact</span>
                  
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-black leading-tight">
                    Our network is <br />
                    <span className="text-[#FEB522] italic font-medium">baking a real difference</span>:
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4 w-full max-w-2xl mt-1">
                    <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-3xl flex flex-col items-center gap-1 shadow-md hover:border-[#FEB522]/30 transition-all duration-300">
                      <Wheat className="w-6 h-6 md:w-8 h-8 text-[#FEB522]" />
                      <span className="text-xl md:text-2xl lg:text-3xl font-black text-[#FEB522]">
                        {countDonated.toLocaleString()}+
                      </span>
                      <span className="text-[9px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-wider text-white/90">Goods Donated</span>
                      <span className="text-[9px] md:text-[10px] opacity-70">Nutritious bread & cookies delivered</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-3xl flex flex-col items-center gap-1 shadow-md hover:border-[#FEB522]/30 transition-all duration-300">
                      <Cookie className="w-6 h-6 md:w-8 h-8 text-[#FEB522]" />
                      <span className="text-xl md:text-2xl lg:text-3xl font-black text-[#FEB522]">
                        {countBakers.toLocaleString()}+
                      </span>
                      <span className="text-[9px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-wider text-white/90">Volunteer Bakers</span>
                      <span className="text-[9px] md:text-[10px] opacity-70">Passionate neighbors baking with purpose</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-center mt-1 text-[8px] md:text-[9px] lg:text-[10px] font-bold uppercase tracking-wider opacity-80 flex-wrap">
                    <span className="flex items-center gap-1">❤️ Baked with Care</span>
                    <span className="flex items-center gap-1">🤝 Neighbors Supporting Neighbors</span>
                    <span className="flex items-center gap-1">🌟 Strengthening Our Community</span>
                  </div>
                </motion.div>
              )}

              {/* SLIDE 5: HOW IT WORKS */}
              {currentSlide === 5 && (
                <motion.div 
                  key="slide6"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center gap-2 md:gap-3 w-full max-w-4xl px-1 sm:px-0"
                >
                  <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-[#DF4C08]">How it works</span>
                  
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-black leading-tight text-[#2B1B17]">
                    Bake a Difference
                  </h2>

                  <figure className="w-full max-w-[min(100%,40rem)] mx-auto">
                    <div className="w-full overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-white shadow-xl ring-1 ring-black/10">
                      <img
                        src={IMG_JOIN_US}
                        alt="Join us — it's as easy as 1-2-3: attend a baker orientation, bake bread or energy cookies, then drop off fresh or frozen"
                        width={1024}
                        height={576}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 640px"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto block"
                      />
                    </div>
                  </figure>

                  <p className="text-[8px] md:text-[9px] lg:text-[10px] opacity-80 max-w-lg italic font-bold text-[#2B1B17] leading-tight">
                    💡 We have over 74 active neighborhood drop-off porch hubs across Washington State!
                  </p>
                </motion.div>
              )}

              {/* SLIDE 6: IN THE MEDIA (INTERACTIVE RETRO TV CENTERED DESIGN) */}
              {currentSlide === 6 && (
                <motion.div 
                  key="slide7"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-3 md:gap-4 max-w-4xl w-full"
                >
                  {/* Header Texts */}
                  <div className="text-center">
                    <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-[#FEB522]">Baking Headlines</span>
                    <h2 className="text-lg md:text-2xl font-black leading-tight mt-0.5">
                      What the <span className="text-[#FEB522] italic font-medium">Media is Saying</span>
                    </h2>
                  </div>

                  {/* Redesigned Centered Interactive TV & Channel Menu Layout */}
                  <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 w-full max-w-3xl mt-1">
                    
                    {/* Left: Obvious "Channel Menu" / Retro Guide */}
                    <div className="w-full md:w-56 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-3 flex flex-col justify-center gap-2">
                      <span className="text-[9px] font-black tracking-wider uppercase text-[#FEB522] opacity-80 mb-1 px-1">
                        📺 TV Guide / Channels
                      </span>
                      {[
                        { name: "CH 04: Today Show", icon: Tv, url: "https://www.today.com/video/-we-re-breader-together-hundreds-of-seattle-s-home-bakers-donate-to-food-banks-99083845722" },
                        { name: "CH 07: Washington Post", icon: FileText, url: "https://www.washingtonpost.com/lifestyle/wellness/food-security-nutrition-usda-school-andres/2021/06/10/8375e7c6-c951-11eb-81b1-34796c7393af_story.html" },
                        { name: "CH 11: Associated Press", icon: Newspaper, url: "https://apnews.com/article/food-banks-hunger-donated-homebaked-bread-175b9ac40a746a499a754f4e861557e7" }
                      ].map((ch, idx) => {
                        const Icon = ch.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (tvPower) {
                                setTvFlicker(true);
                                setTimeout(() => setTvFlicker(false), 200);
                              }
                              setTvChannel(idx);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-2xl border text-left transition-all ${
                              tvChannel === idx 
                                ? "bg-[#DF4C08] border-white/20 text-[#FFFBE7] font-black shadow-lg scale-[1.02]" 
                                : "bg-white/5 border-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-[10px] truncate">{ch.name}</span>
                            </div>
                            <span className="text-[8px] font-black opacity-60 shrink-0">
                              {tvChannel === idx ? "ON AIR" : "SELECT"}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right: Large, Beautiful Interactive TV Set */}
                    <div className="flex-1 bg-[#DF4C08] rounded-3xl border-4 border-white/20 shadow-2xl p-4 flex flex-col relative">
                      
                      {/* Antenna on top */}
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-16 h-5 flex justify-between pointer-events-none">
                        <div className="w-1 h-5 bg-white/40 origin-bottom rotate-[-25deg]" />
                        <div className="w-1 h-5 bg-white/40 origin-bottom rotate-[25deg]" />
                      </div>

                      <div className="flex items-stretch gap-3 h-48 md:h-56">
                        
                        {/* Interactive TV Screen */}
                        <div className="flex-1 bg-[#111] rounded-2xl overflow-hidden border-2 border-black/50 shadow-inner relative flex flex-col justify-between p-4">
                          
                          {/* Ambient screen scanlines & curve reflection */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] z-20 pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 z-10 pointer-events-none" />

                          {/* Static screen when power is off or flickering */}
                          {!tvPower && (
                            <div className="absolute inset-0 bg-[#050505] z-30 flex flex-col items-center justify-center">
                              <div className="w-12 h-[1px] bg-white/40 animate-pulse" />
                              <span className="text-[6px] font-black text-white/20 uppercase tracking-widest mt-1">NO SIGNAL</span>
                            </div>
                          )}

                          {tvPower && tvFlicker && (
                            <div className="absolute inset-0 bg-[#111] z-30 tv-static-screen pointer-events-none" />
                          )}

                          {/* Channel Content (Animate on switch) */}
                          <AnimatePresence mode="wait">
                            {tvPower && (
                              <motion.div
                                key={tvChannel}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="h-full flex flex-col justify-between z-0"
                              >
                                {/* Channel Identifier / Header with Integrated Media Logos */}
                                <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                                  <div className="flex items-center gap-1.5">
                                    {/* SVG Logos for Media Outlets */}
                                    {tvChannel === 0 && (
                                      <div className="flex items-center gap-1">
                                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#FEB522]">
                                          <circle cx="12" cy="12" r="10" />
                                          <circle cx="12" cy="12" r="6" className="fill-[#111]" />
                                          <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        <span className="text-[8px] md:text-[9px] font-black tracking-widest text-[#FEB522] uppercase">
                                          TODAY
                                        </span>
                                      </div>
                                    )}
                                    {tvChannel === 1 && (
                                      <div className="flex items-center gap-1">
                                        <span className="font-serif font-black text-white text-xs bg-white text-black px-0.5 rounded-sm leading-none">W</span>
                                        <span className="text-[8px] md:text-[9px] font-black tracking-widest text-white uppercase">
                                          POST
                                        </span>
                                      </div>
                                    )}
                                    {tvChannel === 2 && (
                                      <div className="flex items-center gap-1">
                                        <span className="font-sans font-black text-[#FEB522] text-[10px] leading-none border border-[#FEB522] px-0.5 rounded-sm">AP</span>
                                        <span className="text-[8px] md:text-[9px] font-black tracking-widest text-white/90 uppercase">
                                          PRESS
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-[8px] md:text-[9px] font-black text-white/50">
                                    {tvChannel === 0 ? "CH 04" : tvChannel === 1 ? "CH 07" : "CH 11"}
                                  </span>
                                </div>

                              {/* Big, Beautiful Quote inside TV Screen */}
                              <div className="my-auto py-1">
                                <blockquote className="text-[10px] md:text-xs lg:text-sm font-medium italic opacity-95 leading-relaxed text-[#FFFBE7]">
                                  {tvChannel === 0 && '"We\'re breader together: Hundreds of Seattle\'s home bakers are baking and donating to local food banks."'}
                                  {tvChannel === 1 && '"Community Loaves connects, trains, and empowers home-based bakers to reduce hunger and promote wellness."'}
                                  {tvChannel === 2 && '"A growing network of passionate neighbors baking with purpose to strengthen our communities and fight hunger together."'}
                                </blockquote>
                              </div>

                              {/* Footer Action Card Link */}
                              <div className="flex justify-between items-center border-t border-white/10 pt-1.5">
                                <div className="flex items-center gap-1">
                                  {/* Golden Yellow Sound Waves inside TV footer */}
                                  <div className="w-[2px] h-3 bg-[#FEB522] rounded-full sound-wave-bar-1" />
                                  <div className="w-[2px] h-3 bg-[#FEB522] rounded-full sound-wave-bar-3" />
                                  <div className="w-[2px] h-3 bg-[#FEB522] rounded-full sound-wave-bar-5" />
                                </div>
                                <a
                                  href={
                                    tvChannel === 0 
                                      ? "https://www.today.com/video/-we-re-breader-together-hundreds-of-seattle-s-home-bakers-donate-to-food-banks-99083845722" 
                                      : tvChannel === 1 
                                        ? "https://www.washingtonpost.com/lifestyle/wellness/food-security-nutrition-usda-school-andres/2021/06/10/8375e7c6-c951-11eb-81b1-34796c7393af_story.html" 
                                        : "https://apnews.com/article/food-banks-hunger-donated-homebaked-bread-175b9ac40a746a499a754f4e861557e7"
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[9px] md:text-[10px] font-black text-[#FEB522] hover:text-[#fff] flex items-center gap-1 transition-colors"
                                >
                                  {tvChannel === 0 ? "Watch Feature" : tvChannel === 1 ? "Read Article" : "Read Report"}
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Interactive TV Right Controls (Clickable knobs to change channels!) */}
                        <div className="w-10 md:w-12 h-full flex flex-col justify-between items-center py-2 shrink-0">
                          
                          {/* Upper Channel Selector Knob */}
                          <button 
                            onClick={() => {
                              if (tvPower) {
                                setTvFlicker(true);
                                setTimeout(() => setTvFlicker(false), 200);
                              }
                              setTvChannel((prev) => (prev + 1) % 3);
                            }}
                            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white border-2 border-black/20 shadow-md flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform relative"
                            title="Turn Channel Selector Knob"
                          >
                            {/* Dial marker that rotates based on channel */}
                            <div 
                              className="w-1 h-3.5 bg-black/80 rounded-full absolute top-0.5 origin-bottom transition-transform duration-300"
                              style={{ transform: `rotate(${tvChannel * 120}deg)` }}
                            />
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200 border border-gray-300" />
                          </button>

                          {/* Lower Volume / Theme Color Selector Knob */}
                          <button 
                            onClick={() => {
                              setTvBgColorIndex((prev) => (prev + 1) % 3);
                            }}
                            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white border-2 border-black/20 shadow-md flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform relative"
                            title="Change Background Color"
                          >
                            {/* Dial marker rotates depending on color index */}
                            <div 
                              className="w-1 h-3.5 bg-black/80 rounded-full absolute top-0.5 origin-bottom transition-transform duration-300"
                              style={{ transform: `rotate(${tvBgColorIndex * 120}deg)` }}
                            />
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200 border border-gray-300" />
                          </button>

                          {/* Power Button & indicator light */}
                          <div className="flex flex-col items-center gap-0.5 mt-1">
                            <button
                              onClick={() => setTvPower(!tvPower)}
                              className={`w-4 h-4 rounded-full border border-black/40 flex items-center justify-center shadow-inner transition-colors ${
                                tvPower ? "bg-red-500 shadow-red-500/50" : "bg-zinc-800"
                              }`}
                              title="Toggle TV Power"
                            >
                              <div className="w-1 h-1 rounded-full bg-white/60" />
                            </button>
                            <span className="text-[5px] font-black text-white/80 tracking-widest uppercase">
                              {tvPower ? "ON" : "OFF"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Interactive TV Helper Hint */}
                      <div className="text-center mt-1.5 px-2">
                        <div className="inline-block text-[8px] md:text-[9px] font-black text-[#FFFBE7]/60 tracking-wider uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-full leading-normal max-w-full break-words">
                          💡 Click the TV Guide, the dial knobs, or power button to experiment!
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SLIDE 7: OUR 2026 GOALS */}
              {currentSlide === 7 && (
                <motion.div 
                  key="slide8"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center gap-1.5 md:gap-2 max-w-4xl"
                >
                  <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-[#FEB522]">Setting Our Sights Higher</span>
                  
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-black leading-tight">
                    Our <span className="text-[#FEB522] italic font-medium">2026 Goals</span>
                  </h2>

                  <p className="text-[9px] md:text-[10px] lg:text-xs opacity-90 max-w-xl leading-tight">
                    With food insecurity rising, we are expanding our collective efforts. Here is our progress towards our 2026 milestones:
                  </p>

                  {/* Highly Colorful, Brand-Accurate Donut Charts */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 w-full mt-1">
                    <GoalDonut 
                      percentage={47} 
                      currentAmount="23,651" 
                      label="Bread Loaves" 
                      sublabel="Goal: 50,250" 
                      color="#5FBDBF" // Teal
                      bgColor="#C5E8E9" 
                    />
                    <GoalDonut 
                      percentage={49} 
                      currentAmount="46,082" 
                      label="Energy Cookies" 
                      sublabel="Goal: 95,000" 
                      color="#DF4C08" // Orange-Red
                      bgColor="#F5C8BA" 
                    />
                    <GoalDonut 
                      percentage={35} 
                      currentAmount="738" 
                      label="Dinner Rolls" 
                      sublabel="Goal: 2,110" 
                      color="#2D8C54" // Green
                      bgColor="#BBE3CE" 
                    />
                    <GoalDonut 
                      percentage={15} 
                      currentAmount="656" 
                      label="Holiday Boxes" 
                      sublabel="Goal: 4,375" 
                      color="#785B8C" // Purple
                      bgColor="#D4C8E0" 
                    />
                  </div>
                </motion.div>
              )}

              {/* SLIDE 8: CALCULATOR (SIMPLIFIED "A LITTLE GOES A LONG WAY" THEME) */}
              {currentSlide === 8 && (
                <motion.div 
                  key="slide9"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center w-full z-40 relative max-w-4xl"
                >
                  {/* Left Column: Simple Interactive Controls */}
                  <div className="md:col-span-5 bg-[#2B1B17] text-[#FFFBE7] p-4 md:p-5 rounded-3xl shadow-2xl flex flex-col gap-4 text-left">
                    <div className="flex flex-col">
                      <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-[#FEB522]">A Little Goes a Long Way</span>
                      <h3 className="text-base md:text-xl font-black text-[#FEB522] mt-0.5">Your Loaf Impact</h3>
                    </div>

                    <p className="text-[10px] md:text-xs opacity-80 leading-relaxed">
                      At Community Loaves, we believe in the power of collective small actions. Every single loaf of bread is sliced and transformed into healthy meals.
                    </p>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between">
                      <span className="text-[10px] md:text-xs font-bold text-[#FEB522]">Impact Formula:</span>
                      <span className="text-[10px] md:text-xs font-black text-white bg-[#DF4C08] px-2 py-0.5 rounded-full">
                        1 Loaf = 7 Sandwiches
                      </span>
                    </div>

                    {/* Simple Loaf Slider */}
                    <div className="flex flex-col gap-1.5 mt-1 relative">
                      <div className="flex justify-between text-[10px] md:text-xs font-black">
                        <span>How many loaves?</span>
                        <span className="text-[#FEB522] text-xs md:text-sm">{simpleLoaves} {simpleLoaves === 1 ? "Loaf" : "Loaves"}</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" value={simpleLoaves} 
                        onChange={(e) => setSimpleLoaves(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FEB522]"
                      />
                      <div className="flex justify-between text-[8px] opacity-50 font-bold px-0.5">
                        <span>1 Loaf</span>
                        <span>5 Loaves</span>
                        <span>10 Loaves</span>
                      </div>

                      {/* Animated Milestone Popups */}
                      <AnimatePresence mode="wait">
                        {simpleLoaves === 1 && (
                          <motion.div
                            key="m1"
                            initial={{ opacity: 0, scale: 0.9, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 5 }}
                            className="mt-2 bg-[#DF4C08] border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg"
                          >
                            <span className="text-xs">🏠</span>
                            <span className="text-[10px] font-black text-white">Milestone: Feeds a whole family! (7 meals)</span>
                          </motion.div>
                        )}
                        {simpleLoaves >= 2 && simpleLoaves < 5 && (
                          <motion.div
                            key="m2"
                            initial={{ opacity: 0, scale: 0.9, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 5 }}
                            className="mt-2 bg-[#FEB522] border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg"
                          >
                            <span className="text-xs">🏫</span>
                            <span className="text-[10px] font-black text-[#2B1B17]">Milestone: Feeds a classroom! ({simpleLoaves * 7} meals)</span>
                          </motion.div>
                        )}
                        {simpleLoaves >= 5 && simpleLoaves < 10 && (
                          <motion.div
                            key="m3"
                            initial={{ opacity: 0, scale: 0.9, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 5 }}
                            className="mt-2 bg-[#529947] border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg"
                          >
                            <span className="text-xs">🏢</span>
                            <span className="text-[10px] font-black text-white">Milestone: Feeds a shelter block! ({simpleLoaves * 7} meals)</span>
                          </motion.div>
                        )}
                        {simpleLoaves === 10 && (
                          <motion.div
                            key="m4"
                            initial={{ opacity: 0, scale: 0.9, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 5 }}
                            className="mt-2 bg-[#5299B5] border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg"
                          >
                            <span className="text-xs">🌍</span>
                            <span className="text-[10px] font-black text-white">Milestone: Feeds a whole community! (70 meals)</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right Column: Growing Sandwich Icons Visualizer */}
                  <div className="md:col-span-7 flex flex-col gap-3 text-left h-full justify-center">
                    <div className="flex flex-col">
                      <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-[#FEB522]">Your Action in Action</span>
                      <h2 className="text-xl md:text-3xl font-black leading-none mt-0.5 text-white">
                        Providing <span className="text-[#FEB522]">{simpleLoaves * 7}</span> Sandwiches!
                      </h2>
                    </div>

                    <p className="text-[10px] md:text-xs opacity-90 leading-relaxed text-white/90">
                      By baking just <strong>{simpleLoaves} {simpleLoaves === 1 ? "loaf" : "loaves"}</strong>, you provide enough slices to make <strong>{simpleLoaves * 7} healthy, whole-grain sandwiches</strong> for neighbors visiting local food pantries.
                    </p>

                    {/* Sandwich Grid Visualizer - Scales by multiples of 7 */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-3 md:p-4 min-h-[140px] md:min-h-[200px] flex flex-col justify-center gap-2 overflow-hidden">
                      <span className="text-[8px] font-black tracking-wider uppercase text-[#FEB522] opacity-70">
                        🥪 Sandwich Counter ({simpleLoaves * 7} total)
                      </span>
                      
                      {/* Dynamically adjust columns, gap, and max width to scale beautifully for high sandwich counts */}
                      <div className="grid grid-cols-7 gap-1 md:gap-1.5 w-full max-w-md mx-auto justify-items-center">
                        {Array.from({ length: simpleLoaves * 7 }).map((_, idx) => {
                          const totalCount = simpleLoaves * 7;
                          
                          // Dynamically calculate exact inline size constraints to guarantee no overflow
                          let boxSize = "w-10 h-10 text-base rounded-xl";
                          if (totalCount > 49) {
                            boxSize = "w-6 h-6 text-[10px] rounded-md";
                          } else if (totalCount > 28) {
                            boxSize = "w-8 h-8 text-xs rounded-lg";
                          }

                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.5, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 15, 
                                delay: (idx % 7) * 0.015 
                              }}
                              className={`${boxSize} bg-[#FFFBE7] flex items-center justify-center shadow-md border border-amber-100 relative group shrink-0`}
                              title={`Sandwich #${idx + 1}`}
                            >
                              <span>🥪</span>
                              <span className="absolute -bottom-1 -right-1 bg-[#DF4C08] text-white text-[6px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform">
                                {idx + 1}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SLIDE 9: READY TO JOIN US? */}
              {currentSlide === 9 && (
                <motion.div 
                  key="slide10"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center w-full max-w-4xl z-40 relative px-1 sm:px-0"
                >
                  <div className="md:col-span-7 flex flex-col text-left gap-3 md:gap-4 order-2 md:order-1">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-[#DF4C08]">Start Baking a Difference Today</span>
                      <h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none text-[#2B1B17]">
                        Ready to <span className="text-[#DF4C08] italic font-medium">Join Us?</span>
                      </h2>
                    </div>

                    <p className="text-[10px] md:text-xs font-medium opacity-90 leading-relaxed text-[#2B1B17]">
                      No prior baking experience is required! Fill out our quick form to learn more about how you can become a home-based baker and support families in your community.
                    </p>

                    <Button 
                      onClick={handleJoinNow}
                      size="lg"
                      className="bg-[#DF4C08] hover:bg-[#DF4C08]/90 text-white text-xs md:text-sm font-black rounded-full px-4 py-2.5 md:px-5 md:py-3 shadow-2xl shadow-black/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all w-fit"
                    >
                      Learn More! <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <figure className="md:col-span-5 flex justify-center w-full order-1 md:order-2">
                    <div className="w-full max-w-[min(88vw,18rem)] sm:max-w-[20rem] md:max-w-full">
                      <img
                        src={IMG_BAKE_WITH_US}
                        alt="Bake with us — person holding a loaf of bread"
                        width={1024}
                        height={1024}
                        sizes="(max-width: 768px) 88vw, (max-width: 1024px) 40vw, 360px"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto block"
                      />
                    </div>
                  </figure>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM NAVIGATION CONTROLS BAR (STAYS FLOATING IN THE PRESENTATION) */}
        <div className="w-full px-6 pb-4 md:pb-6 z-50 shrink-0 select-none">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            
            {/* Slide Navigation Buttons */}
            <div className="flex gap-2.5 md:gap-3">
              <Button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                variant="outline"
                className="rounded-full w-9 h-9 md:w-11 md:h-11 p-0 border-white/20 text-white bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4.5 h-4.5 md:w-5 md:h-5" />
              </Button>
              
              {currentSlide < totalSlides - 1 ? (
                <Button
                  onClick={nextSlide}
                  className="rounded-full bg-white text-black hover:bg-white/90 font-black text-xs md:text-sm px-3.5 md:px-5 py-2 md:py-2.5 flex items-center gap-1.5"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentSlide(0)}
                  className="rounded-full bg-white text-black hover:bg-white/90 font-black text-xs md:text-sm px-3.5 md:px-5 py-2 md:py-2.5 flex items-center gap-1.5"
                >
                  Start Over <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            {/* Quick Action button */}
            <Button 
              onClick={() => setLocation("/join")}
              className="bg-[#DF4C08] hover:bg-[#DF4C08]/90 text-white font-black text-xs md:text-sm px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              Join Us! <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

      </div>

      {/* TRADITIONAL WHITE WEBSITE FOOTER */}
      <footer className="w-full bg-white border-t border-gray-100 py-3 md:py-4 px-6 z-50 shrink-0 select-none">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 md:gap-4 justify-between items-center text-[10px] md:text-xs text-[#2B1B17] font-bold">
          
          <div className="flex items-center gap-2">
            <img 
              src={OFFICIAL_LOGO_URL} 
              alt="Community Loaves" 
              className="w-5 h-5 md:w-6 h-6 object-contain"
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
