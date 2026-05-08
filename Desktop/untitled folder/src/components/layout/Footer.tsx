import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--surface-secondary)] text-[var(--text-primary)] py-24 px-6 lg:px-12 mt-32 relative overflow-hidden border-t border-[var(--glass-border)] backdrop-blur-xl z-[60] pointer-events-auto">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/40 to-transparent" />
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-radial-blue-center opacity-60 pointer-events-none" />
      {/* Subtle blue orb top-right */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-[var(--accent-primary)]/06 blur-[100px] pointer-events-none" />

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="mb-8 block group">
            <div className="text-2xl font-bold tracking-tighter text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300">
              HINEET TECH
            </div>
            <div className="text-xs font-semibold tracking-widest text-[var(--text-muted)] uppercase mt-1">
              Private Limited
            </div>
          </Link>
          <p className="text-[var(--text-secondary)] max-w-sm text-lg leading-relaxed">
            A connected ecosystem of technology, commerce, culture, and convenience, designed for the future.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest mb-6 text-[var(--text-muted)]">Connect</h4>
              <ul className="space-y-4">
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/company/hineet-tech-pvt-ltd/" },
                  { label: "Instagram", href: "https://www.instagram.com/hineet.tech?igsh=NnpleXFnYjkycmt0&utm_source=qr" },
                ].map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noreferrer noopener" : undefined}
                      className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors font-medium pointer-events-auto relative z-[60]"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
          </ul>
        </div>
      </div>

      <div className="container mx-auto mt-20 pt-8 border-t border-[var(--glass-border)] flex flex-col md:flex-row items-center justify-between relative z-10">
        <p className="text-[var(--text-muted)] text-sm">
          &copy; {new Date().getFullYear()} HINEET TECH Private Limited. All rights reserved.
        </p>
        <div className="flex gap-6 mt-6 md:mt-0 text-sm text-[var(--text-muted)]">
          <Link href="#" className="hover:text-[var(--accent-primary)] transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-[var(--accent-primary)] transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
