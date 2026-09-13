"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useState } from "react";

type CinematicHeroProps = {
  brandName?: string;
  campaignLine: string;
  support?: string;
  ctaLabel?: string;
  ctaHref?: string;
  stillSrc: string;
  /** Portrait / mobile-optimized still; falls back to stillSrc */
  stillSrcMobile?: string;
  videoSrc?: string;
};

export function CinematicHero({
  brandName = "Italian Watches",
  campaignLine,
  support,
  ctaLabel = "Discover",
  ctaHref = "/collections/all",
  stillSrc,
  stillSrcMobile,
  videoSrc,
}: CinematicHeroProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = Boolean(videoSrc) && !videoFailed;
  const mobileSrc = stillSrcMobile ?? stillSrc;

  const common = {
    alt: "",
    fill: true as const,
    priority: true,
    sizes: "100vw",
    className: "object-cover cinematic-hero__still",
  };

  const {
    props: { srcSet: desktopSrcSet, ...desktopRest },
  } = getImageProps({
    ...common,
    src: stillSrc,
  });

  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({
    ...common,
    src: mobileSrc,
  });

  return (
    <section className="cinematic-hero" aria-label="Campaign">
      <div className="cinematic-hero__media">
        <picture>
          <source media="(max-width: 767px)" srcSet={mobileSrcSet} sizes="100vw" />
          <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
          {/* Decorative campaign still */}
          <img {...desktopRest} alt="" />
        </picture>
        {showVideo && (
          <video
            className="cinematic-hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster={stillSrc}
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="cinematic-hero__overlay" aria-hidden="true" />
      <div className="cinematic-hero__content">
        <p className="cinematic-hero__brand">{brandName}</p>
        <h1 className="type-display-campaign cinematic-hero__line">{campaignLine}</h1>
        {support && <p className="cinematic-hero__support">{support}</p>}
        <div className="cinematic-hero__cta">
          <Link href={ctaHref} className="btn-outline-on-image">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
