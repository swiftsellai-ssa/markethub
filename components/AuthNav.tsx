"use client";

import Link from "next/link";
import { useHub } from "@/lib/store";

export function AuthNav({ compact = false }: { compact?: boolean }) {
  const { ready, sessionUser, signOut } = useHub();
  if (!ready) return null;

  if (sessionUser) {
    return (
      <span className="flex items-center gap-3">
        {!compact ? (
          <span className="hidden max-w-[10rem] truncate text-mute sm:inline">
            {sessionUser.email}
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => void signOut()}
          className="text-mute hover:text-lime"
        >
          Sign out
        </button>
      </span>
    );
  }

  return (
    <Link href="/login" className="text-mute hover:text-lime">
      Log in
    </Link>
  );
}
