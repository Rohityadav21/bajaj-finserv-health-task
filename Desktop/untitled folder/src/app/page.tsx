"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Scene from "@/components/canvas/Scene";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const storytellingCards = [
  {
    title: "Automate. Manage. Scale.",
    desc: "Streamline business operations and boost productivity with smart automation solutions.",

  },
  {
    title: "Connect. Engage. Convert.",
    desc: "Build stronger customer relationships through AI-powered communication platforms.",

  },
  {
    title: "Smart. Secure. Scalable.",
    desc: "Modern technology solutions designed to grow securely with your business.",

  },
  {
    title: "Build. Automate. Grow.",
    desc: "Powerful digital products that help businesses operate smarter and scale faster.",

  },
];

const stats = [
  { value: "10M+", label: "Happy Users" },
  { value: "50+", label: "Cities" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "App Rating" },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".story-card");
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.to(cards, {
          xPercent: -100 * (cards.length - 2),
          ease: "none",
          scrollTrigger: {
            trigger: scrollSectionRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (cards.length - 2),
            end: () => "+=" + (scrollSectionRef.current?.offsetWidth ?? 0),
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.to(cards, {
          xPercent: -100 * (cards.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: scrollSectionRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (cards.length - 1),
            end: () => "+=" + (scrollSectionRef.current?.offsetWidth ?? 0),
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-transparent">
      <Scene />

      {/* ─── HERO ─── */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Ambient orbs */}
        <div className="ambient-orb w-[60vw] h-[60vw] md:w-[32vw] md:h-[32vw] bg-[#2563EB]/10 top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
        <div className="ambient-orb w-[40vw] h-[40vw] md:w-[24vw] md:h-[24vw] bg-[#60A5FA]/08 bottom-1/3 right-1/4" />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="z-10 max-w-6xl w-full flex flex-col items-center"
        >


          <h1 className="hero-heading text-[#FFFFFF] mb-8">
            Where Innovation{" "}
            <br />
            <span className="blue-gradient-text italic pr-4">Meets Execution.</span>
          </h1>

          <p className="text-xl md:text-2xl text-[#737373] max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Powerful platforms designed to simplify operations, automate workflows, and create seamless customer experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 px-10 py-5 blue-gradient-btn rounded-2xl font-bold text-white shadow-[0_8px_32px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.5)] transition-all duration-500 text-lg"
              >
                Discover More
                <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 px-10 py-5 bg-[#0A0A0A] border border-[#262626] rounded-2xl font-bold text-[#A3A3A3] hover:border-[#2563EB]/30 hover:shadow-[0_8px_32px_rgba(37,99,235,0.1)] transition-all duration-500 text-lg shadow-sm"
              >
                Contact us
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">Scroll to explore</span>
          <div className="w-[1px] h-14 bg-gradient-to-b from-[#2563EB]/50 to-transparent" />
        </motion.div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="relative z-10 w-full border-y border-[#262626] bg-[#0A0A0A]/70 backdrop-blur-xl py-12 px-6">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black tracking-tighter blue-gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-[#737373] font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── HORIZONTAL SCROLL STORYTELLING ─── */}
      <section
        ref={scrollSectionRef}
        className="relative h-screen w-full overflow-hidden flex items-center z-10 border-b border-[#262626] bg-[#050505]/80 backdrop-blur-2xl"
      >
        <div className="absolute top-16 left-12 md:left-24 z-20">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#FFFFFF]">
            Our <span className="blue-gradient-text">Expertise</span>
          </h2>
        </div>

        <div className="flex py-32 w-[400vw] md:w-[200vw] items-stretch">
          {storytellingCards.map((card, i) => (
            <div
              key={i}
              className="story-card w-screen md:w-[50vw] px-4 md:px-12 flex-shrink-0 flex items-stretch"
            >
              <div className="glass-card p-12 md:p-20 rounded-[2.5rem] w-full max-w-5xl group relative overflow-hidden flex flex-col">
                {/* Hover glow */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#2563EB]/08 rounded-full blur-[60px] group-hover:bg-[#2563EB]/16 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#2563EB]/0 to-transparent group-hover:via-[#2563EB]/40 transition-all duration-700" />

                <span className="text-sm font-bold tracking-widest text-[#94A3B8] uppercase mb-6 block">{card.num}</span>
                <h3 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 relative z-10 text-[#FFFFFF] group-hover:text-glow-blue transition-all duration-500">
                  {card.title}
                </h3>
                <p className="text-2xl md:text-3xl text-[#737373] max-w-3xl relative z-10 leading-relaxed flex-1">
                  {card.desc}
                </p>
                <Link href="/products">
                  <div className="mt-14 flex items-center gap-4 text-[#2563EB] text-lg font-bold relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 cursor-pointer">
                    <span>Discover More</span>
                    <ArrowRight size={24} />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <div className="min-h-screen flex items-center justify-center relative z-10 bg-[#0A0A0A] border-t border-[#262626] overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-radial-blue-center opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full grid-overlay opacity-60 pointer-events-none" />

        <div className="text-center max-w-4xl px-6 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-6"
          >
            Join the movement
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-[#FFFFFF]"
          >
            Ready to{" "}
            <span className="blue-gradient-text">dive in?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-[#737373] mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join millions of users experiencing the future of unified commerce and delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >

          </motion.div>
        </div>
      </div>
    </div>
  );
}
