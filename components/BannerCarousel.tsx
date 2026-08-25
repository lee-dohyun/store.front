"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlueprintCorners } from "@posselect/ui";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  link: string;
  bgColor: string;
}

const SWIPE_THRESHOLD_PX = 50;

export default function BannerCarousel({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  useEffect(() => {
    // Shuffle the banners on the client side for random, even exposure
    const shuffled = [...initialBanners].sort(() => Math.random() - 0.5);
    setBanners(shuffled);
  }, [initialBanners]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToRelative = (offset: number) => {
    setCurrentIndex((prev) => (prev + offset + banners.length) % banners.length);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    didSwipe.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 10) {
      didSwipe.current = true;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(diff) > SWIPE_THRESHOLD_PX) {
      goToRelative(diff < 0 ? 1 : -1);
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (didSwipe.current) {
      e.preventDefault();
      didSwipe.current = false;
    }
  };

  if (banners.length === 0) {
    // Fallback to first banner for SSR or before client hydration
    if (initialBanners.length > 0) {
      const b = initialBanners[0];
      return (
        <Link href={b.link} style={{ textDecoration: "none" }}>
          <div className="card blueprint elev-md hero" style={{ background: b.bgColor, cursor: "pointer", position: "relative" }}>
            <BlueprintCorners />
            <div className="hero-title" style={{ color: "#fff" }}>{b.title}</div>
            <div className="hero-sub" style={{ color: "rgba(255,255,255,0.8)" }}>{b.subtitle}</div>
            {b.imageUrl && (
              <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%", opacity: 0.2 }}>
                <Image src={b.imageUrl} alt="banner" fill style={{ objectFit: "cover" }} />
              </div>
            )}
          </div>
        </Link>
      );
    }
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div
      style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius-lg)", touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Link href={currentBanner.link} style={{ textDecoration: "none" }} onClick={handleLinkClick} draggable={false}>
        <div className="card blueprint elev-md hero" style={{ background: currentBanner.bgColor, cursor: "pointer", transition: "background-color 0.5s ease" }}>
          <BlueprintCorners />
          <div className="hero-title" style={{ color: "#fff", position: "relative", zIndex: 10 }}>{currentBanner.title}</div>
          <div className="hero-sub" style={{ color: "rgba(255,255,255,0.8)", position: "relative", zIndex: 10 }}>{currentBanner.subtitle}</div>
          {currentBanner.imageUrl && (
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%", opacity: 0.2 }}>
              <Image src={currentBanner.imageUrl} alt="banner" fill style={{ objectFit: "cover" }} />
            </div>
          )}
        </div>
      </Link>
      {banners.length > 1 && (
        <div style={{ position: "absolute", bottom: "16px", left: "0", right: "0", display: "flex", justifyContent: "center", gap: "8px", zIndex: 20 }}>
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex(idx);
              }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: currentIndex === idx ? "#fff" : "rgba(255,255,255,0.5)",
                border: "none",
                cursor: "pointer",
                padding: 0
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
