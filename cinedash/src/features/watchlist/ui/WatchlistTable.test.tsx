import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Genre, Movie } from "@/entities/movie/types";
import {
  FIGHT_CLUB,
  INCEPTION,
  INTERSTELLAR,
  MOVIE_GENRES
} from "@/test/fixtures/movies";
import { WATCHLIST_STORAGE_KEY } from "@/features/watchlist/store/watchlistStore";
import { useWatchlistStore } from "@/features/watchlist/store/watchlistStore";
import { WatchlistTable } from "@/features/watchlist/ui/WatchlistTable";
import { render, screen, userEvent, within } from "@/test/test-utils";

const mocks = vi.hoisted(() => {
  const genres: Genre[] = [];
  const Link = ({
    to,
    params,
    children
  }: {
    to: string;
    params?: { id: string | number };
    children?: ReactNode;
  }) => (
    <a href={params?.id ? to.replace("$id", String(params.id)) : to}>
      {children}
    </a>
  );
  return { genres, Link };
});

vi.mock("@/entities/movie", () => ({
  useGenres: () => ({ data: mocks.genres })
}));

vi.mock("@tanstack/react-router", () => ({ Link: mocks.Link }));

function seedWatchlist(movies: Movie[]) {
  const { addMovie } = useWatchlistStore.getState();
  movies.forEach((movie) => addMovie(movie));
}

function tableTitleRows(): string[] {
  const table = screen.getByRole("table");
  return within(table)
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getByRole("link").textContent ?? "");
}

const setup = () => {
  const user = userEvent.setup();
  render(<WatchlistTable />);
  return { user };
};

describe("WatchlistTable", () => {
  beforeEach(() => {
    mocks.genres = MOVIE_GENRES;
    localStorage.clear();
    useWatchlistStore.setState({ movies: [] });
  });

  describe("empty state", () => {
    it("shows an empty state when there are no movies", () => {
      setup();

      expect(screen.getByText("Sua lista está vazia")).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });
  });

  describe("listing", () => {
    it("lists the movies in store order", () => {
      seedWatchlist([INTERSTELLAR, INCEPTION, FIGHT_CLUB]);
      setup();

      expect(tableTitleRows()).toEqual([
        "Clube da Luta",
        "A Origem",
        "Interestelar"
      ]);
    });
  });

  describe("sorting", () => {
    it("sorts by title ascending and descending", async () => {
      seedWatchlist([INTERSTELLAR, INCEPTION, FIGHT_CLUB]);
      const { user } = setup();

      const table = screen.getByRole("table");
      await user.click(within(table).getByRole("button", { name: /Título/ }));

      expect(tableTitleRows()).toEqual([
        "A Origem",
        "Clube da Luta",
        "Interestelar"
      ]);

      await user.click(within(table).getByRole("button", { name: /Título/ }));

      expect(tableTitleRows()).toEqual([
        "Interestelar",
        "Clube da Luta",
        "A Origem"
      ]);
    });

    it("sorts by rating descending first, then ascending", async () => {
      seedWatchlist([INTERSTELLAR, INCEPTION, FIGHT_CLUB]);
      const { user } = setup();

      const table = screen.getByRole("table");
      await user.click(within(table).getByRole("button", { name: /Rating/ }));

      expect(tableTitleRows()).toEqual([
        "A Origem",
        "Interestelar",
        "Clube da Luta"
      ]);

      await user.click(within(table).getByRole("button", { name: /Rating/ }));

      expect(tableTitleRows()).toEqual([
        "Clube da Luta",
        "Interestelar",
        "A Origem"
      ]);
    });

    it("sorts by genre ascending", async () => {
      seedWatchlist([INTERSTELLAR, INCEPTION, FIGHT_CLUB]);
      const { user } = setup();

      const table = screen.getByRole("table");
      await user.click(within(table).getByRole("button", { name: /Gênero/ }));

      expect(tableTitleRows()).toEqual([
        "A Origem",
        "Clube da Luta",
        "Interestelar"
      ]);
    });
  });

  describe("actions", () => {
    it("removes a movie from the list", async () => {
      seedWatchlist([INTERSTELLAR, INCEPTION, FIGHT_CLUB]);
      const { user } = setup();

      const table = screen.getByRole("table");
      await user.click(
        within(table).getByRole("button", {
          name: "Remover Interestelar da lista"
        })
      );

      const state = useWatchlistStore.getState();
      expect(state.movies).toHaveLength(2);
      expect(state.isInWatchlist(INTERSTELLAR.id)).toBe(false);
      expect(
        within(table).queryByText("Interestelar")
      ).not.toBeInTheDocument();

      const stored = JSON.parse(
        localStorage.getItem(WATCHLIST_STORAGE_KEY) ?? "{}"
      );
      expect(stored.state.movies).toHaveLength(2);
    });
  });
});