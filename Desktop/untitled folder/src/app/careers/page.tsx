"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, MapPin, Briefcase, ArrowRight } from "lucide-react";

const jobs = [
  { title: "Senior Frontend Engineer", dept: "Engineering", location: "Remote", type: "Full-time", desc: "We are looking for a Senior Frontend Engineer to help scale our product UI. You will work with React, Next.js, and TypeScript on high-impact projects that directly affect millions of users." },
  { title: "Product Designer", dept: "Design", location: "New York", type: "Full-time", desc: "Join our design team to craft elegant, intuitive experiences. You will own end-to-end product design from wireframes to polished prototypes and work closely with engineering." },
  { title: "Backend Systems Lead", dept: "Engineering", location: "London", type: "Full-time", desc: "Lead our backend infrastructure team building high-throughput, resilient systems handling millions of daily transactions." },
  { title: "Growth Marketing Manager", dept: "Marketing", location: "Remote", type: "Full-time", desc: "Drive growth initiatives across channels including performance marketing, SEO, and partnerships. Own acquisition metrics and work cross-functionally with product teams." },
];

const deptColors: Record<string, string> = {
  Engineering: "bg-[#1E3A8A]/30 text-[#60A5FA] border-[#1E40AF]",
  Design: "bg-violet-900/30 text-violet-400 border-violet-800",
  Marketing: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
};

export default function Careers() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="pt-40 pb-20 w-full min-h-screen bg-transparent relative overflow-hidden">
      <div className="ambient-orb w-[50vw] h-[50vw] bg-[#2563EB]/07 top-1/4 right-0 blur-[120px]" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mb-20"
        >
          <span className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4 block">We&apos;re Hiring</span>
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 text-[#FFFFFF]">
            Join the <span className="blue-gradient-text italic pr-4">Movement.</span>
          </h1>
          <p className="text-2xl text-[#737373] font-medium leading-relaxed max-w-2xl">
            Shape the future of commerce and logistics with a team of relentless innovators.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {["Remote-first", "Equity Package", "Health Coverage", "Learning Budget"].map((perk) => (
            <div key={perk} className="glass-card px-6 py-4 rounded-2xl text-center text-sm font-semibold text-[#A3A3A3]">
              {perk}
            </div>
          ))}
        </motion.div>

        <div className="max-w-5xl">
          <h3 className="text-3xl font-bold mb-10 text-[#FFFFFF] tracking-tight">Open Roles</h3>
          <div className="flex flex-col gap-5">
            {jobs.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card rounded-[2rem] overflow-hidden group border border-[#262626]"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-8 py-7 flex items-center justify-between text-left focus:outline-none"
                >
                  <div>
                    <h4 className="text-2xl font-bold tracking-tight text-[#FFFFFF] group-hover:text-[#2563EB] transition-colors duration-300">{job.title}</h4>
                    <div className="flex flex-wrap gap-3 mt-3 items-center">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${deptColors[job.dept] ?? "bg-[#171717] text-[#A3A3A3] border-[#262626]"}`}>{job.dept}</span>
                      <span className="flex items-center gap-1 text-[#737373] text-sm font-medium"><MapPin size={13} />{job.location}</span>
                      <span className="flex items-center gap-1 text-[#737373] text-sm font-medium"><Briefcase size={13} />{job.type}</span>
                    </div>
                  </div>
                  <div className={`p-3.5 rounded-2xl transition-all duration-400 flex-shrink-0 ml-4 ${openIndex === i ? "blue-gradient-btn text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)]" : "bg-[#171717] text-[#737373] group-hover:bg-[#2563EB]/10 group-hover:text-[#2563EB]"}`}>
                    {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 border-t border-[#262626]">
                        <p className="mb-8 text-lg text-[#737373] leading-relaxed pt-6">{job.desc}</p>
                        <motion.button
                          whileHover={{ scale: 1.03, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-8 py-4 blue-gradient-btn text-white rounded-2xl font-bold shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.45)] transition-all duration-400"
                        >
                          Apply Now <ArrowRight size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
