"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

const contactInfo = [
  { icon: MapPin, label: "HeadQuarter", value: "3-CH-1, Prabhat Nagar, Sector 5, Hiran Magri, Udaipur - 313001, Rajasthan" },
  { icon: Mail, label: "General Inquiries", value: "hineettechprivatelimited@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 9664134872" },
];

export default function Contact() {
  return (
    <div className="pt-40 pb-20 w-full min-h-screen bg-transparent relative overflow-hidden">
      {/* Ambient */}
      <div className="ambient-orb w-[60vw] h-[60vw] bg-[#2563EB]/06 top-0 right-0 blur-[150px]" />
      <div className="ambient-orb w-[40vw] h-[40vw] bg-[#60A5FA]/05 bottom-0 left-0 blur-[100px]" />

      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-16 relative z-10">
        {/* Left: Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="md:w-1/2"
        >
          <span className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4 block">
            Say Hello
          </span>
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 text-[#FFFFFF]">
            Let&apos;s <span className="blue-gradient-text italic pr-4">Connect.</span>
          </h1>
          <p className="text-2xl text-[#737373] font-medium leading-relaxed mb-16 max-w-md">
            Have a question, partnership proposal, or just want to say hi? We&apos;d love to hear from you.
          </p>

          <div className="space-y-8">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[#171717] border border-[#262626] flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-[#2563EB]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2563EB] mb-1 tracking-wide uppercase">{label}</h4>
                  <p className="text-[#737373] text-lg leading-relaxed whitespace-pre-line">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="flex gap-4 mt-12">
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/company/hineet-tech-pvt-ltd/" },
                  { label: "Instagram", href: "https://www.instagram.com/hineet.tech?igsh=NnpleXFnYjkycmt0&utm_source=qr" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="px-5 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#262626] text-sm font-semibold text-[#A3A3A3] hover:border-[#2563EB]/40 hover:text-[#2563EB] hover:shadow-[0_4px_16px_rgba(37,99,235,0.12)] transition-all duration-300 pointer-events-auto relative z-50"
                  >
                    {social.label}
                  </a>
                ))}
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="md:w-1/2"
        >
          <div className="glass-card p-10 rounded-[2.5rem] border border-[#262626] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <h2 className="text-2xl font-bold text-[#FFFFFF] mb-8 tracking-tight">Send us a message</h2>
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#737373] uppercase tracking-widest">First Name</label>
                  <input
                    type="text"
                    className="input-white w-full rounded-2xl px-5 py-4 text-base"
                    placeholder="John"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#737373] uppercase tracking-widest">Last Name</label>
                  <input
                    type="text"
                    className="input-white w-full rounded-2xl px-5 py-4 text-base"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#737373] uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  className="input-white w-full rounded-2xl px-5 py-4 text-base"
                  placeholder="john@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#737373] uppercase tracking-widest">Subject</label>
                <input
                  type="text"
                  className="input-white w-full rounded-2xl px-5 py-4 text-base"
                  placeholder="How can we help?"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#737373] uppercase tracking-widest">Message</label>
                <textarea
                  rows={5}
                  className="input-white w-full rounded-2xl px-5 py-4 text-base resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-5 mt-2 blue-gradient-btn text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(37,99,235,0.35)] hover:shadow-[0_16px_48px_rgba(37,99,235,0.5)] transition-all duration-500"
              >
                <Send size={20} />
                Send Message
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
