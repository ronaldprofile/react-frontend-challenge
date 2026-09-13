import { beforeEach, describe, expect, it, vi } from "vitest";

import { useWatchlistStore } from "./watchlistStore";
import { FIGHT_CLUB, INCEPTION, INTERSTELLAR } from "@/test/fixtures/movies";

describe("watchlistStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useWatchlistStore.setState({ movies: [] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("addition", () => {
    it("adds a movie to the list", () => {
      useWatchlistStore.getState().addMovie(INTERSTELLAR);
      expect(useWatchlistStore.getState().movies).toHaveLength(1);
      expect(useWatchlistStore.getState().isInWatchlist(INTERSTELLAR.id)).toBe(
        true
      );
    });

    it("does not duplicate movies", () => {
      useWatchlistStore.getState().addMovie(INTERSTELLAR);
      useWatchlistStore.getState().addMovie(INTERSTELLAR);
      expect(useWatchlistStore.getState().movies).toHaveLength(1);
    });
  });

  describe("removal", () => {
    it("removes a movie from the list", () => {
      const { addMovie, removeMovie } = useWatchlistStore.getState();
      addMovie(INTERSTELLAR);
      addMovie(INCEPTION);
      removeMovie(INTERSTELLAR.id);

      const state = useWatchlistStore.getState();
      expect(state.movies).toHaveLength(1);
      expect(state.isInWatchlist(INTERSTELLAR.id)).toBe(false);
      expect(state.isInWatchlist(INCEPTION.id)).toBe(true);
    });
  });

  describe("persistence", () => {
    it("persists the list in localStorage", () => {
      useWatchlistStore.getState().addMovie(FIGHT_CLUB);

      const stored = JSON.parse(
        localStorage.getItem("cinedash.watchlist") ?? "{}"
      );
      expect(stored.state.movies).toHaveLength(1);
      expect(stored.state.movies[0].title).toBe("Clube da Luta");
    });
  });
});