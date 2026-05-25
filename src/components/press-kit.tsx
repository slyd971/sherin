'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { Artist, ArtistSocialLink, ArtistStreamingLink } from '@/types/artist';

type Variation = 'luxury' | 'street' | 'futuristic';
type ThemeMode = 'dark' | 'bw';

type ArtistPageProps = {
  artist: Artist;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

function getPrimaryEmbed(links: ArtistStreamingLink[]) {
  return links.find((link) => link.embedUrl) ?? null;
}

function getSocialUrl(artist: Artist, platform: ArtistSocialLink['platform']) {
  return artist.socials.find((social) => social.platform === platform)?.url ?? '#';
}

function getArtistPath(artist: Artist, path: string) {
  if (artist.slug === 'martina') return path;
  const [basePath, hash = ''] = path.split('#');
  const normalizedBase = basePath || '/';
  const separator = normalizedBase.includes('?') ? '&' : '?';
  return `${normalizedBase}${separator}client=${artist.slug}${hash ? `#${hash}` : ''}`;
}

function buildNavItems() {
  return [
    { label: 'Listen', href: '/listen' },
    { label: 'À propos', href: '#about' },
    { label: 'Vidéos', href: '#video' },
    { label: 'Galerie', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];
}

function SectionIntro({
  eyebrow,
  title,
  body,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  body: string;
  align?: 'left' | 'center';
}) {
  return (
    <motion.div
      className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: smoothEase }}
    >
      <p className="mb-4 text-[0.72rem] uppercase tracking-[0.45em] text-white/55">{eyebrow}</p>
      <h2 className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-7 text-white/75 sm:text-lg">{body}</p>
    </motion.div>
  );
}

function BioQuote({
  artistName,
  quote,
  compact = false,
}: {
  artistName: string;
  quote: string;
  compact?: boolean;
}) {
  return (
    <figure
      className={
        compact
          ? 'relative mt-5 border-l-2 border-violet-300/70 pl-5'
          : 'relative mt-8 max-w-2xl overflow-hidden rounded-lg border border-violet-300/20 bg-[linear-gradient(135deg,rgba(124,58,237,0.16),rgba(217,70,239,0.09),rgba(255,255,255,0.045))] px-6 py-6 shadow-2xl shadow-violet-950/20 backdrop-blur-sm sm:px-8 sm:py-7'
      }
    >
      {!compact && (
        <>
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-violet-300 via-fuchsia-300 to-violet-500" />
          <div className="absolute right-5 top-3 text-7xl font-black leading-none text-violet-100/[0.08]">
            &ldquo;
          </div>
        </>
      )}
      <blockquote
        className={
          compact
            ? 'text-base font-semibold leading-7 text-white/88 italic'
            : 'relative text-xl font-black leading-snug tracking-[-0.03em] text-white sm:text-2xl'
        }
      >
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption
        className={
          compact
            ? 'mt-3 text-[0.68rem] uppercase tracking-[0.3em] text-violet-100/48'
            : 'mt-5 text-[0.68rem] font-bold uppercase tracking-[0.32em] text-violet-100/55'
        }
      >
        {artistName} · Artist statement
      </figcaption>
    </figure>
  );
}

function AnimatedKpiValue({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^([+]?)(\d+(?:[.,]\d+)?)(\s*[kKmM]?)$/);

    if (!match) {
      setDisplay(value);
      return;
    }

    const prefix = match[1] ?? '';
    const target = Number.parseFloat(match[2].replace(',', '.'));
    const suffix = match[3].toUpperCase();
    const duration = 1350;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(`${prefix}${current}${suffix}`);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <>{display}</>;
}

function KpiSection({ artist }: { artist: Artist }) {
  if (artist.highlights.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 border-y border-white/10 bg-[#070816] px-5 py-6 sm:px-8 lg:px-12">
      <motion.div
        className="mx-auto grid max-w-7xl gap-3 text-center sm:grid-cols-3 sm:text-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.09,
            },
          },
        }}
      >
        {artist.highlights.map((highlight, index) => (
          <motion.article
            key={highlight.label}
            className="relative flex min-h-[9.5rem] w-full min-w-0 flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(96,112,255,0.14),rgba(184,85,255,0.09),rgba(255,255,255,0.035))] px-5 py-5 shadow-[0_20px_70px_rgba(5,6,20,0.24)] sm:px-6"
            variants={{
              hidden: { opacity: 0, y: 24, scale: 0.96 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.75, delay: index * 0.03, ease: smoothEase }}
            whileHover={{ y: -3 }}
          >
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-violet-100/62">
              {highlight.label}
            </p>
            <p className="mt-3 max-w-full bg-gradient-to-r from-white via-violet-100 to-fuchsia-200 bg-clip-text text-3xl font-black leading-none text-transparent [overflow-wrap:anywhere] sm:text-4xl">
              <AnimatedKpiValue value={highlight.value} />
            </p>
            <p className="mt-3 text-xs leading-5 text-violet-50/64 sm:text-sm">
              {highlight.detail}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

function YouTubePoster({
  videoId,
  title,
  className,
  onClick,
  fallbackSrc,
}: {
  videoId: string;
  title: string;
  className: string;
  onClick: () => void;
  fallbackSrc: string;
}) {
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);

  return (
    <button type="button" onClick={onClick} className="absolute inset-0 h-full w-full">
      <Image
        src={src}
        alt={title}
        fill
        sizes="(max-width: 1280px) 100vw, 33vw"
        className={className}
        onError={() => {
          if (src.includes('maxresdefault')) {
            setSrc(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
            return;
          }

          setSrc(fallbackSrc);
        }}
      />
    </button>
  );
}

function HeroSocialBand({ artist }: { artist: Artist }) {
  const allLinks = [
    ...artist.socials.map((s) => ({ platform: s.platform, handle: s.handle, url: s.url })),
    ...artist.streamingLinks.map((s) => ({ platform: s.platform, handle: s.label, url: s.url })),
  ];

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.3, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-0 overflow-x-auto px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-8">
        {allLinks.map((link, i) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-none items-center border-r border-white/8 px-5 py-4 transition-colors hover:bg-white/5 last:border-r-0 sm:px-8"
          >
            <HeroPlatformIcon platform={link.platform} />
          </a>
        ))}
      </div>
    </motion.div>
  );
}

function HeroPlatformIcon({ platform }: { platform: string }) {
  const cls = 'h-[24px] w-[24px] transition-transform duration-200 group-hover:scale-110';
  if (platform === 'Instagram') return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <defs>
        <linearGradient id="ig-hero" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEDA75" />
          <stop offset="0.28" stopColor="#FA7E1E" />
          <stop offset="0.52" stopColor="#D62976" />
          <stop offset="0.74" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="5.2" stroke="url(#ig-hero)" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="4" stroke="url(#ig-hero)" strokeWidth="1.9" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="url(#ig-hero)" />
    </svg>
  );
  if (platform === 'Threads') return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <circle cx="12" cy="12" r="10" fill="#fff" />
      <path
        d="M16.45 11.4c-.12-3.15-1.86-5.08-4.58-5.08-2.68 0-4.68 1.9-4.68 5.58 0 3.88 2.18 5.78 5 5.78 2.1 0 3.7-1 4.4-2.85l-1.72-.58c-.48 1.18-1.34 1.78-2.62 1.78-1.92 0-3.06-1.42-3.06-4.1 0-2.62 1.04-3.98 2.7-3.98 1.58 0 2.42 1.02 2.62 3.02-.6-.14-1.24-.2-1.9-.18-2.26.08-3.55 1.14-3.55 2.78 0 1.46 1.1 2.5 2.76 2.5 1.62 0 2.84-.9 3.38-2.42.78.48 1.22 1.16 1.22 2.02 0 1.8-1.55 3.38-4.2 3.38-3.2 0-5.25-2.25-5.25-6.1 0-3.92 2.02-6.2 5.02-6.2 2.74 0 4.38 1.66 4.72 4.28l1.72-.42Zm-2.15 1.4c-.28 1.08-1.05 1.72-2.12 1.72-.74 0-1.22-.38-1.22-.98 0-.76.66-1.22 1.78-1.26.55-.02 1.08.06 1.56.22v.3Z"
        fill="#000"
      />
    </svg>
  );
  if (platform === 'TikTok') return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <path d="M15.9 4.1a5.1 5.1 0 0 0 3.7 3.3v3.2a8.1 8.1 0 0 1-3.8-1.1v5.8a6.1 6.1 0 1 1-5.4-6.1v3.4a2.8 2.8 0 1 0 2 2.7V4.1h3.5Z" fill="#25F4EE" opacity="0.95" />
      <path d="M16.9 3.2a5.1 5.1 0 0 0 3.7 3.3v3.2a8.1 8.1 0 0 1-3.8-1.1v5.8a6.1 6.1 0 1 1-5.4-6.1v3.4a2.8 2.8 0 1 0 2 2.7V3.2h3.5Z" fill="#FE2C55" opacity="0.9" />
      <path d="M16.35 3.65a5.1 5.1 0 0 0 3.7 3.3v3.2a8.1 8.1 0 0 1-3.8-1.1v5.8a6.1 6.1 0 1 1-5.4-6.1v3.4a2.8 2.8 0 1 0 2 2.7V3.65h3.5Z" fill="#fff" />
    </svg>
  );
  if (platform === 'YouTube') return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <path d="M22.3 6.5a2.8 2.8 0 0 0-2-2C18.6 4 12 4 12 4s-6.6 0-8.3.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.2 12a29 29 0 0 0 .5 5.5 2.8 2.8 0 0 0 2 2C5.4 20 12 20 12 20s6.6 0 8.3-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-5.5 29 29 0 0 0-.5-5.5Z" fill="#FF0000" />
      <path d="M10 15.4V8.6l6 3.4-6 3.4Z" fill="#fff" />
    </svg>
  );
  if (platform === 'Spotify') return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <circle cx="12" cy="12" r="10" fill="#1DB954" />
      <path d="M7.4 9c3.2-1 7.2-.8 9.8 1" stroke="#06130B" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8 12c2.6-.8 5.8-.6 8 .8" stroke="#06130B" strokeWidth="1.55" strokeLinecap="round" />
      <path d="M8.5 14.8c2.1-.6 4.4-.45 6.3.6" stroke="#06130B" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
  if (platform === 'Apple Music') return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <defs>
        <linearGradient id="apple-music-hero" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FA233B" />
          <stop offset="1" stopColor="#FB5C74" />
        </linearGradient>
      </defs>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="url(#apple-music-hero)" />
      <path d="M15.6 7.4v7.7a2.05 2.05 0 1 1-1.1-1.82V9.7l-5.1 1.05v5.45a2.05 2.05 0 1 1-1.1-1.82V9.55c0-.46.32-.86.77-.95l5.5-1.14c.53-.11 1.03.3 1.03.84Z" fill="#fff" />
    </svg>
  );
  if (platform === 'Deezer') return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <rect x="3" y="14" width="3.2" height="3.2" fill="#FF0092" />
      <rect x="7.3" y="10.8" width="3.2" height="3.2" fill="#FF6B00" />
      <rect x="7.3" y="14" width="3.2" height="3.2" fill="#FF6B00" />
      <rect x="11.6" y="7.6" width="3.2" height="3.2" fill="#F7E000" />
      <rect x="11.6" y="10.8" width="3.2" height="3.2" fill="#00C7F2" />
      <rect x="11.6" y="14" width="3.2" height="3.2" fill="#00C7F2" />
      <rect x="15.9" y="4.4" width="3.2" height="3.2" fill="#A238FF" />
      <rect x="15.9" y="7.6" width="3.2" height="3.2" fill="#A238FF" />
      <rect x="15.9" y="10.8" width="3.2" height="3.2" fill="#00D95F" />
      <rect x="15.9" y="14" width="3.2" height="3.2" fill="#00D95F" />
    </svg>
  );
  if (platform === 'Amazon Music') return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <path d="M5.2 6.2h13.6v11.6H5.2z" fill="#111827" />
      <path d="M8 10.2c.85-.8 2.1-1.25 3.55-1.25 2.2 0 3.55 1.15 3.55 3.15v4.1h-2.25v-.84c-.56.65-1.35 1-2.38 1-1.55 0-2.65-.9-2.65-2.25 0-1.5 1.18-2.3 3.25-2.3h1.7v-.12c0-.8-.52-1.25-1.55-1.25-.83 0-1.6.3-2.22.82L8 10.2Z" fill="#00A8E1" />
      <path d="M10.25 14c0 .48.42.8 1.05.8.72 0 1.28-.34 1.48-.88v-.58h-1.36c-.78 0-1.17.2-1.17.66Z" fill="#111827" />
      <path d="M7.1 18.4c2.8 1.45 6.4 1.52 9.45.12" stroke="#00A8E1" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16.9 17.25l1.65.35-.75 1.5" stroke="#00A8E1" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (platform === 'iTunes') return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <defs>
        <linearGradient id="itunes-hero" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7B61FF" />
          <stop offset="0.5" stopColor="#E044FF" />
          <stop offset="1" stopColor="#FF2D55" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9.5" fill="url(#itunes-hero)" />
      <path d="M15.2 7.7v6.5a1.8 1.8 0 1 1-1-.6V9.8l-4.1.8v4.8a1.8 1.8 0 1 1-1-.6V9.6c0-.36.25-.68.61-.75l4.7-.92c.42-.08.79.24.79.67Z" fill="#fff" />
    </svg>
  );
  if (platform === 'iHeartRadio') return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <path d="M12 20s-7-4.6-8.8-9.1C1.9 7.6 3.8 4.6 7 4.6c1.8 0 3.2 1 4 2.3.8-1.3 2.2-2.3 4-2.3 3.2 0 5.1 3 3.8 6.3C17 15.4 12 20 12 20Z" fill="#C6002B" />
      <path d="M8.6 10.2a3.8 3.8 0 0 1 6.8 0M7.2 8.7a5.8 5.8 0 0 1 9.6 0" stroke="#fff" strokeWidth="1.15" strokeLinecap="round" />
      <circle cx="12" cy="11.7" r="1.15" fill="#fff" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#8FA8FF" strokeWidth="1.8" className={cls}>
      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12a7 7 0 0 1 13.2-3.2M19 12A7 7 0 0 1 5.8 15.2" strokeLinecap="round" />
    </svg>
  );
}

function ContactLogo({
  kind,
}: {
  kind: 'email' | 'instagram' | 'management' | 'press';
}) {
  if (kind === 'email') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-[#f1d3a1]">
        <path
          d="M3 6h18v12H3zM4 7l8 6 8-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-[#f1d3a1]">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17" cy="7.2" r="1.1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-[#f1d3a1]">
      <path
        d="M12 3 4 7v5c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10V7l-8-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9.5 11.5 11 13l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SiteHeader({ artist, prefixAnchors = false }: { artist: Artist; prefixAnchors?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = useMemo(() => buildNavItems(), []);

  const resolveHref = (href: string) =>
    getArtistPath(artist, href.startsWith('#') && prefixAnchors ? `/${href}` : href);

  useEffect(() => {
    document.documentElement.dataset.artistSlug = artist.slug;
  }, [artist.slug]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const close = () => setMobileMenuOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [mobileMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8 sm:pt-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-0 py-0 sm:px-6 lg:site-header-shell lg:rounded-full lg:border lg:border-white/15 lg:bg-black/35 lg:px-4 lg:py-3 lg:backdrop-blur-xl">
        <Link
          href={getArtistPath(artist, '/')}
          className="hidden text-sm font-black tracking-[0.35em] text-white uppercase lg:inline-flex"
        >
          {artist.stageName}
        </Link>
        <nav className="hidden flex-1 items-center justify-end gap-6 lg:flex">
          {navItems.map((item) => {
            const href = resolveHref(item.href);
            return href.startsWith('#') ? (
              <a
                key={item.href}
                href={href}
                className="nav-link text-xs font-medium tracking-[0.28em] text-white uppercase transition-colors hover:text-[#f1d3a1]"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={href}
                className="nav-link text-xs font-medium tracking-[0.28em] text-white uppercase transition-colors hover:text-[#f1d3a1]"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="ml-auto flex h-10 w-10 items-center justify-center lg:hidden"
          aria-label="Toggle navigation"
        >
          <span className="space-y-1.5">
            <span className="block h-px w-4 bg-white/90 transition-transform" />
            <span className="block h-px w-4 bg-white/90 transition-transform" />
            <span className="block h-px w-4 bg-white/90 transition-transform" />
          </span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu-shell mx-auto mt-2 max-w-7xl rounded-[1.5rem] border border-white/15 bg-black/70 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const href = resolveHref(item.href);
              return href.startsWith('#') ? (
                <a
                  key={item.href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="theme-chip rounded-[0.95rem] border border-white/10 bg-white/6 px-3 py-2.5 text-[0.68rem] font-medium tracking-[0.2em] text-white uppercase"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="theme-chip rounded-[0.95rem] border border-white/10 bg-white/6 px-3 py-2.5 text-[0.68rem] font-medium tracking-[0.2em] text-white uppercase"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

function ArtistHero({ artist, initialTheme }: ArtistPageProps & { initialTheme?: ThemeMode }) {
  const { scrollYProgress } = useScroll();
  const [currentVariation, setCurrentVariation] = useState<Variation>('luxury');
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme ?? 'dark');
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -70]);
  const y2 = useTransform(scrollYProgress, [0, 0.25], [0, -35]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.76]);
  const isBW = themeMode === 'bw';
  const streetImage = artist.gallery[1]?.src ?? artist.heroImage.src;
  const futuristicImage = artist.gallery[2]?.src ?? artist.heroImage.src;
  const heroImageClass =
    artist.slug === 'sherin'
      ? 'object-cover object-[center_22%] opacity-90'
      : 'object-cover object-center opacity-90';

  useEffect(() => {
    if (initialTheme) return; // theme forced by route, ignore localStorage
    const savedTheme = window.localStorage.getItem('site-theme');

    if (savedTheme === 'bw' || savedTheme === 'dark') {
      const frame = window.requestAnimationFrame(() => {
        setThemeMode(savedTheme as ThemeMode);
      });

      return () => window.cancelAnimationFrame(frame);
    }
  }, [initialTheme]);

  useEffect(() => {
    document.documentElement.dataset.siteTheme = themeMode;
    document.documentElement.dataset.artistSlug = artist.slug;
    window.localStorage.setItem('site-theme', themeMode);
  }, [artist.slug, themeMode]);


  const renderLuxuryMinimal = () => (
    <motion.section
      className="hero-shell hero-luxury relative flex min-h-screen w-full items-center overflow-hidden bg-[#0d0907]"
      style={{ opacity }}
    >
      <Image
        src={artist.heroImage.src}
        alt={artist.heroImage.alt}
        fill
        priority
        quality={90}
        className={heroImageClass}
        sizes="100vw"
      />
      <div className="hero-overlay-primary absolute inset-0 bg-[linear-gradient(180deg,rgba(22,14,10,0.14)_0%,rgba(20,14,12,0.24)_32%,rgba(10,8,8,0.76)_100%)]" />
      <div className="hero-overlay-secondary absolute inset-0 bg-[linear-gradient(90deg,rgba(16,10,8,0.44)_0%,rgba(30,22,18,0.06)_42%,rgba(14,10,10,0.4)_100%)]" />
      <div className="ambient-shift absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(231,199,153,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(167,104,72,0.22),transparent_30%),linear-gradient(135deg,rgba(95,63,40,0.18),transparent_55%)]" />
      <div className="hero-bottom-fade absolute inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-black via-black/55 to-transparent" />
      <div className="grain-overlay" />
      <div className="film-vignette" />
      <div className="paper-texture" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 lg:px-16">
        <div className="flex min-h-screen items-end pb-16 sm:pb-20 lg:pb-24">
          <div className="w-full max-w-5xl">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <div className="relative max-w-5xl">
                <motion.p
                  className="mb-4 text-[0.72rem] font-medium tracking-[0.5em] text-white/60 uppercase"
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                >
                  Press kit
                </motion.p>
                <motion.h1
                  className="relative z-10 text-6xl leading-[0.92] font-black tracking-[-0.08em] text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:text-8xl md:text-[9rem] lg:text-[12rem]"
                  style={{ y: y1 }}
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.15, ease: smoothEase }}
                >
                  {artist.stageName}
                </motion.h1>
              </div>

              <motion.div
                className="h-px w-28 bg-white/60"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}
                style={{ originX: 0 }}
              />

              <motion.div
                className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8"
                style={{ y: y2 }}
              >
                <motion.p
                  className="max-w-xl text-base leading-relaxed font-light text-white/82 md:text-xl lg:text-2xl"
                  initial={{ y: 22, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.75, ease: smoothEase }}
                >
                  {artist.tagline}
                </motion.p>
                <div className="hero-info-panel theme-panel max-w-full space-y-2 rounded-[1.25rem] bg-black/24 p-4 backdrop-blur-sm md:text-right">
                  <motion.p
                    className="text-sm font-medium tracking-[0.28em] text-white/70 uppercase sm:tracking-[0.35em] md:text-base"
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 1.0, ease: smoothEase }}
                  >
                    {artist.city} · {artist.country}
                  </motion.p>
                  <motion.p
                    className="max-w-[18rem] text-xs leading-6 tracking-[0.18em] text-white/55 uppercase sm:max-w-none sm:text-sm sm:tracking-[0.3em]"
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 1.1, ease: smoothEase }}
                  >
                    {artist.category} • {artist.genre}
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      <HeroSocialBand artist={artist} />
    </motion.section>
  );

  const renderStreetEnergy = () => (
    <motion.section
      className="hero-shell hero-street relative min-h-screen w-full overflow-hidden bg-[#120b09]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Image
        src={streetImage}
        alt={`${artist.stageName} visual street energy`}
        fill
        priority
        className="object-cover object-center opacity-88"
        sizes="100vw"
      />
      <div className="hero-overlay-primary absolute inset-0 bg-[linear-gradient(180deg,rgba(36,23,16,0.16),rgba(11,8,8,0.84))]" />
      <div className="hero-overlay-accent ambient-shift absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,130,84,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(241,210,166,0.1),transparent_28%),linear-gradient(125deg,rgba(120,83,54,0.16),transparent_55%)]" />
      <div className="grain-overlay" />
      <div className="film-vignette" />
      <div className="paper-texture" />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
        <div className="mx-auto w-full max-w-6xl px-8">
          <div className="flex min-h-screen items-center justify-center">
            <div className="max-w-3xl text-center">
              <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <motion.h1
                  className="relative text-6xl leading-none font-black tracking-tighter text-white md:text-9xl"
                  animate={{
                    textShadow: [
                      '0 0 0px rgba(241, 211, 161, 0)',
                      '0 0 20px rgba(241, 211, 161, 0.28)',
                      '0 0 0px rgba(241, 211, 161, 0)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                >
                  {artist.stageName}
                </motion.h1>
                <motion.div
                  className="mt-4 h-1 w-full bg-[#f1d3a1]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                  style={{ originX: 0.5 }}
                />
              </motion.div>

              <motion.div
                className="mt-8 space-y-3"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.p
                  className="text-xl font-bold tracking-wide text-white uppercase md:text-3xl"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                >
                  {artist.genre}
                </motion.p>
                <motion.p
                  className="text-lg font-black tracking-wider text-[#f1d3a1] uppercase md:text-2xl"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                >
                  {artist.city} • {artist.country}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <HeroSocialBand artist={artist} />
    </motion.section>
  );

  const renderFuturisticTech = () => (
    <motion.section
      className="hero-shell hero-futuristic relative min-h-screen w-full overflow-hidden bg-[#0b0908]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Image
        src={futuristicImage}
        alt={`${artist.stageName} visual futuristic`}
        fill
        priority
        className="object-cover object-center opacity-82 saturate-0"
        sizes="100vw"
      />
      <div className="hero-overlay-primary absolute inset-0 bg-[linear-gradient(180deg,rgba(34,22,15,0.12),rgba(7,5,5,0.86))]" />
      <div className="hero-overlay-accent ambient-shift absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(199,170,131,0.18),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(130,88,59,0.18),transparent_30%),linear-gradient(145deg,rgba(116,82,55,0.16),transparent_58%)]" />
      <div className="grain-overlay" />
      <div className="paper-texture" />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
        <div className="space-y-12 text-center">
          <motion.h1
            className="relative z-10 text-6xl leading-none font-black tracking-wider text-white md:text-9xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {artist.stageName}
          </motion.h1>
          <motion.div
            className="space-y-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.p
              className="text-lg tracking-widest text-[#f1d3a1] md:text-2xl"
              animate={{
                opacity: [1, 0.5, 1],
                textShadow: [
                  '0 0 0px rgba(241, 211, 161, 0)',
                  '0 0 10px rgba(241, 211, 161, 0.42)',
                  '0 0 0px rgba(241, 211, 161, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            >
              {`> ${artist.slug.toUpperCase()}.PRESSKIT`}
            </motion.p>
            <motion.p
              className="text-sm text-white md:text-lg"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            >
              {artist.shortBio}
            </motion.p>
          </motion.div>
        </div>
      </div>
      <HeroSocialBand artist={artist} />
    </motion.section>
  );

  const renderCurrentVariation = () => {
    switch (currentVariation) {
      case 'street':
        return renderStreetEnergy();
      case 'futuristic':
        return renderFuturisticTech();
      case 'luxury':
      default:
        return renderLuxuryMinimal();
    }
  };

  return (
    <>
      <SiteHeader artist={artist} />

      {renderCurrentVariation()}

      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-8 sm:right-8">
          {styleMenuOpen ? (
            <div className="style-panel mb-3 rounded-[1.5rem] border border-white/15 bg-black/72 p-3 backdrop-blur-2xl">
              <div className="mb-2 flex items-center gap-2">
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`theme-chip rounded-full px-3 py-2 text-[0.65rem] font-bold tracking-[0.24em] uppercase transition-colors ${
                    !isBW ? 'theme-chip-active' : ''
                  }`}
                >
                  Nuit
                </button>
                <button
                  onClick={() => setThemeMode('bw')}
                  className={`theme-chip rounded-full px-3 py-2 text-[0.65rem] font-bold tracking-[0.24em] uppercase transition-colors ${
                    isBW ? 'theme-chip-active' : ''
                  }`}
                >
                  N&amp;B
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentVariation('luxury')}
                  className={`theme-chip rounded-full px-3 py-2 text-[0.65rem] font-bold tracking-[0.24em] uppercase transition-colors ${
                    currentVariation === 'luxury' ? 'theme-chip-active' : ''
                  }`}
                >
                  Luxe
                </button>
                <button
                  onClick={() => setCurrentVariation('street')}
                  className={`theme-chip rounded-full px-3 py-2 text-[0.65rem] font-bold tracking-[0.24em] uppercase transition-colors ${
                    currentVariation === 'street' ? 'theme-chip-active' : ''
                  }`}
                >
                  Scène
                </button>
                <button
                  onClick={() => setCurrentVariation('futuristic')}
                  className={`theme-chip rounded-full px-3 py-2 text-[0.65rem] font-bold tracking-[0.24em] uppercase transition-colors ${
                    currentVariation === 'futuristic' ? 'theme-chip-active' : ''
                  }`}
                >
                  Futur
                </button>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setStyleMenuOpen((open) => !open)}
            className="style-toggle rounded-full border border-white/15 bg-black/72 px-4 py-3 text-[0.65rem] font-bold tracking-[0.24em] text-white uppercase backdrop-blur-2xl transition-colors hover:bg-black/84"
          >
            Style
          </button>
        </div>
      )}
    </>
  );
}

function AboutSection({ artist }: { artist: Artist }) {
  return (
    <section
      id="about"
      className="press-section section-about relative overflow-hidden border-t border-white/12 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,246,230,0.05),rgba(33,23,18,0.42)_58%,transparent)]" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(226,192,148,0.16),transparent_56%)] blur-2xl" />
      <div className="grain-overlay" />
      <div className="paper-texture" />
      <div className="warm-spotlight right-[-8rem] top-[12%]" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch lg:gap-10">
        <div className="flex flex-col justify-between gap-8 lg:gap-10">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.45em] text-white/55">L&apos;artiste</p>
            <h2 className="mt-4 max-w-xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
              À propos de {artist.stageName}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">{artist.longBio}</p>
            {artist.bioQuote && <BioQuote artistName={artist.stageName} quote={artist.bioQuote} />}
          </div>

          {/* KPIs hidden — to be re-enabled once data is confirmed */}
          {false && (
            <div className="grid gap-4 sm:grid-cols-3">
              {artist.highlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="theme-overlay-panel rounded-[1.5rem] border border-white/10 bg-black/22 p-5 backdrop-blur-md"
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/52">
                    {highlight.label}
                  </p>
                  <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-white">
                    {highlight.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/68">{highlight.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <motion.div
          className="relative min-h-[28rem] overflow-hidden rounded-[2rem]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <Image
            src={artist.gallery[0]?.src ?? artist.heroImage.src}
            alt={artist.gallery[0]?.alt ?? artist.heroImage.alt}
            fill
            className="object-cover object-[center_18%]"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
          <div className="theme-image-overlay absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-white/60">
              {artist.category} • {artist.genre}
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/75">{artist.shortBio}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PressReleaseSection({ artist }: { artist: Artist }) {
  if (!artist.pressRelease) {
    return null;
  }

  const release = artist.pressRelease;

  return (
    <section className="press-section section-release relative overflow-hidden border-t border-white/12 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,24,72,0.92),rgba(34,10,58,0.82)_48%,rgba(8,8,18,0.96))]" />
      <div className="ambient-shift absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,144,255,0.28),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(180,82,255,0.24),transparent_30%)]" />
      <div className="grain-overlay" />
      <div className="film-vignette" />

      <motion.article
        className="theme-panel relative z-10 mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.05] lg:grid-cols-[0.86fr_1.14fr]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.75, ease: smoothEase }}
      >
        <div className="relative min-h-[26rem] border-b border-white/10 lg:border-b-0 lg:border-r">
          <Image
            src={artist.gallery[2]?.src ?? artist.heroImage.src}
            alt={artist.gallery[2]?.alt ?? artist.heroImage.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
          <div className="theme-image-overlay absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="text-[0.72rem] uppercase tracking-[0.42em] text-white/60">
              {release.eyebrow}
            </p>
            <p className="mt-3 text-sm uppercase tracking-[0.24em] text-white/72">
              {release.locationDate}
            </p>
          </div>
        </div>

        <div className="theme-panel-subtle bg-black/24 p-6 sm:p-8 lg:p-10">
          <h2 className="text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
            {release.title}
          </h2>
          <p className="mt-6 text-base leading-7 text-white/82 sm:text-lg">{release.intro}</p>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/72 sm:text-base">
            {release.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <blockquote className="mt-7 border-l border-white/25 pl-5 text-lg leading-8 text-white sm:text-xl">
            “{release.quote}”
          </blockquote>
          <p className="mt-6 text-sm leading-7 text-white/68">{release.footer}</p>
        </div>
      </motion.article>
    </section>
  );
}

function WhoIsMartinaSection({ artist }: { artist: Artist }) {
  if (artist.slug !== 'martina') {
    return null;
  }

  const archives = [
    {
      n: 'N°01',
      src: '/martina/scene-1.jpeg',
      title: 'ISHA',
      date: '08 mars 2025',
      place: "194 rue d'Alésia, Paris 14e",
      kind: 'Exposition · Concert · DJ set',
      alt: 'Flyer ISHA by Martina',
      featured: true,
      offset: 0,
    },
    {
      n: 'N°02',
      src: '/martina/scene-2.jpeg',
      title: 'La Scène Émergente Festival',
      date: '19–20 avril 2025',
      place: 'Ground Control, Paris 12e',
      kind: 'Festival',
      alt: 'Flyer Ground Control',
      offset: 48,
    },
    {
      n: 'N°03',
      src: '/martina/scene-4.jpeg',
      title: 'Noctambule — Release Party',
      date: '03 novembre 2025',
      place: 'Péniche Antipode, Paris 19e',
      kind: 'Release party',
      alt: 'Flyer Noctambule Release Party',
      offset: 24,
    },
  ];

  return (
    <section className="identity" aria-labelledby="identity-title">
      <div className="identity__grain" aria-hidden="true" />

      <div className="identity__inner">
        <header className="identity__eyebrow">
          <span className="identity__eyebrow-label">Identité</span>
        </header>

        <div className="identity__grid">
          <div className="identity__text">
            <h2 id="identity-title" className="identity__title">
              Qui est
              <br />
              <em>Martina</em>
              <span className="identity__title-mark">?</span>
            </h2>

            <div className="identity__paragraphs">
              <p className="identity__lede">
                Originaire du <strong>19ᵉ arrondissement de Paris</strong>, Martina est une artiste
                dont la discipline s&apos;est construite très tôt sur scène.
              </p>

              <p>
                Formée par la danse et le théâtre dès l&apos;âge de 11 ans, elle développe une
                présence naturelle, une vraie conscience du corps et une approche performative qui
                irriguent aujourd&apos;hui tout son projet.
              </p>

              <div className="identity__rule" aria-hidden="true">
                <span>Vision</span>
              </div>

              <p>
                Après un premier cycle indépendant amorcé avec <em>« Pas si facile »</em>,
                plusieurs sorties et l&apos;EP exploratoire <em>« EGO »</em> en 2024, Martina affirme
                aujourd&apos;hui une identité plus profonde et exigeante.
              </p>

              <p>
                En renouant avec les <strong>racines afro-américaines de la house music</strong>,
                elle trouve enfin le langage de liberté, de spiritualité et de scène qu&apos;elle
                voulait transmettre.
              </p>
            </div>

            <dl className="identity__facts">
              <div>
                <dt>Origine</dt>
                <dd>Paris 19ᵉ</dd>
              </div>
              <div>
                <dt>Formation</dt>
                <dd>Danse & théâtre, dès 11 ans</dd>
              </div>
              <div>
                <dt>Dernier EP</dt>
                <dd>EGO · 2024</dd>
              </div>
              <div>
                <dt>Univers</dt>
                <dd>House · Performance · Scène</dd>
              </div>
            </dl>
          </div>

          <div className="identity__archives">
            <div className="identity__archives-head">
              <span className="identity__archives-label">Scènes</span>
            </div>

            <ul className="identity__archive-list">
              {archives.map((item, i) => (
                <li
                  key={item.n}
                  className={`archive ${item.featured ? 'archive--featured' : ''}`}
                  style={{
                    ['--i' as string]: i,
                    ['--offset' as string]: `${item.offset}px`,
                  }}
                >
                  <figure className="archive__fig">
                    <div className="archive__frame">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 900px) 90vw, 40vw"
                        className="archive__img"
                      />
                      {item.featured ? <span className="archive__badge">Pièce maîtresse</span> : null}
                    </div>

                    <figcaption className="archive__caption">
                      <div className="archive__caption-top">
                        <span className="archive__n">{item.n}</span>
                        <span className="archive__kind">{item.kind}</span>
                      </div>
                      <h3 className="archive__title">{item.title}</h3>
                      <div className="archive__meta">
                        <span>{item.date}</span>
                        <span className="archive__sep" aria-hidden="true">
                          ·
                        </span>
                        <span>{item.place}</span>
                      </div>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .identity {
          position: relative;
          background: #0b0b0d;
          color: #f6f1e9;
          padding: clamp(5rem, 9vw, 9rem) 0 clamp(5rem, 8vw, 8rem);
          overflow: hidden;
          font-family: var(--font-sans);
        }

        .identity__grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.06;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        }

        .identity__inner {
          position: relative;
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 3rem);
        }

        .identity__eyebrow {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.72rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          margin-bottom: 1.25rem;
        }

        .identity__eyebrow-num {
          color: #d4433a;
          font-weight: 500;
        }

        .identity__eyebrow-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(246, 241, 233, 0.42);
        }

        .identity__eyebrow-meta {
          margin-left: auto;
          color: rgba(246, 241, 233, 0.42);
        }

        .identity__grid {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 8fr);
          gap: clamp(3rem, 6vw, 6rem);
          align-items: start;
        }

        @media (max-width: 900px) {
          .identity__grid {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
        }

        .identity__title {
          font-family: var(--font-display);
          font-weight: 300;
          font-size: clamp(3.2rem, 6.5vw, 6rem);
          line-height: 0.92;
          letter-spacing: -0.02em;
          margin: 0 0 clamp(2rem, 3vw, 2.75rem);
        }

        .identity__title em {
          font-style: italic;
          font-weight: 400;
          position: relative;
        }

        .identity__title-mark {
          color: #d4433a;
          font-style: italic;
          margin-left: 0.1em;
        }

        .identity__paragraphs {
          max-width: 44ch;
          font-size: clamp(0.98rem, 1.05vw, 1.08rem);
          line-height: 1.65;
          color: rgba(246, 241, 233, 0.72);
        }

        .identity__paragraphs p {
          margin: 0 0 1.15rem;
        }

        .identity__lede {
          color: #f6f1e9;
          font-size: clamp(1.05rem, 1.15vw, 1.18rem);
        }

        .identity__paragraphs strong {
          color: #f6f1e9;
          font-weight: 500;
        }

        .identity__paragraphs em {
          font-style: italic;
          color: #f6f1e9;
          font-family: var(--font-display);
          font-weight: 400;
        }

        .identity__rule {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin: 2.25rem 0 1.5rem;
          font-size: 0.7rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(246, 241, 233, 0.42);
        }

        .identity__rule::before {
          content: '';
          flex: 0 0 28px;
          height: 1px;
          background: rgba(246, 241, 233, 0.42);
        }

        .identity__facts {
          margin: clamp(2.5rem, 4vw, 3.5rem) 0 0;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(246, 241, 233, 0.14);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem 2rem;
          max-width: 44ch;
        }

        .identity__facts dt {
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(246, 241, 233, 0.42);
          margin-bottom: 0.25rem;
        }

        .identity__facts dd {
          margin: 0;
          font-size: 0.95rem;
          color: #f6f1e9;
        }

        .identity__archives-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(246, 241, 233, 0.14);
          margin-bottom: 2rem;
          font-size: 0.7rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .identity__archives-label {
          color: #f6f1e9;
        }

        .identity__archives-count {
          color: rgba(246, 241, 233, 0.42);
        }

        .identity__archive-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1rem, 1.6vw, 1.5rem);
        }

        @media (max-width: 720px) {
          .identity__archive-list {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .identity__archive-list {
            grid-template-columns: 1fr;
          }
        }

        .archive {
          animation: rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: calc(var(--i) * 120ms + 200ms);
          transform: translateY(var(--offset, 0px));
        }

        @media (max-width: 720px) {
          .archive {
            animation-name: rise-flat;
          }
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(calc(var(--offset, 0px) + 18px));
          }
          to {
            opacity: 1;
            transform: translateY(var(--offset, 0px));
          }
        }

        @keyframes rise-flat {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .archive__fig {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .archive__frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #121215;
          border: 1px solid rgba(246, 241, 233, 0.14);
          transition:
            transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.4s ease;
        }

        .archive--featured .archive__frame {
          border-color: rgba(212, 67, 58, 0.18);
          box-shadow:
            0 0 0 1px rgba(212, 67, 58, 0.18),
            0 30px 60px -30px rgba(212, 67, 58, 0.22);
        }

        .archive__frame::after {
          content: '';
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.35);
          pointer-events: none;
        }

        .archive__img {
          object-fit: contain;
          transition:
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.6s ease;
          filter: saturate(1.05) contrast(1.02);
        }

        .archive:hover .archive__frame {
          transform: translateY(-4px);
          border-color: rgba(246, 241, 233, 0.3);
        }

        .archive--featured:hover .archive__frame {
          border-color: #d4433a;
        }

        .archive:hover .archive__img {
          transform: scale(1.02);
        }

        .archive__badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          z-index: 2;
          padding: 0.35rem 0.6rem;
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #f6f1e9;
          background: #d4433a;
          font-weight: 500;
        }

        .archive__caption {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .archive__caption-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.75rem;
          font-size: 0.68rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .archive__n {
          color: #d4433a;
          font-weight: 500;
        }

        .archive__kind {
          color: rgba(246, 241, 233, 0.42);
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .archive__title {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 400;
          font-size: clamp(1rem, 1.15vw, 1.15rem);
          line-height: 1.2;
          color: #f6f1e9;
          letter-spacing: -0.005em;
        }

        .archive__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: rgba(246, 241, 233, 0.72);
        }

        .archive__sep {
          color: rgba(246, 241, 233, 0.42);
        }
      `}</style>
    </section>
  );
}

function ListenHighlightSection({ artist }: ArtistPageProps) {
  const feature = getPrimaryEmbed(artist.streamingLinks);

  return (
    <section className="press-section section-spotify relative overflow-hidden border-t border-white/12 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,18,15,0.96),rgba(10,10,10,0.28))]" />
      <div className="ambient-shift absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(241,211,161,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(160,96,66,0.16),transparent_28%)]" />
      <div className="grain-overlay" />
      <div className="film-vignette" />
      <div className="warm-spotlight right-[-8rem] top-[-6rem]" />

      <motion.div
        className="theme-panel mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] shadow-[0_24px_90px_rgba(0,0,0,0.28)]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: smoothEase }}
      >
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="theme-panel-subtle relative flex flex-col justify-between border-b border-white/10 bg-[linear-gradient(180deg,rgba(15,12,11,0.5),rgba(15,12,11,0.18))] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-8">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.45em] text-white/55">Listen</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl lg:text-5xl">
                Écouter {artist.stageName}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
                {artist.description}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {artist.streamingLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="theme-chip inline-flex rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white"
                >
                  {link.platform}
                </a>
              ))}
              <Link
                href={getArtistPath(artist, '/listen')}
                className="theme-chip inline-flex rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white"
              >
                Tout écouter
              </Link>
            </div>
          </div>

          <div className="theme-panel-subtle relative bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.04))] p-4 sm:p-5 lg:p-6">
            <div className="theme-embed-shell overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/30 shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
              {feature?.embedUrl ? (
                <iframe
                  title={feature.label}
                  src={feature.embedUrl}
                  width="100%"
                  height="352"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="block"
                />
              ) : (
                <div className="relative h-[352px]">
                  <Image
                    src={artist.heroImage.src}
                    alt={artist.heroImage.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="theme-image-overlay absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function VideoSection({ artist }: { artist: Artist }) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  if (artist.videos.length === 0) {
    return null;
  }

  return (
    <section
      id="video"
      className="press-section section-video relative overflow-hidden border-t border-white/12 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,14,12,0.95),rgba(8,8,8,0.35))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(243,214,174,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(179,118,79,0.14),transparent_26%)]" />
      <div className="grain-overlay" />
      <div className="paper-texture" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Vidéos"
          title="Live et visuels"
          body={`Une sélection de vidéos pour découvrir ${artist.stageName} en mouvement, sur scène et dans son univers.`}
        />

        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 xl:grid-cols-3">
          {artist.videos.map((video, index) => (
            <motion.article
              key={video.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.06, ease: smoothEase }}
              className="theme-panel group grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {video.embedId && activeVideoId === video.embedId ? (
                  <iframe
                    className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.02]"
                    src={`https://www.youtube-nocookie.com/embed/${video.embedId}?autoplay=1&rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : video.embedId ? (
                  <YouTubePoster
                    videoId={video.embedId}
                    title={video.title}
                    onClick={() => setActiveVideoId(video.embedId ?? null)}
                    fallbackSrc={video.cover}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                ) : (
                  <Image
                    src={video.cover}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                )}
                <div className="theme-image-overlay pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />
                <div className="film-vignette" />
              </div>

              <div className="theme-overlay-panel border-t border-white/10 bg-black/88 p-4 backdrop-blur-md">
                <h3 className="text-xl font-black tracking-[-0.04em] text-white">{video.title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/75">{video.note}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ artist }: ArtistPageProps) {
  const previewImages = artist.gallery.slice(0, 4);

  return (
    <section
      id="gallery"
      className="press-section section-gallery relative overflow-hidden border-t border-white/12 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,14,13,0.94),rgba(10,10,10,0.2))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(233,198,154,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(155,98,66,0.14),transparent_24%)]" />
      <div className="grain-overlay" />
      <div className="film-vignette" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Galerie"
            title="Univers visuel"
            body={`Une sélection d'images pour découvrir l'identité visuelle et la présence de ${artist.stageName}.`}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: smoothEase }}
          >
            <Link
              href={getArtistPath(artist, '/gallery')}
              className="theme-chip inline-flex items-center rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-bold uppercase tracking-[0.26em] text-white transition-colors hover:bg-white/12"
            >
              Voir la galerie
            </Link>
          </motion.div>
        </div>

        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:mt-12 sm:gap-5 sm:pb-4 lg:grid lg:grid-cols-3 lg:overflow-x-visible lg:pb-0 xl:grid-cols-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {previewImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: smoothEase }}
              className="theme-panel group relative w-[78vw] snap-center flex-none overflow-hidden rounded-[1.75rem] border border-white/10 sm:w-[24rem] lg:w-auto"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 24rem, (max-width: 1280px) 33vw, 25vw"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ artist }: { artist: Artist }) {
  const contactInstagram =
    artist.slug === 'sherin'
      ? { handle: '@futur.mgmt', url: 'https://www.instagram.com/futur.mgmt/' }
      : {
          handle: artist.socials.find((social) => social.platform === 'Instagram')?.handle ?? '@artist',
          url: getSocialUrl(artist, 'Instagram'),
        };

  const contactItems = [
    {
      label: 'Booking',
      value: artist.bookingEmail,
      href: `mailto:${artist.bookingEmail}`,
      kind: 'email' as const,
    },
    artist.managementContact
      ? {
          label: 'Management',
          value: artist.managementContact.email,
          href: `mailto:${artist.managementContact.email}`,
          kind: 'management' as const,
        }
      : null,
    artist.pressContact
      ? {
          label: 'Presse',
          value: artist.pressContact.email,
          href: `mailto:${artist.pressContact.email}`,
          kind: 'press' as const,
        }
      : null,
    {
      label: artist.slug === 'sherin' ? 'Instagram management' : 'Instagram',
      value: contactInstagram.handle,
      href: contactInstagram.url,
      kind: 'instagram' as const,
    },
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    href: string;
    kind: 'email' | 'instagram' | 'management' | 'press';
  }>;

  return (
    <section
      id="contact"
      className="press-section section-contact relative overflow-hidden border-t border-white/10 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,11,10,0.97),rgba(8,7,7,0.42))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(241,211,161,0.07),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(130,88,59,0.10),transparent_30%)]" />
      <div className="grain-overlay" />
      <div className="paper-texture" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.45em] text-white/55">Contact</p>
          <h2 className="mt-5 max-w-xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
            Travailler ensemble
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            Pour toute demande professionnelle, booking ou prise de contact, voici les coordonnées
            dédiées à {artist.stageName}.
          </p>
        </div>

        <div className="border-t border-white/12">
          <div className="grid grid-cols-2">
            {contactItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                className="group grid min-h-[8rem] grid-cols-1 border-b border-white/10 px-3 py-5 transition-colors hover:bg-white/[0.02] sm:px-6 sm:min-h-[10rem] lg:min-h-[11rem] lg:py-7"
                style={{
                  borderRight:
                    index % 2 === 0 && index !== contactItems.length - 1
                      ? '1px solid rgba(255,255,255,0.10)'
                      : undefined,
                }}
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  <ContactLogo kind={item.kind} />
                  <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/72 sm:text-[0.72rem] sm:tracking-[0.32em]">
                    {item.label}
                  </p>
                </div>
                <div className="min-w-0 pl-0 sm:pl-8">
                  <p className="mt-3 break-all text-sm leading-6 text-white transition-colors group-hover:text-[#f1d3a1] sm:text-lg sm:leading-7 lg:text-xl">
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterPlatformIcon({ platform }: { platform: string }) {
  const sz = 'h-5 w-5';
  if (platform === 'Instagram') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="url(#ig-footer)" strokeWidth="1.7" className={sz}>
      <defs>
        <linearGradient id="ig-footer" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="url(#ig-footer)" stroke="none" />
    </svg>
  );
  if (platform === 'Threads') return (
    <svg viewBox="0 0 24 24" fill="none" className={sz}>
      <circle cx="12" cy="12" r="10" fill="#000000" />
      <path
        d="M16.45 11.4c-.12-3.15-1.86-5.08-4.58-5.08-2.68 0-4.68 1.9-4.68 5.58 0 3.88 2.18 5.78 5 5.78 2.1 0 3.7-1 4.4-2.85l-1.72-.58c-.48 1.18-1.34 1.78-2.62 1.78-1.92 0-3.06-1.42-3.06-4.1 0-2.62 1.04-3.98 2.7-3.98 1.58 0 2.42 1.02 2.62 3.02-.6-.14-1.24-.2-1.9-.18-2.26.08-3.55 1.14-3.55 2.78 0 1.46 1.1 2.5 2.76 2.5 1.62 0 2.84-.9 3.38-2.42.78.48 1.22 1.16 1.22 2.02 0 1.8-1.55 3.38-4.2 3.38-3.2 0-5.25-2.25-5.25-6.1 0-3.92 2.02-6.2 5.02-6.2 2.74 0 4.38 1.66 4.72 4.28l1.72-.42Zm-2.15 1.4c-.28 1.08-1.05 1.72-2.12 1.72-.74 0-1.22-.38-1.22-.98 0-.76.66-1.22 1.78-1.26.55-.02 1.08.06 1.56.22v.3Z"
        fill="#ffffff"
      />
    </svg>
  );
  if (platform === 'TikTok') return (
    <svg viewBox="0 0 24 24" fill="#000000" className={sz}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.16 8.16 0 0 0 4.77 1.52V7.12a4.85 4.85 0 0 1-1-.43z"/>
    </svg>
  );
  if (platform === 'YouTube') return (
    <svg viewBox="0 0 24 24" fill="#FF0000" className={sz}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#ffffff"/>
    </svg>
  );
  if (platform === 'Spotify') return (
    <svg viewBox="0 0 24 24" fill="#1DB954" className={sz}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14.5c2.5-1 5.5-.8 7.5.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M7.5 11.5c3-1.2 6.5-1 9 .8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M7 8.5c3.5-1.4 7.5-1.2 10.5 1" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
  if (platform === 'Apple Music') return (
    <svg viewBox="0 0 24 24" fill="#FC3C44" className={sz}>
      <path d="M18.71 5.65C17.91 4.75 16.71 4.25 15.5 4.25h-7c-1.21 0-2.41.5-3.21 1.4C4.49 6.55 4 7.75 4 9v6c0 1.25.49 2.45 1.29 3.35.8.9 2 1.4 3.21 1.4h7c1.21 0 2.41-.5 3.21-1.4.8-.9 1.29-2.1 1.29-3.35V9c0-1.25-.49-2.45-1.29-3.35zM15 12.5v2c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-1.29l-3 .75v2.04c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-4.5c0-.24.17-.44.41-.49l3.5-.88c.16-.04.33 0 .45.11.12.11.14.28.14.44v.82z"/>
    </svg>
  );
  if (platform === 'Deezer') return (
    <svg viewBox="0 0 24 24" fill="none" className={sz}>
      <rect x="3" y="14" width="3.2" height="3.2" fill="#FF0092" />
      <rect x="7.3" y="10.8" width="3.2" height="3.2" fill="#FF6B00" />
      <rect x="7.3" y="14" width="3.2" height="3.2" fill="#FF6B00" />
      <rect x="11.6" y="7.6" width="3.2" height="3.2" fill="#F7E000" />
      <rect x="11.6" y="10.8" width="3.2" height="3.2" fill="#00C7F2" />
      <rect x="11.6" y="14" width="3.2" height="3.2" fill="#00C7F2" />
      <rect x="15.9" y="4.4" width="3.2" height="3.2" fill="#A238FF" />
      <rect x="15.9" y="7.6" width="3.2" height="3.2" fill="#A238FF" />
      <rect x="15.9" y="10.8" width="3.2" height="3.2" fill="#00D95F" />
      <rect x="15.9" y="14" width="3.2" height="3.2" fill="#00D95F" />
    </svg>
  );
  if (platform === 'Amazon Music') return (
    <svg viewBox="0 0 24 24" fill="none" className={sz}>
      <path d="M5.2 6.2h13.6v11.6H5.2z" fill="#111827" />
      <path d="M8 10.2c.85-.8 2.1-1.25 3.55-1.25 2.2 0 3.55 1.15 3.55 3.15v4.1h-2.25v-.84c-.56.65-1.35 1-2.38 1-1.55 0-2.65-.9-2.65-2.25 0-1.5 1.18-2.3 3.25-2.3h1.7v-.12c0-.8-.52-1.25-1.55-1.25-.83 0-1.6.3-2.22.82L8 10.2Z" fill="#00A8E1" />
      <path d="M10.25 14c0 .48.42.8 1.05.8.72 0 1.28-.34 1.48-.88v-.58h-1.36c-.78 0-1.17.2-1.17.66Z" fill="#111827" />
      <path d="M7.1 18.4c2.8 1.45 6.4 1.52 9.45.12" stroke="#00A8E1" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16.9 17.25l1.65.35-.75 1.5" stroke="#00A8E1" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (platform === 'iTunes') return (
    <svg viewBox="0 0 24 24" fill="none" className={sz}>
      <defs>
        <linearGradient id="itunes-footer" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7B61FF" />
          <stop offset="0.5" stopColor="#E044FF" />
          <stop offset="1" stopColor="#FF2D55" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9.5" fill="url(#itunes-footer)" />
      <path d="M15.2 7.7v6.5a1.8 1.8 0 1 1-1-.6V9.8l-4.1.8v4.8a1.8 1.8 0 1 1-1-.6V9.6c0-.36.25-.68.61-.75l4.7-.92c.42-.08.79.24.79.67Z" fill="#fff" />
    </svg>
  );
  if (platform === 'iHeartRadio') return (
    <svg viewBox="0 0 24 24" fill="none" className={sz}>
      <path d="M12 20s-7-4.6-8.8-9.1C1.9 7.6 3.8 4.6 7 4.6c1.8 0 3.2 1 4 2.3.8-1.3 2.2-2.3 4-2.3 3.2 0 5.1 3 3.8 6.3C17 15.4 12 20 12 20Z" fill="#C6002B" />
      <path d="M8.6 10.2a3.8 3.8 0 0 1 6.8 0M7.2 8.7a5.8 5.8 0 0 1 9.6 0" stroke="#fff" strokeWidth="1.15" strokeLinecap="round" />
      <circle cx="12" cy="11.7" r="1.15" fill="#fff" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#536dff" strokeWidth="1.8" className={sz}>
      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12a7 7 0 0 1 13.2-3.2M19 12A7 7 0 0 1 5.8 15.2" strokeLinecap="round" />
    </svg>
  );
}

function SiteFooter({ artist }: { artist: Artist }) {
  const year = new Date().getFullYear();
  const sitemapItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Listen', href: '/listen' },
    { label: 'À propos', href: '/#about' },
    { label: 'Vidéos', href: '/#video' },
    { label: 'Galerie', href: '/gallery' },
    { label: 'Contact', href: '/#contact' },
  ];
  const platformItems = [
    ...artist.socials,
    ...artist.streamingLinks.map((s) => ({ platform: s.platform, url: s.url })),
  ];

  return (
    <footer className="relative border-t border-black/8 bg-white px-5 py-10 text-black sm:px-8 lg:px-12">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.2fr_1fr] lg:items-start">
        <div className="max-w-xs">
          <p className="text-sm font-black tracking-[0.32em] text-black uppercase">
            {artist.stageName}
          </p>
          <p className="mt-1.5 text-[0.68rem] tracking-[0.18em] text-black/32">
            © {year} · Tous droits réservés
          </p>
          <p className="mt-4 text-sm leading-6 text-black/52">{artist.tagline}</p>
        </div>

        <nav aria-label="Plan du site">
          <p className="text-[0.68rem] font-bold tracking-[0.28em] text-black/42 uppercase">
            Plan du site
          </p>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            {sitemapItems.map((item) => (
              <Link
                key={item.label}
                href={getArtistPath(artist, item.href)}
                className="text-sm font-medium text-black/64 transition-colors hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <nav aria-label="Réseaux sociaux et plateformes" className="lg:text-right">
          <p className="text-[0.68rem] font-bold tracking-[0.28em] text-black/42 uppercase">
            Réseaux
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-5 lg:justify-end">
            {platformItems.map((item) => (
            <a
              key={item.platform}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group transition-opacity hover:opacity-80"
              aria-label={item.platform}
            >
              <FooterPlatformIcon platform={item.platform} />
            </a>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
}

export function ArtistHomePage({ artist, initialTheme }: ArtistPageProps & { initialTheme?: ThemeMode }) {
  return (
    <div className="site-shell relative overflow-x-hidden bg-[#0b0908] text-white" data-site-theme="dark" data-artist={artist.slug}>
      <ArtistHero artist={artist} initialTheme={initialTheme} />
      <KpiSection artist={artist} />
      <main className="page-main relative">
        <ListenHighlightSection artist={artist} />
        <AboutSection artist={artist} />
        <PressReleaseSection artist={artist} />
        <WhoIsMartinaSection artist={artist} />
        <VideoSection artist={artist} />
        <GallerySection artist={artist} />
        <ContactSection artist={artist} />
      </main>
      <SiteFooter artist={artist} />
    </div>
  );
}

export function ArtistGalleryPage({ artist }: ArtistPageProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isOpen = lightboxIndex !== null;
  const current = lightboxIndex !== null ? artist.gallery[lightboxIndex] : null;

  const handleDownload = async (src: string, caption: string) => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${caption || artist.slug}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, '_blank');
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => i !== null ? Math.min(i + 1, artist.gallery.length - 1) : null);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => i !== null ? Math.max(i - 1, 0) : null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, artist.gallery.length]);

  return (
    <main className="gallery-shell relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#19110d_0%,#241814_22%,#16100d_48%,#0d0908_100%)] text-white" data-artist={artist.slug}>
      <SiteHeader artist={artist} prefixAnchors />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(233,198,154,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(155,98,66,0.14),transparent_24%)]" />
      <div className="grain-overlay" />
      <div className="film-vignette" />
      <div className="paper-texture" />

      <section className="gallery-section relative overflow-hidden border-b border-white/12 px-5 pb-14 pt-28 sm:px-8 lg:px-12 lg:pb-20 lg:pt-32">
        <div className="relative z-10 mx-auto max-w-7xl">
          <Link
            href={getArtistPath(artist, '/')}
            className="theme-chip inline-flex items-center rounded-full border border-white/15 bg-white/8 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white transition-colors hover:bg-white/12"
          >
            ← Retour
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.45em] text-white/55">Galerie</p>
              <h1 className="mt-4 text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl lg:text-8xl">
                {artist.stageName}
              </h1>
              <p className="theme-overlay-panel mt-5 max-w-xl rounded-[1.25rem] bg-black/24 p-4 text-base leading-7 text-white/75 backdrop-blur-sm sm:text-lg">
                Chaque image est un fragment de l&apos;univers de {artist.stageName} — scène, lumière, présence.
              </p>
            </div>

            <div className="theme-panel rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6">
              <p className="text-[0.72rem] uppercase tracking-[0.45em] text-white/55">Usage éditorial</p>
              <p className="mt-3 text-sm leading-7 text-white/75">
                Fichiers disponibles sur demande pour tout projet presse, booking ou communication visuelle.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-grid-section relative bg-[linear-gradient(180deg,rgba(12,10,10,0),rgba(255,255,255,0.03))] px-5 pb-20 pt-8 sm:px-8 lg:px-12 lg:pb-28">
        <div className="warm-spotlight left-[-10rem] top-[10%]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {artist.gallery.map((image, index) => (
            <motion.figure
              key={image.src}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: index * 0.05, ease: smoothEase }}
              className="theme-panel group cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04]"
              onClick={() => setLightboxIndex(index)}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 26rem"
                />
                <div className="theme-image-overlay absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                <div className="film-vignette" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="rounded-full bg-black/50 p-3 backdrop-blur-sm">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.figure>
          ))}
        </div>
      </section>
      <SiteFooter artist={artist} />

      {/* Lightbox */}
      {isOpen && current && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/92 backdrop-blur-xl"
            onClick={() => setLightboxIndex(null)}
          />

          {/* Controls top */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
              {(lightboxIndex ?? 0) + 1} / {artist.gallery.length}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDownload(current.src, current.caption); }}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm transition-colors hover:bg-white/14 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v13M7 11l5 5 5-5M3 19h18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Télécharger
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/14 hover:text-white"
                aria-label="Fermer"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative z-10 flex h-full w-full items-center justify-center px-16 py-20 sm:px-24">
            <div className="relative h-full w-full">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="object-contain"
                sizes="100vw"
                quality={90}
              />
            </div>
          </div>

          {/* Prev */}
          {(lightboxIndex ?? 0) > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i ?? 0) - 1); }}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white sm:left-5"
              aria-label="Précédent"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Next */}
          {(lightboxIndex ?? 0) < artist.gallery.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i ?? 0) + 1); }}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white sm:right-5"
              aria-label="Suivant"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </main>
  );
}

export function ArtistListenPage({ artist }: ArtistPageProps) {
  const primaryEmbed = getPrimaryEmbed(artist.streamingLinks);

  return (
    <main className="gallery-shell relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#120d0b_0%,#211612_22%,#140f0d_54%,#0d0908_100%)] text-white" data-artist={artist.slug}>
      <SiteHeader artist={artist} prefixAnchors />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(233,198,154,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(155,98,66,0.14),transparent_24%)]" />
      <div className="grain-overlay" />
      <div className="film-vignette" />
      <div className="paper-texture" />
      <div className="warm-spotlight left-[-6rem] top-[8%]" />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-12 pt-28 sm:px-8 lg:px-12 lg:pb-16 lg:pt-32">
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: smoothEase }}
          >
            <Link
              href={getArtistPath(artist, '/')}
              className="theme-chip inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80 transition-colors hover:bg-white/12"
            >
              ← Retour
            </Link>
          </motion.div>

          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
            >
              <p className="text-[0.72rem] uppercase tracking-[0.45em] text-white/55">Écouter</p>
              <h1 className="mt-4 text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl lg:text-8xl">
                {artist.stageName}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
                {artist.tagline}
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3 lg:justify-end"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: smoothEase }}
            >
              {artist.streamingLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="theme-chip rounded-full border border-white/15 bg-white/6 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.24em] text-white/85 transition-colors hover:bg-white/12 hover:text-white"
                >
                  {link.platform}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Embed + sidebar */}
      <section className="relative px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">

          {/* Primary embed */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: smoothEase }}
            className="theme-embed-shell overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/25"
          >
            {primaryEmbed?.embedUrl ? (
              <iframe
                title={primaryEmbed.label}
                src={primaryEmbed.embedUrl}
                width="100%"
                height="520"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block"
              />
            ) : (
              <div className="relative h-[520px]">
                <Image
                  src={artist.heroImage.src}
                  alt={artist.heroImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                <div className="theme-image-overlay absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.35, ease: smoothEase }}
              className="theme-panel rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"
            >
              <p className="text-[0.72rem] uppercase tracking-[0.45em] text-white/55">Biographie</p>
              <p className="mt-4 text-xl font-black leading-snug tracking-[-0.03em] text-white sm:text-2xl">
                {artist.shortBio}
              </p>
              <p className="mt-4 text-sm leading-7 text-white/75">{artist.longBio}</p>
              {artist.bioQuote && (
                <BioQuote artistName={artist.stageName} quote={artist.bioQuote} compact />
              )}
            </motion.div>

            {/* Press quotes */}
            {artist.pressQuotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.5, ease: smoothEase }}
                className="theme-panel rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-[0.72rem] uppercase tracking-[0.45em] text-white/55">Citations presse</p>
                <div className="mt-5 space-y-5">
                  {artist.pressQuotes.map((quote, index) => (
                    <div
                      key={`${quote.source}-${index}`}
                      className="border-t border-white/8 pt-5 first:border-t-0 first:pt-0"
                    >
                      <p className="text-base leading-7 text-white/85 italic">
                        &ldquo;{quote.quote}&rdquo;
                      </p>
                      <p className="mt-2 text-[0.68rem] uppercase tracking-[0.3em] text-white/42">
                        {quote.source} · {quote.kind}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Key stats */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.62, ease: smoothEase }}
              className="grid grid-cols-3 gap-3"
            >
              {artist.highlights.map((h) => (
                <div
                  key={h.label}
                  className="theme-overlay-panel rounded-[1.25rem] border border-white/10 bg-black/22 p-4 backdrop-blur-md"
                >
                  <p className="text-[0.62rem] uppercase tracking-[0.26em] text-white/48">{h.label}</p>
                  <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">{h.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      <SiteFooter artist={artist} />
    </main>
  );
}
