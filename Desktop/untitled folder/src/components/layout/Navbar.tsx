"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  MessageSquare,
  LayoutGrid,
  Bot,
  PhoneCall,
  Workflow,
  Sparkles,
  Gauge,
  CircleUserRound,
  Headset,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/utils/cn";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Culture", href: "/culture" },
  { name: "Careers", href: "/careers" },
  { name: "Product", href: "/products" },
  { name: "Contact", href: "/contact" },
  { name: "About Us", href: "/about-us" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out",
          scrolled
            ? "py-3 glass-navbar shadow-[0_4px_30px_rgba(15,23,42,0.06)]"
            : "py-6 bg-transparent"
        )}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex items-center gap-3 text-xl font-bold tracking-tighter text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300"
            >
              <Image
                src="/logo.png"
                alt="HINEET TECH logo"
                width={36}
                height={36}
                priority
                className="h-9 w-9 rounded-full object-cover"
              />
              HINEET TECH <span className="text-xs font-semibold tracking-widest text-[var(--text-muted)] ml-1 uppercase">Private Limited</span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors group py-1",
                    isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
                  )}
                >
                  {link.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-[1.5px] bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full transition-all duration-400",
                      isActive ? "w-full opacity-100" : "w-0 group-hover:w-full opacity-100"
                    )}
                  />
                </Link>
              );
            })}

            <Link href="/contact">
            
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative z-50 p-2 text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-[var(--bg-primary)]/97 backdrop-blur-3xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {/* Ambient orb */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[var(--accent-primary)]/08 blur-[100px] pointer-events-none" />

            {/* Logo in mobile menu */}
            <div className="mb-8 flex flex-col items-center text-center">
              <Image
                src="/logo.png"
                alt="HINEET TECH logo"
                width={56}
                height={56}
                priority
                className="h-14 w-14 rounded-full object-cover"
              />
              <div className="mt-4 text-3xl font-bold tracking-tighter text-[var(--text-primary)]">HINEET TECH</div>
              <div className="text-xs font-semibold tracking-widest text-[var(--text-muted)] uppercase mt-1">Private Limited</div>
            </div>

            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-4xl font-bold tracking-tighter transition-colors",
                    pathname === link.href
                      ? "blue-gradient-text"
                      : "text-[var(--text-primary)] hover:text-[var(--accent-primary)]"
                  )}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const offers = [
  {
    name: "ERP Solutions",
    description: "Streamline operations with a unified system built for modern businesses.",
    icon: LayoutGrid,
  },
  {
    name: "Wapex – WhatsApp CRM",
    description: "Manage leads, chats, and follow-ups from one clean communication hub.",
    icon: MessageSquare,
  },
  {
    name: "AI Chatbots",
    description: "Deliver instant customer support with intelligent, always-on chat automation.",
    icon: Bot,
  },
  {
    name: "AI Calling Agents",
    description: "Automate sales and support calls with smart voice-based workflows.",
    icon: PhoneCall,
  },
  {
    name: "Business Automation Tools",
    description: "Reduce manual work with connected workflows and smart automation.",
    icon: Workflow,
  },
];

const reasons = [
  {
    name: "Smart & Scalable Solutions",
    description: "Flexible products designed to grow as your business expands.",
    icon: Sparkles,
  },
  {
    name: "Modern Technology",
    description: "Future-ready systems built with clean architecture and current best practices.",
    icon: Gauge,
  },
  {
    name: "User-Friendly Platforms",
    description: "Simple, elegant interfaces that teams can adopt quickly and confidently.",
    icon: CircleUserRound,
  },
  {
    name: "Reliable Support",
    description: "Responsive support that helps keep your operations running smoothly.",
    icon: Headset,
  },
  {
    name: "AI-Powered Automation",
    description: "Use intelligence-driven automation to improve speed and accuracy.",
    icon: ShieldCheck,
  },
];

function FeatureCard({
  name,
  description,
  icon: Icon,
}: {
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      className="group rounded-3xl border border-red-100 bg-white p-6 shadow-[0_10px_30px_rgba(239,68,68,0.06)] transition-all hover:shadow-[0_18px_45px_rgba(239,68,68,0.12)]"
    >
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-zinc-900">{name}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{description}</p>
    </motion.div>
  );
}

export function AboutUsSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
            Hineet Tech
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Modern solutions for a simpler, smarter business.
          </h2>
          <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg">
            A premium suite of AI, CRM, and automation products designed to help businesses move faster.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          <div>
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">What We Offer</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                Powerful products built for growth
              </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {offers.map((item) => (
                <FeatureCard key={item.name} {...item} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Why Choose Us</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                A premium partner for modern teams
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {reasons.map((item) => (
                <FeatureCard key={item.name} {...item} />
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-red-100 bg-gradient-to-b from-white to-red-50 px-6 py-10 text-center shadow-[0_12px_40px_rgba(239,68,68,0.08)] sm:px-10">
            <p className="mx-auto max-w-3xl text-lg font-medium leading-8 text-zinc-800 sm:text-xl">
              At Hineet Tech, we believe technology should make business simpler, faster, and more efficient.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
