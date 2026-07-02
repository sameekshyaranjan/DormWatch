import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShield, FiAlertTriangle, FiMap, FiFileText, FiUser, FiHome,
  FiCheckCircle, FiUsers, FiTrendingUp, FiSearch, FiStar, FiAward,
  FiMapPin, FiCamera, FiMessageCircle, FiArrowRight, FiPlay, FiActivity, FiImage, FiUserCheck
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { 
  ScrollReveal, 
  StaggerReveal, 
  ParallaxContainer, 
  FadeIn,
  ScaleIn 
} from '../components/ParallaxEffect';

// Animated Counter Component
const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ 
  end, suffix = '', duration = 2000 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    requestAnimationFrame(animateCount);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const problemPoints = [
    { icon: <FiAlertTriangle />, text: "Fake reviews manipulated by brokers" },
    { icon: <FiAlertTriangle />, text: "Hidden safety hazards discovered too late" },
    { icon: <FiAlertTriangle />, text: "No accountability for property owners" },
    { icon: <FiAlertTriangle />, text: "Food poisoning & water quality issues" },
  ];

  const howItWorks = [
    {
      step: "1",
      icon: <FiSearch className="h-8 w-8" />,
      title: "Explore",
      description: "Browse accommodations near your college using our interactive map."
    },
    {
      step: "2",
      icon: <FiShield className="h-8 w-8" />,
      title: "Investigate",
      description: "Check the Trust Score—our definitive metric for property safety and hygiene."
    },
    {
      step: "3",
      icon: <FiFileText className="h-8 w-8" />,
      title: "Uncover",
      description: "Dive into detailed reports and visual evidence from verified students."
    },
    {
      step: "4",
      icon: <FiCheckCircle className="h-8 w-8" />,
      title: "Decide",
      description: "Make a data-backed decision without falling for broker marketing."
    }
  ];

  const features = [
    {
      icon: <FiMapPin className="h-7 w-7" />,
      title: "Neighborhood Safety Map",
      description: "Check if a PG or hostel is in a safe zone before you even visit.",
      color: "from-emerald-500 to-green-600",
      textColor: "text-emerald-400"
    },
    {
      icon: <FiActivity className="h-7 w-7" />,
      title: "Data-Driven Scores",
      description: "Compare properties easily with our simple 0-100 trust rating system.",
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-400"
    },
    {
      icon: <FiImage className="h-7 w-7" />,
      title: "Verified Proof",
      description: "Look at real photos uploaded by students to see the actual living conditions.",
      color: "from-purple-500 to-fuchsia-600",
      textColor: "text-purple-400"
    },
    {
      icon: <FiUserCheck className="h-7 w-7" />,
      title: "Owner Accountability",
      description: "Owners have to prove they fixed an issue before it gets marked as resolved.",
      color: "from-orange-500 to-red-600",
      textColor: "text-orange-400"
    }
  ];

  const testimonials = [
    {
      quote: "I avoided a leasing nightmare because a previous student uploaded photos of black mold in the bathroom. This app is a lifesaver.",
      author: "Priya S.",
      role: "Undergrad, Bengaluru",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya&backgroundColor=c7d2fe"
    },
    {
      quote: "My daughter moved 500km away for college. Being able to independently verify her building's security score gives me absolute peace of mind.",
      author: "Rajesh K.",
      role: "Parent, Chennai",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rajesh&backgroundColor=bbf7d0"
    },
    {
      quote: "We take safety seriously, and this platform finally lets us prove it. Fixing issues quickly boosted our trust score and filled our vacancies.",
      author: "Venkat R.",
      role: "Property Manager, Bangalore",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Venkat&backgroundColor=e9d5ff"
    }
  ];

  const stakeholderBenefits = [
    {
      icon: <FiUsers className="h-12 w-12" />,
      title: "For Students",
      benefits: [
        "Speak up without fear using our verified anonymous reporting.",
        "Find top-rated, safe housing right next to your campus.",
        "Avoid the \"catfish\" trap with 100% real photo evidence.",
        "Hold landlords entirely accountable for broken promises."
      ],
      color: "blue",
      cta: "Report an Issue",
      link: "/register"
    },
    {
      icon: <FiHome className="h-12 w-12" />,
      title: "For Parents",
      benefits: [
        "Ensure your child's living conditions meet your exact standards.",
        "Skip the guesswork with direct side-by-side property comparisons.",
        "Get alerted to declining safety trends before they become emergencies.",
        "Rely on transparent, unmanipulated student experiences."
      ],
      color: "green",
      cta: "Search Accommodations",
      link: "/accommodations"
    },
    {
      icon: <FiAward className="h-12 w-12" />,
      title: "For Good Owners",
      benefits: [
        "Turn your prompt maintenance into a competitive advantage.",
        "Defend your reputation by officially documenting issue resolutions.",
        "Separate your property from the bad actors in your area.",
        "Maximize occupancy by proving you care about tenant safety."
      ],
      color: "purple",
      cta: "Register Property",
      link: "/owner/register"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* ================= HERO SECTION with PARALLAX ================= */}
      <ParallaxContainer speed={0.3} className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            
            {/* Trust Badge */}
            <FadeIn delay={0}>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8">
                <FiShield className="h-4 w-4 mr-2 text-green-400" />
                <span>Trusted by 10,000+ Students Across India</span>
              </div>
            </FadeIn>

            {/* Main Headline */}
            <ScrollReveal delay={100} distance={40}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                Real Reviews
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text">
                  Verified Safety
                </span>
                <span className="block text-blue-300 text-3xl sm:text-4xl lg:text-5xl mt-2 font-bold">
                  No Surprises
                </span>
              </h1>
            </ScrollReveal>

            {/* Subheadline */}
            <ScrollReveal delay={200} distance={30}>
              <p className="text-lg sm:text-xl lg:text-2xl text-blue-100/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                DormWatch shows <span className="text-white font-semibold">real, verified safety reports</span> from students who've actually lived there — not brochure photos or bought reviews.
              </p>
            </ScrollReveal>
            
            {/* CTA Buttons */}
            <ScrollReveal delay={300} distance={20}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                {user ? (
                  <Link
                    to={user.role === 'owner' ? '/owner/dashboard' : user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="group inline-flex items-center px-8 py-4 text-lg font-bold rounded-xl text-slate-900 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl shadow-orange-500/25"
                  >
                    Go to Dashboard
                    <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/accommodations"
                      className="group inline-flex items-center px-8 py-4 text-lg font-bold rounded-xl text-slate-900 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl shadow-orange-500/25"
                    >
                      <FiMap className="mr-2 h-5 w-5" />
                      Search Safe Accommodations
                      <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/register"
                      className="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl text-white border-2 border-white/30 hover:bg-white/10 active:scale-95 backdrop-blur-sm transition-all duration-200"
                    >
                      Report a Safety Issue
                      <FiAlertTriangle className="ml-2 h-5 w-5" />
                    </Link>
                  </>
                )}
              </div>
            </ScrollReveal>

            {/* Trust Indicators */}
            <StaggerReveal stagger={150} className="flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm">
              <div className="flex items-center">
                <FiCheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>100% Verified Reports</span>
              </div>
              <div className="flex items-center">
                <FiShield className="h-5 w-5 text-blue-400 mr-2" />
                <span>Anonymous & Secure</span>
              </div>
              <div className="flex items-center">
                <FiMapPin className="h-5 w-5 text-red-400 mr-2" />
                <span>50+ Cities Covered</span>
              </div>
            </StaggerReveal>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </ParallaxContainer>

      {/* ================= PROBLEM SECTION ================= */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <FadeIn delay={0}>
              <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-4">
                THE PROBLEM
              </span>
            </FadeIn>
            <ScrollReveal delay={100}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Stop <span className="text-red-600">Guessing</span> About Your Living Conditions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Don't let a glossy brochure trap you. Get the real story from students who have actually lived there before you sign anything.
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal stagger={100} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🎭", title: "Fake Reviews", desc: "\"5-star\" ratings bought by landlords, not earned from students" },
              { icon: "🦠", title: "Hygiene Nightmares", desc: "Kitchen and living conditions you wouldn't wish on your worst enemy" },
              { icon: "💧", title: "Plumbing Issues", desc: "Irregular water supply and showers that never work when you need them" },
              { icon: "🔓", title: "Safety Risks", desc: "Useless locks, no working cameras, and zero security presence" }
            ].map((problem, i) => (
              <div key={i} className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(239,68,68,0.15)] transition-all duration-300 ease-out overflow-hidden cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-orange-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                <div className="w-14 h-14 bg-red-50 border border-red-100 text-2xl flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                  {problem.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{problem.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{problem.desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </div>

      {/* ================= STATS SECTION ================= */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal stagger={150} className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: 10000, suffix: "+", label: "Students Protected", icon: <FiUsers className="h-8 w-8" /> },
              { value: 500, suffix: "+", label: "Verified PGs & Hostels", icon: <FiHome className="h-8 w-8" /> },
              { value: 2500, suffix: "+", label: "Safety Reports Filed", icon: <FiFileText className="h-8 w-8" /> },
              { value: 95, suffix: "%", label: "Issues Resolved", icon: <FiCheckCircle className="h-8 w-8" /> }
            ].map((stat, i) => (
              <div key={i} className="text-white">
                <div className="flex justify-center mb-3 opacity-80">{stat.icon}</div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </div>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <div className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeIn delay={0}>
              <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
                HOW IT WORKS
              </span>
            </FadeIn>
            <ScrollReveal delay={100}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How to <span className="text-blue-600">Avoid the Housing Trap</span>
              </h2>
            </ScrollReveal>
          </div>

          <StaggerReveal stagger={120} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
            {howItWorks.map((step, i) => (
              <div key={i} className="group relative">
                {/* Connector Line */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0 border-t-2 border-dashed border-blue-200 z-0 opacity-50"></div>
                )}
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Outer circle with glow */}
                  <div className="relative w-24 h-24 rounded-full bg-white shadow-xl shadow-blue-100/50 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 border border-blue-50">
                    {/* Inner circle with icon */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    {/* Floating Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-lg border-2 border-white">
                      {step.step}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs">{step.description}</p>
                </div>
              </div>
            ))}
          </StaggerReveal>

          {/* CTA */}
          <ScrollReveal delay={0}>
            <div className="text-center mt-12">
              <Link
                to="/accommodations"
                className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl"
              >
                <FiSearch className="mr-2 h-5 w-5" />
                Start Searching Now
                <FiArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ================= FEATURES SECTION ================= */}
      <div className="py-24 lg:py-32 bg-[#0A0F1C] relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <FadeIn delay={0}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wider uppercase mb-6">
                Platform Capabilities
              </span>
            </FadeIn>
            <ScrollReveal delay={100}>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Everything You Need for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Safe Decisions</span>
              </h2>
            </ScrollReveal>
          </div>

          <StaggerReveal stagger={100} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group relative rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] p-8 lg:p-10 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
              >
                {/* Hover gradient sweep */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500`}></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                  <div className={`shrink-0 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 ${feature.textColor} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-white/10 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </div>

      {/* ================= TRUST SCORE EXPLAINER ================= */}
      <div className="py-24 lg:py-32 bg-[#050A15] relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] max-w-5xl bg-gradient-to-b from-blue-900/20 via-blue-900/5 to-transparent opacity-60 blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn delay={0}>
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
                <FiActivity className="w-3.5 h-3.5" />
                <span>The Trust Metric</span>
              </div>
            </FadeIn>
            <ScrollReveal delay={100}>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                Data-Driven Safety. <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Unbiased Property Scores.</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed font-medium">
                We aggregate historical safety reports, resolution metrics, and verified resident feedback to generate a real-time, tamper-proof score from 0 to 100.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Massive Score Display (Takes 5 columns) */}
            <ScrollReveal delay={200} className="lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
              <div className="relative bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-[3rem] p-12 text-center shadow-2xl hover:bg-white/[0.04] transition-colors duration-500">
                <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-6">Sample Property Score</h3>
                <div className="text-8xl lg:text-[9rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter mb-6 leading-none drop-shadow-sm">
                  88
                </div>
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2 rounded-full shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Excellent</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Legend (Takes 7 columns) */}
            <div className="lg:col-span-7 space-y-4">
              <StaggerReveal stagger={100}>
                {[
                  { range: "80-100", label: "Excellent", colorClass: "text-emerald-400", desc: "High safety standards maintained. Minimal reports and rapid resolution times." },
                  { range: "50-79", label: "Fair", colorClass: "text-amber-400", desc: "Intermittent issues requiring attention. Exercise standard caution and review recent reports." },
                  { range: "0-49", label: "Critical", colorClass: "text-red-400", desc: "Persistent unresolved safety concerns. Highly recommended to avoid." }
                ].map((score, i) => (
                  <div key={i} className="group flex flex-col sm:flex-row sm:items-center p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                    <div className={`w-32 shrink-0 text-3xl lg:text-4xl font-black ${score.colorClass} group-hover:scale-105 transition-transform duration-300 mb-4 sm:mb-0`}>
                      {score.range}
                    </div>
                    <div className="sm:ml-6 sm:border-l sm:border-white/10 sm:pl-6">
                      <h4 className="text-xl font-bold text-white mb-2">{score.label}</h4>
                      <p className="text-gray-400 leading-relaxed text-sm lg:text-base">{score.desc}</p>
                    </div>
                  </div>
                ))}
              </StaggerReveal>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STAKEHOLDER BENEFITS ================= */}
      <div className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Soft transition from dark above */}
        <div className="absolute top-0 w-full h-40 bg-gradient-to-b from-[#050A15] to-transparent opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn delay={0}>
              <span className="inline-block px-5 py-2 rounded-full bg-gray-100 text-gray-900 text-xs font-black tracking-widest uppercase mb-6 shadow-sm">
                Built For Everyone
              </span>
            </FadeIn>
            <ScrollReveal delay={100}>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                One Platform. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Three Distinct Visions.</span>
              </h2>
            </ScrollReveal>
          </div>

          <StaggerReveal stagger={150} className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {stakeholderBenefits.map((stakeholder, i) => {
              const colorObj = stakeholder.color === 'blue' ? { bg: 'bg-blue-600', bgSoft: 'bg-blue-50', text: 'text-blue-600', hoverBg: 'hover:bg-blue-700', shadow: 'shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)]' } :
                             stakeholder.color === 'green' ? { bg: 'bg-emerald-600', bgSoft: 'bg-emerald-50', text: 'text-emerald-600', hoverBg: 'hover:bg-emerald-700', shadow: 'shadow-[0_8px_20px_-6px_rgba(5,150,105,0.5)]' } :
                             { bg: 'bg-purple-600', bgSoft: 'bg-purple-50', text: 'text-purple-600', hoverBg: 'hover:bg-purple-700', shadow: 'shadow-[0_8px_20px_-6px_rgba(147,51,234,0.5)]' };

              return (
              <div 
                key={i} 
                className="group relative bg-[#FBFBFD] rounded-[2.5rem] p-8 lg:p-10 transition-all duration-500 hover:bg-white hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-transparent hover:border-gray-100 flex flex-col h-full overflow-hidden"
              >
                {/* Massive Decorative Icon Background */}
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-10 transition-all duration-700 ${colorObj.bg} blur-3xl pointer-events-none`}></div>
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-[1.5rem] mb-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-out bg-white border border-gray-100 ${colorObj.text}`}>
                    {stakeholder.icon}
                  </div>
                  
                  <h3 className="font-black text-gray-900 text-3xl mb-8 tracking-tight">{stakeholder.title}</h3>
                  
                  <ul className="space-y-5 mb-12 flex-1">
                    {stakeholder.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-start gap-4">
                        <div className={`mt-1 shrink-0 w-6 h-6 rounded-full ${colorObj.bgSoft} flex items-center justify-center ${colorObj.text}`}>
                          <FiCheckCircle className="w-4 h-4" />
                        </div>
                        <span className="text-gray-600 font-medium leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto relative z-10">
                  <Link
                    to={stakeholder.link}
                    className={`group/btn w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 ${colorObj.bg} ${colorObj.hoverBg} hover:-translate-y-1 ${colorObj.shadow}`}
                  >
                    <span>{stakeholder.cta}</span>
                    <FiArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )})}
          </StaggerReveal>
        </div>
      </div>

      {/* ================= TESTIMONIALS ================= */}
      <div className="py-24 lg:py-32 bg-[#030712] relative overflow-hidden">
        {/* Subtle top border/glow to separate from previous white section */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] max-w-4xl bg-gradient-to-tr from-yellow-500/5 via-orange-500/5 to-transparent blur-[120px] pointer-events-none rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn delay={0}>
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold tracking-widest uppercase mb-6">
                <FiStar className="w-3.5 h-3.5 fill-current" />
                <span>Wall of Love</span>
              </div>
            </FadeIn>
            <ScrollReveal delay={100}>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Trusted by thousands <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">across the country.</span>
              </h2>
            </ScrollReveal>
          </div>

          <StaggerReveal stagger={150} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <ScaleIn key={i} delay={i * 150} scale={0.95}>
                <div className="group bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:p-10 relative h-full flex flex-col hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  
                  {/* Decorative Quote Mark */}
                  <div className="absolute top-6 right-8 text-6xl text-white/5 font-serif font-black select-none pointer-events-none group-hover:text-yellow-500/10 transition-colors duration-500">"</div>
                  
                  <div className="relative z-10 flex-1 flex flex-col">
                    {/* Stars */}
                    <div className="flex gap-1.5 mb-8">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <FiStar key={j} className="h-5 w-5 text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                      ))}
                    </div>
                    
                    <p className="text-gray-300 mb-10 text-lg leading-relaxed flex-1 font-medium">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex items-center gap-4 border-t border-white/10 pt-6 mt-auto">
                      <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full bg-white/10 border border-white/20 shadow-sm" />
                      <div>
                        <div className="font-bold text-white text-lg tracking-tight">{testimonial.author}</div>
                        <div className="text-gray-500 text-sm font-medium">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScaleIn>
            ))}
          </StaggerReveal>
        </div>
      </div>

      {/* ================= FINAL CTA SECTION ================= */}
      <div className="py-24 lg:py-32 bg-[#030712] relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal delay={0}>
            <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 lg:p-20 text-center shadow-[0_0_80px_rgba(79,70,229,0.3)] border border-white/10">
              
              {/* Abstract Glass shapes */}
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-black opacity-20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                  Rent with absolute <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">confidence.</span>
                </h2>
                
                <p className="text-xl lg:text-2xl text-blue-100 mb-12 font-medium">
                  Join thousands of students making smarter, safer housing choices every day.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                  <Link
                    to="/accommodations"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-2xl text-indigo-700 bg-white hover:bg-gray-50 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]"
                  >
                    <FiSearch className="mr-3 h-6 w-6" />
                    Search Accommodations
                  </Link>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-2xl text-white bg-white/10 hover:bg-white/20 border border-white/20 transform hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md"
                  >
                    <FiAlertTriangle className="mr-3 h-6 w-6 text-yellow-300" />
                    Report an Issue
                  </Link>
                </div>
                
                <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-blue-200/80 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><FiCheckCircle className="w-4 h-4 text-emerald-400" /> Always Free</span>
                  <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-blue-300/50"></span>
                  <span className="flex items-center gap-2"><FiCheckCircle className="w-4 h-4 text-emerald-400" /> 100% Verified</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <FiShield className="h-8 w-8 text-blue-500" />
                  <span className="text-xl font-bold text-white">Student Safety Platform</span>
                </div>
                <p className="text-gray-400 mb-4 max-w-md">
                  Empowering students to make safe accommodation choices through verified reports and transparent ratings.
                </p>
                <p className="text-sm text-gray-500">
                  Made with ❤️ for student safety and welfare
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/accommodations" className="hover:text-white transition-colors">Search Accommodations</Link></li>
                  <li><Link to="/register" className="hover:text-white transition-colors">Report an Issue</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
                  <li><Link to="/owner/login" className="hover:text-white transition-colors">Owner Login</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li>dummy@example.com</li>
                  <li>+91 9999999999</li>
                  <li>Bengaluru, India</li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
          
          <FadeIn delay={200}>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
              <p>© 2026 Student Accommodation Safety Platform. All rights reserved.</p>
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
};