import { useState, useEffect, useRef } from "react";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(73);
  const navRef = useRef<HTMLElement>(null);
  const navInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update nav height when it changes
  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        const height = rect.height;
        if (height > 0) {
          setNavHeight(height);
        }
      }
    };

    // Initial measurement
    updateNavHeight();

    // Update when mobile menu state changes (in case nav changes)
    if (mobileMenuOpen) {
      // Small delay to ensure DOM has updated
      const timeoutId = setTimeout(updateNavHeight, 10);
      return () => clearTimeout(timeoutId);
    }

    // Also update on resize and scroll
    const handleUpdate = () => {
      requestAnimationFrame(updateNavHeight);
    };

    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, { passive: true });
    
    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate);
    };
  }, [scrolled, mobileMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Timeline", href: "#timeline" },
    { label: "Projects", href: "#projects" },
    { label: "Blog", href: "#blog" },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div ref={navInnerRef} className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#"
          className="font-mono text-lg font-bold tracking-tight hover:text-accent transition-colors"
        >
          AS.
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button - Animated Hamburger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="md:hidden relative w-10 h-10 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg transition-all duration-300"
          style={{ zIndex: 100 }}
          aria-label="Toggle menu"
          type="button"
        >
          {/* Glow effect background */}
          <span
            className={`absolute inset-0 rounded-lg bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              mobileMenuOpen ? "opacity-100" : ""
            }`}
          />
          
          {/* Hamburger Icon Container */}
          <span className="relative w-6 h-5 flex flex-col justify-between z-10">
            {/* Top line */}
            <span
              className={`block h-0.5 w-full bg-foreground rounded-full origin-center transition-all duration-500 ease-in-out ${
                mobileMenuOpen
                  ? "rotate-45 translate-y-[10px] bg-accent"
                  : "bg-foreground group-hover:bg-accent"
              }`}
            />
            {/* Middle line */}
            <span
              className={`block h-0.5 w-full bg-foreground rounded-full origin-center transition-all duration-500 ease-in-out ${
                mobileMenuOpen
                  ? "opacity-0 scale-0"
                  : "opacity-100 scale-100 group-hover:bg-accent"
              }`}
            />
            {/* Bottom line */}
            <span
              className={`block h-0.5 w-full bg-foreground rounded-full origin-center transition-all duration-500 ease-in-out ${
                mobileMenuOpen
                  ? "-rotate-45 -translate-y-[10px] bg-accent"
                  : "bg-foreground group-hover:bg-accent"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Backdrop overlay - only when menu is open */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed left-0 right-0 bottom-0 bg-black/40 backdrop-blur-sm z-[55]"
            style={{
              top: `${navHeight}px`,
              animation: "fadeIn 0.3s ease-out forwards",
              opacity: 0,
            }}
          />

          {/* Mobile Navigation */}
          <div
            className="md:hidden fixed left-0 right-0 bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-xl z-[60]"
            style={{
              top: `${navHeight}px`,
              bottom: '0',
              minHeight: `calc(100vh - ${navHeight}px)`,
              maxHeight: `calc(100vh - ${navHeight}px)`,
              boxShadow: "0 20px 60px -15px rgba(0, 0, 0, 0.3)",
              animation: "slideDownFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              transform: "translateY(-20px)",
              opacity: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background pattern */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--foreground) / 0.2) 1px, transparent 0)`,
                backgroundSize: "40px 40px",
                animation: "fadeIn 0.8s ease-out 0.3s forwards",
                opacity: 0,
              }}
            />

            {/* Decorative gradient orbs */}
            <div
              className="absolute top-20 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
              style={{
                animation: "fadeInScaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards",
                opacity: 0,
                transform: "scale(0.8)",
              }}
            />
            <div
              className="absolute bottom-20 left-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl"
              style={{
                animation: "fadeInScaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards",
                opacity: 0,
                transform: "scale(0.8)",
              }}
            />

            {/* Menu items container */}
            <div className="relative z-10 h-full overflow-y-auto">
              <ul className="flex flex-col px-6 py-8 space-y-2">
                {navItems.map((item, index) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={handleNavClick}
                      className="group relative block overflow-hidden rounded-xl"
                      style={{
                        animation: `slideInRightFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100 + 200}ms forwards`,
                        opacity: 0,
                        transform: "translateX(30px)",
                      }}
                    >
                      {/* Background card */}
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 rounded-xl border border-accent/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Content */}
                      <div className="relative flex items-center justify-between px-6 py-4">
                        <span className="relative z-10 text-xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                          <span className="relative inline-block">
                            {item.label}
                            {/* Animated underline */}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-accent/50 group-hover:w-full transition-all duration-500 ease-out" />
                          </span>
                        </span>
                        
                        {/* Arrow indicator */}
                        <span className="relative z-10 text-accent/40 group-hover:text-accent group-hover:translate-x-2 transition-all duration-300 text-lg">
                          →
                        </span>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-accent/0 group-hover:bg-accent/5 blur-xl transition-all duration-500 -z-10" />
                    </a>
                  </li>
                ))}
              </ul>

              {/* Footer decoration */}
              <div
                className="px-6 py-6"
                style={{
                  animation: "slideUpFadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards",
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
              >
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Navigate my story
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navigation;
