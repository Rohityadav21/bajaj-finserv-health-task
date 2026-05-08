"use client";

import { motion } from "framer-motion";
import { 
  LayoutGrid, 
  MessageSquare, 
  Bot, 
  PhoneCall, 
  Workflow,
  Sparkles,
  Gauge,
  CircleUserRound,
  Headset,
  ShieldCheck
} from "lucide-react";

const services = [
  {
    title: "ERP Solutions",
    desc: "Streamline operations with a unified system built for modern businesses.",
    icon: LayoutGrid,
  },
  {
    title: "Wapex – WhatsApp CRM",
    desc: "Manage leads, chats, and follow-ups from one clean communication hub.",
    icon: MessageSquare,
  },
  {
    title: "AI Chatbots",
    desc: "Deliver instant customer support with intelligent, always-on chat automation.",
    icon: Bot,
  },
  {
    title: "AI Calling Agents",
    desc: "Automate sales and support calls with smart voice-based workflows.",
    icon: PhoneCall,
  },
  {
    title: "Business Automation Tools",
    desc: "Reduce manual work with connected workflows and smart automation.",
    icon: Workflow,
  },
];

const features = [
  {
    title: "Smart & Scalable Solutions",
    icon: Sparkles,
  },
  {
    title: "Modern Technology",
    icon: Gauge,
  },
  {
    title: "User-Friendly Platforms",
    icon: CircleUserRound,
  },
  {
    title: "Reliable Support",
    icon: Headset,
  },
  {
    title: "AI-Powered Automation",
    icon: ShieldCheck,
  },
];

export default function AboutUs() {
  return (
    <div className="pt-40 pb-20 w-full min-h-screen bg-transparent relative overflow-hidden">
      {/* Ambient background */}
      <div className="ambient-orb w-[60vw] h-[60vw] bg-[#2563EB]/06 top-0 right-0 blur-[150px]" />
      <div className="ambient-orb w-[40vw] h-[40vw] bg-[#60A5FA]/05 bottom-0 left-0 blur-[100px]" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <span className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4 block">
            About Us
          </span>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#FFFFFF] leading-none">
            Building <span className="blue-gradient-text italic">Smarter</span> Business Solutions.
          </h1>

          <p className="text-xl md:text-2xl text-[#737373] mt-8 max-w-3xl leading-relaxed font-medium">
            Hineet Tech is a product-based technology company focused on building scalable
            digital solutions that help businesses automate operations, improve customer
            communication, and grow faster with AI-powered technology.
          </p>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-32"
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              What We Offer
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{ y: -6 }}
                className="glass-card rounded-[2.5rem] border border-[#262626] p-10 transition-all duration-500 hover:border-[#2563EB]/40 hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)] group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#171717] border border-[#262626] flex items-center justify-center mb-8 group-hover:bg-[#2563EB]/10 transition-colors duration-500">
                  <Icon className="text-[#2563EB]" size={26} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {title}
                </h3>

                <p className="text-[#737373] leading-relaxed text-lg">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-32"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-12">
            Why Choose Us
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map(({ icon: Icon, title }) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.03, y: -4 }}
                className="glass-card rounded-[2rem] border border-[#262626] p-8 flex flex-col items-start hover:border-[#2563EB]/40 transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#171717] border border-[#262626] flex items-center justify-center mb-6 group-hover:bg-[#2563EB]/10 transition-colors duration-500">
                  <Icon className="text-[#2563EB]" size={24} />
                </div>

                <h3 className="text-xl font-bold text-white leading-tight">
                  {title}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-40 text-center max-w-4xl mx-auto"
        >
          <div className="p-[1px] rounded-[3rem] bg-gradient-to-r from-transparent via-[#2563EB]/30 to-transparent">
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-[3rem] py-16 px-8 md:px-16 border border-[#262626]">
              <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                At Hineet Tech, we believe technology should make business
                <span className="blue-gradient-text italic"> simpler</span>,
                faster, and more efficient.
              </h3>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}