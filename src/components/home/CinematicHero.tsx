"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type CinematicHeroProps = {
  brandName?: string;
  campaignLine: string;
  support?: string;
  ctaLabel?: string;
  ctaHref?: string;
  stillSrc: string;
  videoSrc?: string;
};

export function CinematicHero({
  brandName = "Italian Watches",
  campaignLine,
  support,
  ctaLabel = "Discover",
  ctaHref = "/collections/all",
  stillSrc,
  videoSrc,
}: CinematicHeroProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = Boolean(videoSrc) && !videoFailed;

  return (
    <section className="cinematic-hero" aria-label="Campaign">
      <div className="cinematic-hero__media">
        <Image
          src={stillSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
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
