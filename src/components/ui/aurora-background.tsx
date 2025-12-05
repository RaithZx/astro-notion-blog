"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black text-white",
          className,
        )}
        {...props}
      >
        {/* Aurora effect layers */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="aurora-layer animate-aurora absolute inset-[-100%] blur-[40px] opacity-30"
            style={{
              background: `
                repeating-linear-gradient(
                  100deg,
                  #1e3a8a 10%,
                  #1e40af 15%,
                  #3730a3 20%,
                  #4c1d95 25%,
                  #581c87 30%
                ),
                repeating-linear-gradient(
                  200deg,
                  #1e293b 10%,
                  #1e40af 15%,
                  #312e81 20%,
                  #4c1d95 25%,
                  #581c87 30%
                )
              `,
              backgroundSize: "200% 200%, 300% 300%",
              backgroundPosition: "50% 50%, 50% 50%",
            }}
          />
          <div
            className="aurora-layer-2 animate-aurora absolute inset-[-100%] blur-[60px] opacity-25"
            style={{
              background: `
                repeating-linear-gradient(
                  150deg,
                  #1e40af 10%,
                  #312e81 15%,
                  #3730a3 20%,
                  #4c1d95 25%,
                  #581c87 30%
                )
              `,
              backgroundSize: "300% 300%",
              backgroundPosition: "50% 50%",
              animationDelay: "0.5s",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </main>
  );
};
