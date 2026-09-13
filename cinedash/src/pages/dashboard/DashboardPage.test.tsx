import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Genre, Movie } from "@/entities/movie/types";
import { useDiscoverStore } from "@/features/discover/store/discoverStore";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { MOVIE_GENRES, MOVIES } from "@/test/fixtures/movies";
import { render, screen, userEvent } from "@/test/test-utils";

const PAGE_SIZE = 5;

interface MovieListData {
  results: Movie[];
  total_pages: number;
}

interface QueryResult {
  data: MovieListData | undefined;
  isLoading: boolean;
  isError: boolean;
}

const mocks = vi.hoisted(() => {
  const genres: Genre[] = [];
  const movies: Movie[] = [];
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

  const paginate = (list: Movie[], page: number): QueryResult => ({
    data: {
      results: list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      total_pages: Math.max(1, Math.ceil(list.length / PAGE_SIZE))
    },
    isLoading: false,
    isError: false
  });

  const discover = vi.fn((filters: unknown): QueryResult => {
    const { page, with_genres, primary_release_year, "vote_average.gte": minRating } =
      (filters ?? {}) as {
        page?: number;
        with_genres?: string;
        primary_release_year?: number;
        "vote_average.gte"?: number;
      };
    let list = [...movies];
    if (with_genres) {
      list = list.filter((movie) =>
        movie.genre_ids.includes(Number(with_genres))
      );
    }
    if (primary_release_year) {
      list = list.filter(
        (movie) =>
          Number(movie.release_date?.slice(0, 4)) === primary_release_year
      );
    }
    if (minRating) {
      list = list.filter((movie) => movie.vote_average >= minRating);
    }
    return paginate(list, page ?? 1);
  });

  const search = vi.fn((query: string, page: number): QueryResult => {
    const list = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    return paginate(list, page);
  });

  return { genres, movies, Link, discover, search };
});

vi.mock("@tanstack/react-router", () => ({ Link: mocks.Link }));

vi.mock("@/entities/movie", () => ({
  useGenres: () => ({ data: mocks.genres }),
  useDiscoverMovies: (filters: unknown) => mocks.discover(filters),
  useSearchMovies: (query: string, page: number) => mocks.search(query, page)
}));

const setup = () => {
  const { container } = render(<DashboardPage />);
  return { container };
};

describe("DashboardPage", () => {
  beforeEach(() => {
    mocks.genres = MOVIE_GENRES;
    mocks.movies.splice(0, mocks.movies.length, ...MOVIES);
    mocks.discover.mockClear();
    mocks.search.mockClear();
    localStorage.clear();
    useDiscoverStore.setState({
      query: "",
      genreId: "",
      year: "",
      minRating: 0,
      page: 1
    });
  });

  describe("discover mode", () => {
    it("shows the first page of discover movies when the query is empty", () => {
      setup();

      expect(
        screen.getByRole("heading", { name: "Descobrir filmes" })
      ).toBeInTheDocument();
      expect(screen.getByText("Interestelar")).toBeInTheDocument();
      expect(screen.getByText("Duna")).toBeInTheDocument();
      expect(screen.queryByText("Matrix")).not.toBeInTheDocument();
    });

    it("filters the list by genre through the genre select", async () => {
      const user = userEvent.setup();
      setup();

      await user.click(
        screen.getByRole("combobox", { name: "Filtrar por gênero" })
      );
      await user.click(screen.getByRole("option", { name: "Ação" }));

      expect(screen.getByText("A Origem")).toBeInTheDocument();
      expect(screen.getByText("Matrix")).toBeInTheDocument();
      expect(screen.queryByText("Interestelar")).not.toBeInTheDocument();
      expect(screen.queryByText("Oppenheimer")).not.toBeInTheDocument();
    });

    it("combines year and rating filters to narrow the results", () => {
      useDiscoverStore.setState({ year: "1999", minRating: 8 });
      setup();

      expect(screen.getByText("Matrix")).toBeInTheDocument();
      expect(screen.queryByText("Clube da Luta")).not.toBeInTheDocument();
      expect(screen.queryByText("Interestelar")).not.toBeInTheDocument();
    });
  });

  describe("search mode", () => {
    it("shows only movies matching the query", async () => {
      const user = userEvent.setup();
      setup();

      await user.type(screen.getByRole("searchbox", { name: "Buscar filmes" }), "Matrix");

      expect(
        await screen.findByRole("heading", { name: "Resultados da busca" })
      ).toBeInTheDocument();
      expect(screen.getByText("Matrix")).toBeInTheDocument();
      expect(screen.queryByText("Interestelar")).not.toBeInTheDocument();
    });
  });

  describe("loading and error states", () => {
    it("renders a skeleton while the query is loading", () => {
      mocks.discover.mockReturnValueOnce({
        data: undefined,
        isLoading: true,
        isError: false
      });
      const { container } = setup();

      expect(
        container.querySelectorAll("[data-slot='skeleton']").length
      ).toBeGreaterThan(0);
    });

    it("shows an error message when the query fails", () => {
      mocks.discover.mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        isError: true
      });
      setup();

      expect(
        screen.getByText("Não foi possível carregar os filmes")
      ).toBeInTheDocument();
    });
  });

  describe("pagination", () => {
    it("shows the next page of movies when clicking next", async () => {
      const user = userEvent.setup();
      setup();

      expect(screen.queryByText("Matrix")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Próxima página" }));

      expect(screen.getByText("Matrix")).toBeInTheDocument();
      expect(screen.queryByText("Interestelar")).not.toBeInTheDocument();
    });
  });
});