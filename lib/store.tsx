"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EMPTY_STATE, SEED_STATE } from "./seed";
import { strategyFromPosts } from "./outliers";
import { newId } from "./format";
import { todayISO } from "./calendar";
import { seoRunLimit, xRunLimit } from "./plans";
import type {
  Account,
  Article,
  Brand,
  HubState,
  Metrics,
  Post,
  Research,
  Strategy,
} from "./types";

const STORAGE_KEY = "marketsxhub.v1";
const LEGACY_KEY = "markethub.v2";

type HubContextValue = {
  ready: boolean;
  state: HubState;
  today: string;
  todayPost: Post | undefined;
  xRunsLeft: number;
  seoRunsLeft: number;
  setBrand: (brand: Brand) => void;
  setStrategy: (strategy: Strategy) => void;
  setResearch: (research: Research) => void;
  addPost: (post: Omit<Post, "id" | "createdAt"> & { id?: string }) => Post;
  addArticle: (
    article: Omit<Article, "id" | "createdAt"> & { id?: string },
  ) => Article;
  updatePost: (id: string, patch: Partial<Post>) => void;
  logMetrics: (id: string, metrics: Omit<Metrics, "loggedAt">) => void;
  consumeXRun: () => void;
  consumeSeoRun: () => void;
  onboard: (input: { brand: Brand; email: string; demo?: boolean }) => void;
  requestFounding: (email: string) => void;
  reset: () => void;
};

const HubContext = createContext<HubContextValue | null>(null);

function migrate(raw: unknown): HubState | null {
  if (!raw || typeof raw !== "object") return null;
  const parsed = raw as Partial<HubState> & {
    brand?: Brand;
    posts?: Post[];
  };
  if (!parsed.brand || !Array.isArray(parsed.posts)) return null;
  const account: Account = {
    email: parsed.account?.email ?? "",
    plan: parsed.account?.plan ?? "desk",
    onboarded: parsed.account?.onboarded ?? true,
    foundingRequested: parsed.account?.foundingRequested ?? false,
    xRunsUsed: parsed.account?.xRunsUsed ?? 0,
    seoRunsUsed: parsed.account?.seoRunsUsed ?? 0,
  };
  return {
    account,
    brand: { ...EMPTY_STATE.brand, ...parsed.brand },
    posts: parsed.posts,
    articles: parsed.articles ?? [],
    strategy: { ...SEED_STATE.strategy, ...parsed.strategy },
    research: parsed.research ?? null,
  };
}

function loadState(): HubState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    if (current) return migrate(JSON.parse(current)) ?? EMPTY_STATE;
    for (const key of [LEGACY_KEY, "markethub.v1"]) {
      const raw = window.localStorage.getItem(key);
      if (raw) return migrate(JSON.parse(raw)) ?? EMPTY_STATE;
    }
    return EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

export function HubProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HubState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const setBrand = useCallback((brand: Brand) => {
    setState((s) => ({ ...s, brand }));
  }, []);

  const setStrategy = useCallback((strategy: Strategy) => {
    setState((s) => ({ ...s, strategy }));
  }, []);

  const setResearch = useCallback((research: Research) => {
    setState((s) => ({ ...s, research }));
  }, []);

  const addPost = useCallback(
    (post: Omit<Post, "id" | "createdAt"> & { id?: string }) => {
      const next: Post = {
        ...post,
        id: post.id ?? newId("post"),
        createdAt: new Date().toISOString(),
      };
      setState((s) => {
        const withoutSameDay = s.posts.filter(
          (p) => !(p.date === next.date && p.status !== "posted"),
        );
        return { ...s, posts: [next, ...withoutSameDay] };
      });
      return next;
    },
    [],
  );

  const addArticle = useCallback(
    (article: Omit<Article, "id" | "createdAt"> & { id?: string }) => {
      const next: Article = {
        ...article,
        id: article.id ?? newId("art"),
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({ ...s, articles: [next, ...s.articles] }));
      return next;
    },
    [],
  );

  const updatePost = useCallback((id: string, patch: Partial<Post>) => {
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const logMetrics = useCallback(
    (id: string, metrics: Omit<Metrics, "loggedAt">) => {
      setState((s) => {
        const posts = s.posts.map((p) =>
          p.id === id
            ? {
                ...p,
                status: "posted" as const,
                metrics: { ...metrics, loggedAt: new Date().toISOString() },
              }
            : p,
        );
        return {
          ...s,
          posts,
          strategy: strategyFromPosts(posts, s.strategy),
        };
      });
    },
    [],
  );

  const consumeXRun = useCallback(() => {
    setState((s) => ({
      ...s,
      account: { ...s.account, xRunsUsed: s.account.xRunsUsed + 1 },
    }));
  }, []);

  const consumeSeoRun = useCallback(() => {
    setState((s) => ({
      ...s,
      account: { ...s.account, seoRunsUsed: s.account.seoRunsUsed + 1 },
    }));
  }, []);

  const onboard = useCallback(
    (input: { brand: Brand; email: string; demo?: boolean }) => {
      if (input.demo) {
        setState({
          ...SEED_STATE,
          account: {
            ...SEED_STATE.account,
            email: input.email,
            onboarded: true,
            plan: "desk",
          },
        });
        return;
      }
      setState({
        ...EMPTY_STATE,
        account: {
          email: input.email,
          plan: "free",
          onboarded: true,
          foundingRequested: false,
          xRunsUsed: 0,
          seoRunsUsed: 0,
        },
        brand: input.brand,
        strategy: {
          winningHook: "",
          winningFormat: "Bold claim in line one. Then the mechanism.",
          avoid: "Pitch-first openers. Fake metrics. Hashtag soup.",
          doubleDown: "Whatever hits 2x average engagement.",
          updatedAt: new Date().toISOString(),
        },
      });
    },
    [],
  );

  const requestFounding = useCallback((email: string) => {
    setState((s) => ({
      ...s,
      account: {
        ...s.account,
        email: email || s.account.email,
        foundingRequested: true,
      },
    }));
  }, []);

  const reset = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_KEY);
    setState(EMPTY_STATE);
  }, []);

  const today = todayISO();
  const todayPost = useMemo(
    () =>
      state.posts.find((p) => p.date === today && p.status !== "skipped") ??
      state.posts.find((p) => p.status === "ready"),
    [state.posts, today],
  );

  const xRunsLeft = Math.max(
    0,
    xRunLimit(state.account.plan) - state.account.xRunsUsed,
  );
  const seoRunsLeft = Math.max(
    0,
    seoRunLimit(state.account.plan) - state.account.seoRunsUsed,
  );

  const value = useMemo(
    () => ({
      ready,
      state,
      today,
      todayPost,
      xRunsLeft,
      seoRunsLeft,
      setBrand,
      setStrategy,
      setResearch,
      addPost,
      addArticle,
      updatePost,
      logMetrics,
      consumeXRun,
      consumeSeoRun,
      onboard,
      requestFounding,
      reset,
    }),
    [
      ready,
      state,
      today,
      todayPost,
      xRunsLeft,
      seoRunsLeft,
      setBrand,
      setStrategy,
      setResearch,
      addPost,
      addArticle,
      updatePost,
      logMetrics,
      consumeXRun,
      consumeSeoRun,
      onboard,
      requestFounding,
      reset,
    ],
  );

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}

export function useHub(): HubContextValue {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error("useHub must be used inside HubProvider");
  return ctx;
}
