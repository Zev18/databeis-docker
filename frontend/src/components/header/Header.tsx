"use client";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProfileCard from "./ProfileCard";

const duration = 0.6;
const easing = "power4.inOut";

export default function Header() {
  const path = usePathname();
  const [initialPath, setInitialPath] = useState(path);
  const { isAboveSm } = useBreakpoint("sm");

  const isHome = path === "/";

  const isInitialLoad = initialPath === path;

  useEffect(() => {
    if (path !== initialPath) {
      setInitialPath("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const container = useRef(null);

  useGSAP(() => {
    if (isAboveSm) {
      if (!isInitialLoad) {
        gsap.set(".arrow", {
          autoAlpha: isHome ? 1 : 0,
          x: !isHome ? -30 : 0,
        });
        gsap.set(".title", {
          x: !isHome ? 0 : 30,
        });
      }
    }
  }, [path]);

  useGSAP(
    () => {
      if (isAboveSm) {
        if (path !== "/") {
          gsap.to(".arrow", {
            autoAlpha: 1,
            x: 0,
            duration: duration,
            ease: easing,
          });
          gsap.to(".title", {
            x: 30,
            duration: duration,
            ease: easing,
          });
        } else {
          gsap.to(".arrow", {
            autoAlpha: 0,
            x: -30,
            duration: duration,
            ease: easing,
          });
          gsap.to(".title", {
            x: 0,
            duration: duration,
            ease: easing,
          });
        }
      }
    },
    { scope: container, dependencies: [path] },
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b-2 border-secondary bg-background p-5">
      <Link
        href="/"
        ref={container}
        className="context relative flex items-center gap-4 text-3xl font-bold"
        style={{ lineHeight: "10px", height: "10px" }}
      >
        {isHome ? (
          <div
            className={cn(
              "arrow absolute hidden translate-x-[-30px] sm:block",
              isInitialLoad && "invisible",
            )}
          >
            <ArrowLeft />
          </div>
        ) : (
          <div className={cn("arrow invisible absolute sm:visible sm:block")}>
            <ArrowLeft />
          </div>
        )}

        {isHome ? (
          <span className={cn("title absolute")}>Databeis</span>
        ) : (
          <span className={cn("title absolute sm:translate-x-[30px]")}>
            Databeis
          </span>
        )}
      </Link>
      <ProfileCard />
    </header>
  );
}
