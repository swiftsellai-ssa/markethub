import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="noise relative min-h-screen overflow-hidden bg-void text-paper">
      <div className="x-watermark" aria-hidden>
        X
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
