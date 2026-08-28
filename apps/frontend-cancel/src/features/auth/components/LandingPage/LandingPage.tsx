"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NavBar from "@/components/layout/NavBar/NavBar";
import { useAuth } from "@/providers/auth-provider";
import ApplicationOrbit from "./ApplicationOrbit/ApplicationOrbit";
import MediaAgent from "./MediaAgent/MediaAgent";
import { useLandingLogic } from "./LandingPage.logic";
import TypingHeading from "./TypingHeading/TypingHeading";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const landing = useLandingLogic(user);
  const [guestTypingComplete, setGuestTypingComplete] = useState(false);
  const [guestActionVisible, setGuestActionVisible] = useState(false);
  useEffect(() => {
    if (!guestTypingComplete) return;
    const timer = window.setTimeout(() => setGuestActionVisible(true), 400);
    return () => window.clearTimeout(timer);
  }, [guestTypingComplete]);
  if (isLoading)
    return (
      <main className="cu-style flex min-h-screen items-center justify-center bg-white text-slate-500">
        Memuat sesi...
      </main>
    );
  if (!user)
    return (
      <main className="cu-style min-h-screen bg-[#16001f] bg-[url('/images/landing/creative-universe-background.jpg')] bg-cover bg-center text-white">
        <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 px-6 text-center">
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
            <TypingHeading
              text="This is Where Creative Begins"
              typingDelay={760}
              onComplete={() => setGuestTypingComplete(true)}
            />
          </h1>
          {guestActionVisible && (
            <Link
              href="/login"
              className="cu-landing-action-enter inline-flex h-12 items-center gap-3 rounded-full bg-white px-6 font-medium text-slate-900 transition-transform hover:scale-[1.02]"
            >
              Masuk ke Universe
              <span className="material-symbols-rounded">arrow_forward</span>
            </Link>
          )}
        </section>
      </main>
    );
  const {
    firstName,
    greeting,
    creativeRole,
    showMediaAgent,
    weather,
    applications,
  } = landing;
  const appOrbit = <ApplicationOrbit applications={applications} isReady />;
  return (
    <main className="cu-style min-h-screen bg-white text-slate-900">
      <NavBar
        user={{
          name: user.name,
          avatarUrl: user.avatar_url ?? undefined,
          isRoot: user.roles.some((role) => role.toLowerCase() === "root"),
        }}
        showNavigation={false}
        showApps={false}
        showDeveloper={false}
        bordered={false}
      />
      <section
        className={`grid ${creativeRole ? "h-[calc(100vh-4rem)] overflow-hidden" : "min-h-[calc(100vh-4rem)]"} items-center gap-8 px-6 py-10 lg:grid-cols-[1fr_1fr] lg:px-16`}
      >
        <div className="max-w-xl">
          <p className="text-sm text-slate-500">
            Hi,{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              {firstName}
            </span>
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">
            <TypingHeading text={greeting} />
          </h1>
          <div className="mt-4 flex gap-4 text-sm text-slate-500">
            <span>{weather?.label ?? "Loading weather..."}</span>
            {weather && (
              <>
                <span>{Math.round(weather.temperature)}°C</span>
                <span>UV {weather.uvIndex.toFixed(1)}</span>
              </>
            )}
          </div>
        </div>
        <div className="relative h-full min-h-[28rem] overflow-hidden">
          {creativeRole && (
            <div
              className={`absolute inset-0 transition-opacity duration-[3000ms] ${showMediaAgent ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <MediaAgent
                src={user.card_image_url ?? user.avatar_url}
                alt={`Card ${user.name}`}
              />
            </div>
          )}
          <div
            className={`absolute inset-0 transition-opacity duration-[3000ms] ${creativeRole && showMediaAgent ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            {appOrbit}
          </div>
        </div>
      </section>
    </main>
  );
}
