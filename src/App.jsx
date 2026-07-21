import { useState, useEffect, useRef } from 'react';

/* ─── tiny icons ─── */
const ChevronDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>;
const ArrowRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const Check = ({ className = '' }) => <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const Globe = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const MenuIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const XIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>;
const Star = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF4800" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

/* ─── scroll animation hook ─── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.animate-on-scroll');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ─── animated counter ─── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let cur = 0;
        const inc = target / 120;
        const t = setInterval(() => {
          cur += inc;
          if (cur >= target) { setCount(target); clearInterval(t); }
          else setCount(Math.floor(cur));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ══════════════════════════════════════════════
   UTILITY BAR  (top gray strip)
   ══════════════════════════════════════════════ */
function UtilityBar() {
  return (
    <div className="hidden md:block bg-[#FAFAFA] border-b border-gray-200 text-xs text-dtv-body">
      <div className="max-w-[1200px] mx-auto px-6 h-9 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1 hover:text-dtv-dark transition-colors"><Globe /> Indonesia <ChevronDown /></button>
          <span className="text-gray-300">|</span>
          <button className="hover:text-dtv-dark transition-colors">🔆 High Contrast</button>
          <button className="hover:text-dtv-dark transition-colors">💬 Customer Support</button>
          <button className="hover:text-dtv-dark transition-colors">📞 Contact Sales</button>
        </div>
        <div className="flex items-center gap-5">
          <button className="hover:text-dtv-dark transition-colors flex items-center gap-1"><SearchIcon /></button>
          <a href="#" className="hover:text-dtv-dark transition-colors">Log In</a>
          <button className="flex items-center gap-1 hover:text-dtv-dark transition-colors">About <ChevronDown /></button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* logo and links */}
        <div className={`flex items-center transition-all duration-500 ${scrolled ? 'gap-4' : 'gap-8'}`}>
          <a href="#" className="flex items-center gap-0.5 overflow-hidden">
            {/* Clean D Icon with a dot inside */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M4 2v20h8c5.523 0 10-4.477 10-10S17.523 2 12 2H4z" fill="#FF4800"/>
              <circle cx="13" cy="12" r="3.5" fill="white"/>
            </svg>
            {/* Text TV that hides on scroll */}
            <span className={`text-dtv-orange font-black text-[28px] leading-none tracking-tighter transition-all duration-500 pt-0.5 ${scrolled ? 'max-w-0 opacity-0' : 'max-w-[50px] opacity-100'}`}>
              TV
            </span>
          </a>
          {/* links */}
          <div className="hidden lg:flex items-center gap-1">
            {['Products', 'Solutions', 'Pricing', 'Resources'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-dtv-dark hover:text-dtv-orange transition-colors rounded-md hover:bg-gray-50">
                {l} {l !== 'Pricing' && <ChevronDown />}
              </a>
            ))}
          </div>
        </div>
        {/* right */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="#" className="btn-orange text-sm">Get a demo</a>
          <a href="#" className="btn-outline-orange text-sm">Get started free</a>
        </div>
        {/* mobile */}
        <button className="lg:hidden text-dtv-dark" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>
      {/* mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 animate-fade-in">
          {['Products', 'Solutions', 'Pricing', 'Resources'].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="block py-2 text-sm font-medium text-dtv-dark" onClick={() => setMobileOpen(false)}>{l}</a>
          ))}
          <div className="flex gap-2 pt-2">
            <a href="#" className="btn-orange text-sm flex-1 text-center">Get a demo</a>
            <a href="#" className="btn-outline-orange text-sm flex-1 text-center">Get started free</a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════════════
   HERO  (full-width photo background)
   ══════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-5.75rem)] flex items-center justify-center overflow-hidden">
      {/* bg image */}
      <img src="/hero-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30"></div>
      {/* content */}
      <div className="relative z-10 text-center px-6 py-32 max-w-4xl mx-auto">
        <p className="text-white/90 text-sm font-semibold tracking-[0.25em] uppercase mb-8">
          DTV Agentic Customer Platform
        </p>
        <h1 className="font-serif text-white text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-normal leading-[1.1] mb-8">
          Where go-to-market<br className="hidden sm:block" /> teams go to scale<span className="text-dtv-orange">.</span>
        </h1>
        <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Unite marketing, sales, and customer service on one agentic customer platform that delivers results fast.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#" className="btn-orange px-10 py-4 text-base">Get a demo</a>
          <a href="#" className="btn-outline-orange !bg-white !text-dtv-orange px-10 py-4 text-base">Get started free</a>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   TRUSTED BY  (logo strip)
   ══════════════════════════════════════════════ */
function TrustedBy() {
  const brands = ['Tokopedia', 'Gojek', 'Traveloka', 'Shopee', 'Bukalapak'];
  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-[1100px] mx-auto px-6">
        <p className="text-center text-dtv-muted text-base mb-8">
          <span className="font-semibold text-dtv-dark">299,000+</span> customers in over <span className="font-semibold text-dtv-dark">135</span> countries grow their businesses with DTV.
        </p>
        <div className="flex items-center justify-center gap-12 md:gap-20 flex-wrap">
          {brands.map((b) => (
            <span key={b} className="text-gray-400 font-bold text-xl md:text-2xl tracking-wide opacity-60 hover:opacity-100 transition-opacity cursor-default">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PLATFORM SECTION  (serif heading + CRM cards)
   ══════════════════════════════════════════════ */
function PlatformSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      title: "A CRM that's really smart.",
      desc: "DTV's Smart CRM is the single source of truth that connects all your business data.",
      cards: [
        { label: 'Smart CRM', color: 'bg-dtv-orange', icons: ['📊', '📈', '🔗', '⚡'] },
        { label: 'Hubs', color: 'bg-[#C3E8D0]' },
        { label: 'Breeze', color: 'bg-[#E8D4F0]' },
      ],
    },
    {
      title: 'Hubs that power every team.',
      desc: "Marketing, sales, service, content, and operations hubs — all connected on one platform.",
      cards: [
        { label: 'Marketing', color: 'bg-dtv-peach' },
        { label: 'Sales', color: 'bg-[#B9D4F0]' },
        { label: 'Service', color: 'bg-[#C3E8D0]' },
      ],
    },
    {
      title: 'Breeze AI, built right in.',
      desc: 'AI that works across your entire customer platform — not bolted on, but built in.',
      cards: [
        { label: 'Copilot', color: 'bg-[#E8D4F0]' },
        { label: 'Agents', color: 'bg-dtv-peach' },
        { label: 'Intelligence', color: 'bg-[#B9D4F0]' },
      ],
    },
  ];
  const s = slides[activeSlide];

  return (
    <section className="py-24 md:py-32 bg-dtv-cream">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="font-serif text-dtv-dark text-4xl md:text-[3.5rem] leading-tight mb-4">
            DTV's Agentic Customer Platform
          </h2>
          <p className="text-dtv-muted text-base md:text-lg max-w-2xl mx-auto">
            Connected data and tools make it easier to know, do, and connect everything across your business.
          </p>
        </div>

        {/* slide content */}
        <div className="grid md:grid-cols-2 gap-12 items-center animate-on-scroll">
          <div>
            <h3 className="font-serif text-dtv-dark text-3xl md:text-[2.5rem] leading-snug mb-4">{s.title}</h3>
            <p className="text-dtv-muted text-base md:text-lg">{s.desc}</p>
          </div>

          {/* 3D-ish cards */}
          <div className="flex items-end justify-center gap-3 h-64 perspective-[800px]">
            {s.cards.map((c, i) => (
              <div
                key={c.label}
                className={`${c.color} rounded-2xl shadow-lg transition-all duration-500 flex flex-col items-center justify-end pb-4`}
                style={{
                  width: i === 0 ? '140px' : '110px',
                  height: i === 0 ? '220px' : i === 1 ? '200px' : '180px',
                  transform: i === 0 ? 'rotateY(-5deg)' : i === 2 ? 'rotateY(5deg)' : 'none',
                  zIndex: i === 0 ? 3 : 3 - i,
                  opacity: i === 0 ? 1 : 0.7 + i * 0.1,
                }}
              >
                {c.icons && (
                  <div className="grid grid-cols-2 gap-2 mb-auto mt-6 px-4">
                    {c.icons.map((ic, j) => (
                      <div key={j} className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center text-base shadow-sm">{ic}</div>
                    ))}
                  </div>
                )}
                <span className="text-xs font-semibold text-dtv-dark mt-2">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* dots */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button onClick={() => setActiveSlide((p) => (p - 1 + slides.length) % slides.length)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-dtv-dark hover:text-dtv-dark transition-colors"><ChevronLeft /></button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setActiveSlide(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${activeSlide === i ? 'bg-dtv-dark' : 'bg-gray-300'}`} />
            ))}
          </div>
          <button onClick={() => setActiveSlide((p) => (p + 1) % slides.length)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-dtv-dark hover:text-dtv-dark transition-colors"><ChevronRight /></button>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PRODUCTS GRID  (HubSpot hub cards)
   ══════════════════════════════════════════════ */
function ProductsGrid() {
  const hubs = [
    {
      icon: '📣', name: 'Marketing Hub', tag: '®', points: ['Attract and convert the right leads.', 'Run campaigns, personalize content, and track it all.'],
    },
    {
      icon: '💼', name: 'Sales Hub', tag: '®', points: ['Generate quality leads and close deals, faster.', 'Automate prospecting, manage pipelines, and accelerate revenue growth.'],
    },
    {
      icon: '🎧', name: 'Service Hub', tag: '®', points: ['Streamline and scale support to serve customers faster.', 'Drive retention with actionable insights, customer health scores, and real-time usage data.'],
    },
    {
      icon: '✏️', name: 'Content Hub', tag: '™', points: ['Create content that clicks with your audience.', 'Build pages, publish content across channels, and stay on brand.'],
    },
  ];

  const bottomHubs = [
    { icon: '🗄️', name: 'Data Hub', tag: '™', points: ['Turn scattered data into unified intelligence.', 'Combine, clean, and activate your customer data across every team and tool.'] },
    { icon: '💰', name: 'Revenue Hub', tag: '™', points: ['Make it easy for customers to pay you.', 'Send quotes, collect payments, and manage subscriptions.'] },
  ];

  const extras = [
    { 
      icon: '🔄', 
      name: 'Smart CRM', 
      tag: '™', 
      points: [
        'All your customer data in one place.',
        'Keep your data clean, connected, and actionable.'
      ] 
    },
    { 
      icon: '✨', 
      name: 'Breeze', 
      tag: '™', 
      points: [
        'AI that works with you, and for you.',
        'Agents & assistants everywhere you need them.'
      ] 
    },
    {
      name: 'Small Business Bundle',
      points: [
        'The Starter edition of each product, at one low price.'
      ]
    },
    {
      name: 'AEO (Beta)',
      points: [
        'See where your brand shows up in AI results.',
        'Get recommendations to improve your visibility.'
      ]
    }
  ];

  return (
    <section id="products" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
          {/* left column */}
          <div className="animate-on-scroll md:sticky md:top-28">
            <p className="text-xs font-semibold text-dtv-muted mb-3 flex items-center gap-1.5">
              <span className="text-dtv-orange">✦</span> Powered by AI
            </p>
            <h2 className="font-serif text-dtv-dark text-3xl md:text-[2.8rem] leading-tight mb-6">
              Growing a business is hard. DTV makes it easier.
            </h2>
            <p className="text-dtv-muted text-base leading-relaxed mb-8">
              Disconnected tools and data slow you down. DTV connects everything — and everyone — in one place to make growing a business easier than you think.
            </p>
            <div className="flex gap-3">
              <a href="#" className="btn-orange">Get a demo</a>
              <a href="#" className="btn-outline-orange">Get started free</a>
            </div>
          </div>

          {/* right column – cards grid */}
          <div className="space-y-4 animate-on-scroll">
            {/* top 4 hubs */}
            <div className="grid sm:grid-cols-2 gap-4">
              {hubs.map((h) => (
                <HubCard key={h.name} hub={h} />
              ))}
            </div>
            {/* bottom 2 hubs */}
            <div className="grid sm:grid-cols-2 gap-4">
              {bottomHubs.map((h) => (
                <HubCard key={h.name} hub={h} />
              ))}
            </div>
            {/* extras */}
            <div className="grid sm:grid-cols-2 gap-4">
              {extras.map((h) => (
                <HubCard key={h.name} hub={h} light />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HubCard({ hub, light }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex items-center gap-2.5 mb-4">
        {hub.icon && <span className="text-2xl">{hub.icon}</span>}
        <h3 className="font-bold text-base text-dtv-dark">
          {hub.name}
          {hub.tag && <sup className="text-[11px] text-dtv-muted ml-0.5">{hub.tag}</sup>}
        </h3>
      </div>
      <ul className="space-y-3 mb-6">
        {hub.points.map((p, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-dtv-muted leading-relaxed">
            <Check className="text-dtv-orange mt-0.5 flex-shrink-0" />
            {p}
          </li>
        ))}
      </ul>
      <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-dtv-dark hover:text-dtv-orange transition-colors group-hover:gap-2.5 pt-4 border-t border-gray-100 border-dashed w-full">
        Learn more <ArrowRight />
      </a>
    </div>
  );
}

/* ══════════════════════════════════════════════
   AI AGENTS  (gradient background section)
   ══════════════════════════════════════════════ */
function AIAgents() {
  const [activeAgent, setActiveAgent] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const agents = [
    {
      name: 'Data Agent',
      desc: 'Get instant answers to custom questions about your customers.',
      visual: '🗄️',
      card: {
        title: 'Create a Smart Property',
        text: 'Desc: Rink community and Playlist visits. I want this to be a 1-bit',
        btn: 'Generate property',
      },
    },
    {
      name: 'Customer Agent',
      desc: 'Resolve 65% of your customer inquiries automatically.',
      visual: '💬',
      card: {
        title: 'HubBot',
        text: "Hi! 👋 I'm HubBot, an AI customer. How can I help you today?",
        user: 'Jane Doe',
      },
    },
    {
      name: 'Prospecting Agent',
      desc: 'Spot buying signals, source contacts, and launch personalized outreach — instantly.',
      visual: '🎯',
      card: {
        title: "Hi, I'm your prospecting agent.",
        text: "I'm here to help put your prospecting efforts on auto-pilot.",
        btn: 'View automations',
      },
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, agents.length]);

  return (
    <section className="py-24 md:py-32" style={{ background: 'linear-gradient(135deg, #FDE8DA 0%, #F9C4A8 30%, #F5A88A 60%, #EDA590 100%)' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-16 animate-on-scroll">
          <div className="md:max-w-md">
            <span className="text-dtv-orange text-2xl mb-3 block">✦</span>
            <h2 className="font-serif text-dtv-dark text-3xl md:text-[2.8rem] leading-tight mb-4">
              Built-in AI agents that work for you 24/7.
            </h2>
          </div>
          <div className="md:max-w-sm md:text-right flex flex-col items-start md:items-end gap-4">
            <a href="#" className="btn-outline-dark text-base">Explore Breeze Agents</a>
            <p className="text-dtv-dark/70 text-base leading-relaxed">
              <span className="font-semibold text-dtv-dark">Breeze Agents</span> are your always-on teammates. They can resolve over 65% of customer inquiries, accelerate your sales pipeline, and whip up quality content in no time.
            </p>
          </div>
        </div>

        {/* agent cards carousel with arrows */}
        <div className="relative flex items-center justify-center mb-8 animate-on-scroll group">
          <button 
            className="absolute left-0 md:left-12 z-20 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-dtv-dark hover:scale-110 transition-transform"
            onClick={() => setActiveAgent(prev => (prev - 1 + agents.length) % agents.length)}
          >
            <ChevronLeft />
          </button>

          <div className="flex items-end justify-center gap-4 md:gap-6 overflow-x-auto pb-4 w-full px-12 md:px-24">
            {agents.map((a, i) => (
              <div
                key={a.name}
                className={`flex-shrink-0 rounded-2xl transition-all duration-500 cursor-pointer ${
                  activeAgent === i
                    ? 'bg-white shadow-xl w-56 md:w-64 p-5 -translate-y-2 scale-105 z-10'
                    : 'bg-white/60 shadow-md w-48 md:w-56 p-4 opacity-70 hover:opacity-90'
                }`}
                onClick={() => {
                  setActiveAgent(i);
                  setIsPaused(true); // pause if user clicks manually
                }}
              >
                {/* card mock content */}
                <div className={`rounded-xl p-3 mb-3 ${activeAgent === i ? 'bg-dtv-orangeLight' : 'bg-gray-50'}`}>
                  {a.card.title && <p className="text-xs font-semibold text-dtv-dark mb-1">{a.card.title}</p>}
                  <p className="text-[10px] text-dtv-muted leading-relaxed">{a.card.text || a.card.user}</p>
                  {a.card.btn && (
                    <button className={`mt-2 text-[10px] font-semibold px-3 py-1 rounded ${activeAgent === i ? 'bg-dtv-orange text-white' : 'bg-gray-200 text-dtv-dark'}`}>
                      {a.card.btn}
                    </button>
                  )}
                </div>
                <h4 className="font-bold text-sm text-dtv-dark">{a.name}</h4>
                <p className="text-[11px] text-dtv-muted leading-relaxed mt-1">{a.desc}</p>
                {activeAgent === i && (
                  <a href="#" className="inline-flex items-center gap-1 text-[11px] font-bold text-dtv-dark mt-2 underline underline-offset-2 decoration-dtv-dark">
                    Learn more
                  </a>
                )}
              </div>
            ))}
          </div>

          <button 
            className="absolute right-0 md:right-12 z-20 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-dtv-dark hover:scale-110 transition-transform"
            onClick={() => setActiveAgent(prev => (prev + 1) % agents.length)}
          >
            <ChevronRight />
          </button>
        </div>

        {/* pagination dot */}
        <div className="flex justify-center mt-2">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 rounded-full bg-white/60 hover:bg-white shadow-sm flex items-center justify-center text-dtv-dark text-[10px] transition-colors"
          >
            {isPaused ? '▶' : '❚❚'}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   INTEGRATIONS
   ══════════════════════════════════════════════ */
function Integrations() {
  const tools = ['📊 Zapier', '📧 Mailchimp', '💬 Slack', '📋 Notion', '🛒 Shopify', '📱 WhatsApp', '📈 Google Analytics', '🗂️ Salesforce', '💳 Stripe', '📝 Jira', '☁️ AWS', '🔗 HubSpot'];
  return (
    <section className="py-20 md:py-28 bg-white border-t border-gray-100">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center animate-on-scroll">
          <div>
            <h2 className="font-serif text-dtv-dark text-3xl md:text-[2.5rem] leading-tight mb-4">
              Works with the tools you already use.<br />
              <span className="text-dtv-orange font-semibold">2,000+</span> integrations.
            </h2>
            <a href="#" className="inline-flex items-center gap-1 text-base font-semibold text-dtv-dark underline underline-offset-4 decoration-dtv-dark hover:text-dtv-orange transition-colors mt-3">
              See all app integrations
            </a>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            {tools.map((t) => (
              <div key={t} className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-dtv-dark shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   CASE STUDIES
   ══════════════════════════════════════════════ */
function CaseStudies() {
  const [tab, setTab] = useState('Enterprise');
  const tabs = ['Enterprise', 'Mid-Sized Business', 'Small Business'];

  const studies = {
    Enterprise: {
      quote: '"DTV took the time to understand our business needs fully. The pre-sales and subsequent support really stood out from the start. They committed to engage with us deeply and work side-by-side with us on the implementation. They\'ve since more than met this commitment."',
      author: 'Adam Wijaya',
      role: 'Director of Business Development, Unipart',
      stats: [
        { value: 12, label: 'months for the pipeline to grow from million to billions' },
        { value: 5, label: 'point increase in net promoter score (NPS)' },
      ],
    },
    'Mid-Sized Business': {
      quote: '"Since switching to DTV, our sales cycle has shortened by 40% and our team collaboration has improved dramatically. The platform is incredibly intuitive."',
      author: 'Sari Dewi',
      role: 'VP Sales, TechVentura Indonesia',
      stats: [
        { value: 40, label: '% shorter sales cycle' },
        { value: 3, label: 'x increase in qualified leads' },
      ],
    },
    'Small Business': {
      quote: '"As a small business, every tool matters. DTV gave us enterprise-grade capabilities at a price we could afford. Our customer retention is up 25%."',
      author: 'Rizky Pratama',
      role: 'Founder, Digital Karya',
      stats: [
        { value: 25, label: '% increase in customer retention' },
        { value: 10, label: 'hours saved per week on manual tasks' },
      ],
    },
  };

  const current = studies[tab];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8 animate-on-scroll">
          <div>
            <span className="text-xs font-semibold text-dtv-muted border border-gray-300 px-3 py-1 rounded-full">Case Studies</span>
            <h2 className="font-serif text-dtv-dark text-3xl md:text-[2.8rem] leading-tight mt-4">
              Remarkable results for<br />every size business.
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <a href="#" className="btn-outline-dark text-base">See all case studies</a>
            <p className="text-dtv-muted text-base max-w-sm md:text-right">Scale your business with DTV. The proof is in our customers' success.</p>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-10 animate-on-scroll">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3.5 text-base font-medium transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-dtv-dark text-dtv-dark'
                  : 'border-transparent text-dtv-muted hover:text-dtv-dark'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* case study card */}
        <div className="bg-dtv-cream rounded-3xl p-8 md:p-12 animate-on-scroll">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden bg-gray-200 aspect-[4/3]">
              <img src="/case-study.png" alt="Case study" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-dtv-dark/70 text-base md:text-lg leading-relaxed italic mb-6">
                {current.quote}
              </p>
              <p className="font-bold text-base text-dtv-dark">{current.author}</p>
              <p className="text-xs text-dtv-muted">{current.role}</p>
              <a href="#" className="inline-flex items-center gap-1 text-base font-bold text-dtv-dark underline underline-offset-4 decoration-dtv-dark mt-3 hover:text-dtv-orange transition-colors">
                Read full case study
              </a>
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 gap-8 mt-10 pt-8 border-t border-gray-200">
            {current.stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-5xl md:text-6xl text-dtv-dark mb-2">
                  <Counter target={s.value} />
                </div>
                <p className="text-dtv-muted text-sm md:text-base">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FOOTER CTA
   ══════════════════════════════════════════════ */
function FooterCTA() {
  return (
    <section className="py-16 md:py-20 bg-[#003A3A] text-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-[3rem] leading-tight mb-10">
          Make impossible growth feel impossibly easy,<br /> with DTV<span className="text-dtv-orange">.</span>
        </h2>
        <div className="flex gap-4">
          <a href="#" className="btn-orange px-8 py-3.5 text-base">Get a demo</a>
          <a href="#" className="btn-outline-orange !bg-transparent border-white !text-white hover:bg-white/10 px-8 py-3.5 text-base">Get started free</a>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════ */
function Footer() {
  const columns = {
    'Popular Features': ['Live Chat', 'Email Marketing', 'AI Email Writer', 'Chatbot Builder', 'Landing Pages', 'CRM'],
    'Free Tools': ['Website Grader', 'Make My Persona', 'Email Signature', 'Blog Ideas', 'Invoice Template', 'Marketing Plan'],
    'Company': ['About Us', 'Careers', 'Contact Us', 'Investor Relations', 'Sustainability', 'Press'],
    'Customers': ['Customer Support', 'Join a Local User Group', 'Developer Tools', 'DTV Community'],
    'Partners': ['App Marketplace', 'Solutions Directory', 'Affiliate Program', 'Become a Partner'],
  };

  return (
    <footer className="bg-dtv-dark text-white">
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {Object.entries(columns).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white/50 mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}><a href="#" className="text-white/70 text-xs hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom */}
        <div className="border-t border-white/10 pt-12 pb-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-0.5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 2v20h8c5.523 0 10-4.477 10-10S17.523 2 12 2H4z" fill="#FF4800"/>
              <circle cx="13" cy="12" r="3.5" fill="white"/>
            </svg>
            <span className="text-white font-black text-2xl tracking-tighter pt-0.5">TV</span>
          </div>
          <p className="text-white/60 text-xs">Copyright © 2026 Duta, Inc.</p>
          <div className="flex items-center gap-6 text-white/60 text-xs flex-wrap justify-center">
            <a href="#" className="hover:text-white transition-colors underline decoration-white/30 hover:decoration-white underline-offset-4">Legal Stuff</a>
            <a href="#" className="hover:text-white transition-colors underline decoration-white/30 hover:decoration-white underline-offset-4">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors underline decoration-white/30 hover:decoration-white underline-offset-4">Security</a>
            <a href="#" className="hover:text-white transition-colors underline decoration-white/30 hover:decoration-white underline-offset-4">Website Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════
   APP
   ══════════════════════════════════════════════ */
function App() {
  useScrollReveal();
  return (
    <div className="min-h-screen bg-white">
      <UtilityBar />
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <PlatformSection />
        <ProductsGrid />
        <AIAgents />
        <Integrations />
        <CaseStudies />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
