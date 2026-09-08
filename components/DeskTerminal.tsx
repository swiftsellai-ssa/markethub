import Link from "next/link";

export function DeskTerminal({
  id,
  name,
  status,
  purpose,
  href,
}: {
  id: string;
  name: string;
  status: "Live" | "Coming";
  purpose: string;
  href?: string;
}) {
  const live = status === "Live";
  const inner = (
    <>
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em]">
        <span className="text-mute">
          {id} · {name} desk
        </span>
        <span className={live ? "text-lime" : "text-mute"}>
          {live ? "● live" : "coming"}
        </span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
        {name}
      </h3>
      <p className="mt-3 min-h-[3.2rem] text-sm leading-relaxed text-paper/65">
        {purpose}
      </p>
      <p
        className={`mt-6 font-mono text-[11px] uppercase tracking-[0.2em] ${
          live ? "text-lime" : "text-mute"
        }`}
      >
        {live && href ? "[ open desk ]" : "[ locked ]"}
      </p>
    </>
  );

  const cls = `terminal-frame block p-5 ${live ? "terminal-live" : ""}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return <article className={cls}>{inner}</article>;
}
