export function ComingDesk({
  id,
  week,
  name,
  loop,
  modes,
  blocked,
}: {
  id: string;
  week: string;
  name: string;
  loop: string;
  modes: string[];
  blocked: string;
}) {
  return (
    <main className="px-5 py-8 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
        Bot {id} · {week}
      </p>
      <h1 className="mt-3 font-serif text-4xl">{name}</h1>
      <p className="mt-4 max-w-2xl text-lg text-paper/70">{loop}</p>

      <ol className="mt-10 max-w-2xl space-y-4">
        {modes.map((mode, i) => (
          <li key={mode} className="border border-line bg-ink-2 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-lime">
              Mode {i + 1}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-paper/75">{mode}</p>
          </li>
        ))}
      </ol>

      <p className="mt-10 max-w-2xl text-sm text-paper/50">{blocked}</p>
    </main>
  );
}
