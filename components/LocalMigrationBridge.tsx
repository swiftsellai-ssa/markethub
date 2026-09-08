"use client";

import { useEffect, useRef } from "react";
import {
  createClient,
  isBrowserSupabaseConfigured,
} from "@/lib/supabase/client";
import { checkAndMigrateLocalStorage } from "@/lib/migrate-local";

/**
 * Runs once inside the hub: if the user is signed in and still has a local
 * MarketsXHub queue, import it into their Supabase workspace.
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
