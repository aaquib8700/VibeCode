"use client";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Very subtle pink orbs on white background */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #ff2d6b, transparent 70%)",
          top: "-20%",
          left: "-15%",
          animation: "mesh-move-1 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, #e91e8c, transparent 70%)",
          top: "20%",
          right: "-15%",
          animation: "mesh-move-2 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.025]"
        style={{
          background: "radial-gradient(circle, #7c3aed, transparent 70%)",
          bottom: "-10%",
          left: "30%",
          animation: "mesh-move-3 24s ease-in-out infinite",
        }}
      />

      {/* Very subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
