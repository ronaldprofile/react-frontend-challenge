import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Movie } from "@/entities/movie/types";
import { MovieCard } from "@/features/discover/ui/MovieCard";
import { useWatchlistStore } from "@/features/watchlist/store/watchlistStore";
import { FIGHT_CLUB } from "@/test/fixtures/movies";
import { render, screen, userEvent } from "@/test/test-utils";

const mocks = vi.hoisted(() => {
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
  return { Link };
});

vi.mock("@tanstack/react-router", () => ({ Link: mocks.Link }));

const movie: Movie = FIGHT_CLUB;

const setup = () => {
  const user = userEvent.setup();
  render(<MovieCard movie={movie} />);
  return { user };
};

describe("MovieCard", () => {
  beforeEach(() => {
    localStorage.clear();
    useWatchlistStore.setState({ movies: [] });
  });

  describe("navigation", () => {
    it("links to the movie details page", () => {
      setup();

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
      for (const link of links) {
        expect(link).toHaveAttribute("href", "/movie/550");
      }
    });
  });

  describe("watchlist", () => {
    it("adds the movie and gives visual feedback", async () => {
      const { user } = setup();

      await user.click(
        screen.getByRole("button", { name: "Adicionar à minha lista" })
      );

      expect(useWatchlistStore.getState().isInWatchlist(movie.id)).toBe(true);
      expect(
        await screen.findByText("Clube da Luta adicionado à sua lista")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Remover da minha lista" })
      ).toBeInTheDocument();
    });

    it("persists the addition in localStorage", async () => {
      const { user } = setup();

      await user.click(
        screen.getByRole("button", { name: "Adicionar à minha lista" })
      );

      const stored = JSON.parse(
        localStorage.getItem("cinedash.watchlist") ?? "{}"
      );
      expect(stored.state.movies[0]).toMatchObject({
        id: 550,
        title: "Clube da Luta"
      });
    });

    it("removes the movie when toggling off", async () => {
      useWatchlistStore.getState().addMovie(movie);
      const { user } = setup();

      await user.click(
        screen.getByRole("button", { name: "Remover da minha lista" })
      );

      expect(useWatchlistStore.getState().movies).toHaveLength(0);
      expect(
        await screen.findByText("Clube da Luta removido da sua lista")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Adicionar à minha lista" })
      ).toBeInTheDocument();
    });
  });
});