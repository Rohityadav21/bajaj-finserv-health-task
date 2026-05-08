"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const values = [
  { title: "Innovation", text: "Pushing boundaries to build the future of commerce." },
  { title: "Excellence", text: "Delivering world-class experiences at every touchpoint." },
  { title: "Community", text: "Empowering local businesses and creators to thrive." },
  { title: "Speed", text: "Moving fast without breaking trust or quality." },
];

export default function Culture() {
  return (
    <div className="pt-40 pb-20 w-full min-h-screen relative z-10 bg-transparent">
      <div className="ambient-orb w-[60vw] h-[40vh] bg-[#2563EB]/07 top-0 left-1/2 -translate-x-1/2 blur-[120px]" />

      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-24 relative z-10"
        >
          <span className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4 block">Who We Are</span>
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 text-[#FFFFFF]">
            Our <span className="blue-gradient-text italic pr-4">Culture.</span>
          </h1>
          <p className="text-2xl text-[#737373] font-medium leading-relaxed max-w-3xl">
            We are a collective of creators, engineers, and visionaries building the next generation of commerce.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32 relative z-10">
          {/* Wide card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-2 glass-card p-12 rounded-[2.5rem] relative overflow-hidden group min-h-[400px] flex flex-col justify-end border border-[#262626]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/05 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#2563EB]/08 rounded-full blur-[80px] group-hover:bg-[#2563EB]/16 transition-opacity duration-700" />
            <h3 className="text-5xl font-bold tracking-tighter mb-6 relative z-10 text-[#FFFFFF]">Driven by Impact</h3>
            <p className="text-[#737373] text-xl relative z-10 max-w-2xl leading-relaxed">
              We measure our success by the positive change we bring to local economies and individual lives. Every feature we ship is designed to empower.
            </p>
          </motion.div>

          {/* Accent card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white p-12 rounded-[2.5rem] flex flex-col justify-between group hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(37,99,235,0.4)] transition-all duration-500 min-h-[400px]"
          >
            <h3 className="text-4xl font-bold tracking-tighter mb-4">Open Positions</h3>
            <div className="flex justify-between items-end">
              <span className="text-8xl font-black tracking-tighter text-white/90">42</span>
              <Link href="/careers">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md group-hover:bg-white/30 transition-colors cursor-pointer">
                  <ArrowUpRight className="group-hover:rotate-45 transition-transform w-8 h-8" />
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Value cards */}
          {values.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card p-10 rounded-[2.5rem] group border border-[#262626]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center mb-6">
                <div className="w-4 h-4 rounded-md bg-[#2563EB]/60" />
              </div>
              <h4 className="text-2xl font-bold tracking-tighter mb-3 text-[#FFFFFF] group-hover:text-[#2563EB] transition-colors">{val.title}</h4>
              <p className="text-[#737373] leading-relaxed">{val.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Marquee */}
        <div className="w-full overflow-hidden flex whitespace-nowrap mb-20 relative py-10 border-y border-[#262626] bg-[#050505]/80">
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            className="flex gap-12 items-center text-[8rem] font-black tracking-tighter uppercase marquee-text"
          >
            <span className="hover:text-[#2563EB]/15 transition-colors">BUILD THE FUTURE</span>
            <span className="marquee-divider">*</span>
            <span className="hover:text-[#2563EB]/15 transition-colors">INNOVATE DAILY</span>
            <span className="marquee-divider">*</span>
            <span className="hover:text-[#2563EB]/15 transition-colors">STAY HUNGRY</span>
            <span className="marquee-divider">*</span>
            <span className="hover:text-[#2563EB]/15 transition-colors">BUILD THE FUTURE</span>
            <span className="marquee-divider">*</span>
            <span className="hover:text-[#2563EB]/15 transition-colors">INNOVATE DAILY</span>
            <span className="marquee-divider">*</span>
            <span className="hover:text-[#2563EB]/15 transition-colors">STAY HUNGRY</span>
            <span className="marquee-divider">*</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
