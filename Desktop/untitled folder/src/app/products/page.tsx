"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const products = [
  {
    id: "erp-solution",
    name: "ERP Solution",
    tagline: "Simplify and Manage Your Entire Business",
    description:
      "Our ERP software helps businesses streamline daily operations through one centralized platform.",
    features: [
      "Inventory Management",
      "Sales & Purchase Tracking",
      "HR & Payroll",
      "Accounting & Finance",
      "Customer Management",
      "Reports & Analytics",
      "Role-Based Access",
      "Cloud-Based System",
    ],
    desc: "Simplify and Manage Your Entire Business.",
    accent: "from-[#2563EB]/08 to-[#60A5FA]/04",
    border: "group-hover:border-[#2563EB]/30",
    shadow: "group-hover:shadow-[0_20px_60px_rgba(37,99,235,0.15)]",
    dot: "bg-[#2563EB]",
  },
  {
    id: "wapex-whatsapp-crm",
    name: "Wapex – WhatsApp CRM",
    tagline: "Convert Conversations Into Customers",
    description:
      "Wapex is our advanced WhatsApp CRM platform that helps businesses manage leads, automate customer communication, and improve response time directly on WhatsApp.",
    features: [
      "WhatsApp Lead Management",
      "Automated Replies",
      "Team Inbox",
      "Broadcast Campaigns",
      "Customer Follow-Ups",
      "Sales Pipeline Tracking",
      "Real-Time Notifications",
      "Smart Response Templates",
    ],
    desc: "Convert Conversations Into Customers",
    accent: "from-[#7C3AED]/06 to-[#60A5FA]/04",
    border: "group-hover:border-[#7C3AED]/30",
    shadow: "group-hover:shadow-[0_20px_60px_rgba(124,58,237,0.12)]",
    dot: "bg-[#7C3AED]",
  },
  {
    id: "ai-chatbot-solutions",
    name: "AI Chatbot Solutions",
    tagline: "Intelligent Chatbots for Smarter Customer Support",
    description:
      "Our customizable AI chatbots help businesses automate customer interactions across websites, WhatsApp, and other platforms.",
    features: [
      "24/7 Customer Support",
      "Instant Query Resolution",
      "Lead Collection & Qualification",
      "Appointment Booking",
      "Product Recommendations",
      "Multi-Language Support",
      "Custom Workflow Automation",
      "Human Agent Handover",
    ],
    desc: "Intelligent Chatbots for Smarter Customer Support.",
    accent: "from-[#0891B2]/06 to-[#60A5FA]/04",
    border: "group-hover:border-[#0891B2]/30",
    shadow: "group-hover:shadow-[0_20px_60px_rgba(8,145,178,0.12)]",
    dot: "bg-[#0891B2]",
  },
  {
    id: "wapex-whatsapp-crm",
    name: "AI Calling Agent",
    tagline: "Convert Conversations Into Customers",
    description:
      "Our AI Calling Agent helps businesses automate inbound and outbound calling processes using natural and intelligent voice conversations.",
    features: [
      "Automated Customer Calls",
      "Lead Qualification Calls",
      "Appointment Reminders",
      "Support & Query Handling",
      "Survey & NPS Collection",
      "Voice-Based Surveys",
      "AI Voice Conversations",
      "Available 24/7",
    ],

    desc: "AI-Powered Voice Agents That Talk Like Humans",
    accent: "from-[#059669]/06 to-[#60A5FA]/04",
    border: "group-hover:border-[#059669]/30",
    shadow: "group-hover:shadow-[0_20px_60px_rgba(5,150,105,0.12)]",
    dot: "bg-[#059669]",
  },
];

export default function Products() {
  const [activeProduct, setActiveProduct] = useState<(typeof products)[number] | null>(null);

  useEffect(() => {
    if (!activeProduct) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProduct(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeProduct]);

  return (
    <div className="pt-40 pb-20 w-full min-h-screen bg-transparent relative overflow-hidden">
      {/* Ambient */}
      <div className="ambient-orb w-full h-[50vh] bg-gradient-to-b from-[#050505] to-transparent top-0 left-0 blur-0 opacity-80 rounded-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mb-24"
        >
          <span className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4 block">Our Products</span>
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 text-[#FFFFFF]">
            One Platform <span className="blue-gradient-text italic pr-4">Endless Possibilities.</span>
          </h1>
          <p className="text-2xl text-[#737373] font-medium leading-relaxed max-w-2xl">
            Innovative software solutions that simplify workflows, enhance productivity, and scale with your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((prod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.93 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className={`group relative h-[420px] rounded-[2.5rem] overflow-hidden glass-card px-10 py-10 md:px-12 md:py-12 flex flex-col justify-between cursor-pointer border border-[#262626] transition-all duration-600 ${prod.border} ${prod.shadow}`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${prod.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <div className="relative z-10 flex items-start justify-between">
                <div />
                <div className={`w-3 h-3 rounded-full ${prod.dot} opacity-60 group-hover:opacity-100 transition-opacity shadow-[0_0_24px_rgba(96,165,250,0.35)]`} />
              </div>

              <div className="relative z-10 flex flex-1 flex-col justify-end">
                <div className="max-w-[22rem] flex flex-col gap-5">
                  <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-[#FFFFFF] group-hover:text-[#FFFFFF] transition-colors duration-500">
                    {prod.name}
                  </h3>
                  <p className="text-lg md:text-xl text-[#737373] leading-relaxed group-hover:text-[#A3A3A3] transition-colors duration-500">
                    {prod.desc}
                  </p>
                  <motion.button
                    type="button"
                    onClick={() => setActiveProduct(prod)}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group/button inline-flex w-fit items-center gap-2 font-bold text-[#FFFFFF] bg-[#0F172A]/40 border border-[#2F5EFF]/30 px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(37,99,235,0.12)] hover:shadow-[0_16px_42px_rgba(37,99,235,0.26)] transition-all duration-500 backdrop-blur-md"
                  >
                    <span className="text-[#EAF2FF] group-hover/button:text-white transition-colors">Explore Product</span>
                    <ArrowRight size={18} className="text-[#60A5FA] group-hover/button:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {activeProduct && (
            <motion.div
              key={activeProduct.id}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 bg-black/55 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setActiveProduct(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl max-h-[88vh] overflow-hidden rounded-[2rem] border border-[#3B82F6]/30 bg-white/8 backdrop-blur-2xl shadow-[0_24px_90px_rgba(37,99,235,0.28)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[#60A5FA]/10 pointer-events-none" />
                <div className="absolute -top-24 left-1/2 h-48 w-80 -translate-x-1/2 rounded-full bg-[#60A5FA]/20 blur-3xl pointer-events-none" />

                <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-[#93C5FD]">Product Preview</p>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-black tracking-tighter text-white">
                      {activeProduct.name}
                    </h3>
                    <div className="mt-4 h-px w-24 bg-gradient-to-r from-[#60A5FA] to-transparent" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveProduct(null)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/80 hover:bg-white/12 hover:text-white transition-colors"
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>

                <div className="relative max-h-[calc(88vh-88px)] overflow-y-auto px-5 py-6 sm:px-6">
                  <div className="rounded-[1.5rem] border border-[#60A5FA]/20 bg-[#0B1220]/40 p-6 sm:p-8 min-h-[260px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <p className="text-sm font-semibold tracking-[0.3em] uppercase text-[#93C5FD]">

                    </p>
                    <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#D1D5DB] max-w-2xl">
                      {activeProduct.description}
                    </p>

                    <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#60A5FA] shadow-[0_0_18px_rgba(96,165,250,0.6)]" />
                      <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Features</h4>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeProduct.features?.length ? (
                        activeProduct.features.map((feature) => (
                          <div
                            key={feature}
                            className="group flex items-start gap-3 rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#60A5FA]/30 hover:bg-white/8 hover:shadow-[0_14px_34px_rgba(37,99,235,0.14)]"
                          >
                            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#60A5FA]/12 text-[#93C5FD] transition-transform duration-300 group-hover:scale-105">
                              <CheckCircle2 size={16} />
                            </div>
                            <span className="text-sm sm:text-[0.95rem] leading-relaxed text-[#E5E7EB]">
                              {feature}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm sm:text-[0.95rem] leading-relaxed text-[#E5E7EB]">
                          Features coming soon.
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 text-center"
        >

        </motion.div>
      </div>
    </div>
  );
}
