"use client";

import { useEffect, useRef } from "react";
import { ensureWorkspace } from "@/lib/ensure-workspace";
import { checkAndMigrateLocalStorage } from "@/lib/migrate-local";
import {
  createClient,
  isBrowserSupabaseConfigured,
} from "@/lib/supabase/client";

/**
 * Runs once inside the hub: create workspace if missing, then migrate any
 * leftover localStorage queue into Supabase.
 */
export function LocalMigrationBridge() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || !isBrowserSupabaseConfigured()) return;
    ran.current = true;

    const supabase = createClient();

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const ensured = await ensureWorkspace(supabase, user);
      if (!ensured.ok) {
        console.warn("MarketsXHub: ensureWorkspace failed", ensured.error);
      }

      const result = await checkAndMigrateLocalStorage(supabase, user);
      if (result.migrated) {
        console.info("MarketsXHub: local workspace migrated to Supabase");
      } else if (result.error) {
        console.warn("MarketsXHub: local migration skipped", result.error);
      }
    })();
  }, []);

  return null;
}
