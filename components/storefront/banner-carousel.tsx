"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const banners = [
  {
    desktop: "/banners/homepage-desktop.png",
    mobile: "/banners/homepage-mobile.png",
    alt: "DYT Wear What You're Into streetwear campaign",
    href: "/shop?sort=newest",
    label: "Shop the latest DYT drop"
  },
  {
    desktop: "/banners/catalogue-desktop.png",
    mobile: "/banners/catalogue-mobile.png",
    alt: "DYT catalogue featuring T-shirts, oversized fits, sleeveless tees, and long sleeves",
    href: "/shop",
    label: "Explore the full DYT catalogue"
  }
] as const;

export function BannerCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  const showPrevious = useCallback(() => {
    setActive((current) => (current - 1 + banners.length) % banners.length);
  }, []);

  const showNext = useCallback(() => {
    setActive((current) => (current + 1) % banners.length);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reducedMotion) return;

    const timer = window.setInterval(showNext, 7000);
    return () => window.clearInterval(timer);
  }, [paused, showNext]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="DYT campaigns"
      className="border-b border-ink bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(distance) < 45) return;
        distance > 0 ? showPrevious() : showNext();
      }}
    >
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[1600px] overflow-hidden sm:aspect-video">
        {banners.map((banner, index) => (
          <Link
            key={banner.desktop}
            href={banner.href}
            aria-label={banner.label}
            aria-hidden={active !== index}
            tabIndex={active === index ? 0 : -1}
            className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${
              active === index ? "z-10 opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={banner.mobile}
              alt={banner.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 639px) 100vw, 1px"
              className="object-contain sm:hidden"
              draggable={false}
            />
            <Image
              src={banner.desktop}
              alt={banner.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1600px) 1600px, 100vw"
              className="hidden object-contain sm:block"
              draggable={false}
            />
          </Link>
        ))}
      </div>

      <div className="container-pad flex h-14 items-center justify-between text-white">
        <button
          type="button"
          onClick={showPrevious}
          className="focus-ring grid h-10 w-10 place-items-center border border-white/35 transition hover:border-white hover:bg-white hover:text-ink"
          aria-label="Previous banner"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3" aria-label="Choose banner">
          {banners.map((banner, index) => (
            <button
              key={banner.desktop}
              type="button"
              onClick={() => setActive(index)}
              className={`focus-ring h-2.5 transition-all ${
                active === index ? "w-9 bg-blood" : "w-2.5 bg-white/45 hover:bg-white"
              }`}
              aria-label={`Show banner ${index + 1}`}
              aria-current={active === index ? "true" : undefined}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={showNext}
          className="focus-ring grid h-10 w-10 place-items-center border border-white/35 transition hover:border-white hover:bg-white hover:text-ink"
          aria-label="Next banner"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
