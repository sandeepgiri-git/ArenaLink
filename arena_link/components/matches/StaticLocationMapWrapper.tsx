"use client";

import dynamic from "next/dynamic";

const StaticLocationMap = dynamic(() => import("./StaticLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-48 sm:h-64 w-full bg-surface-hover rounded-xl animate-pulse flex items-center justify-center text-muted text-sm">
      Loading map...
    </div>
  ),
});

interface StaticLocationMapWrapperProps {
  lat: number;
  lng: number;
}

export default function StaticLocationMapWrapper({ lat, lng }: StaticLocationMapWrapperProps) {
  return <StaticLocationMap lat={lat} lng={lng} />;
}
