import type { Genre, Movie } from "@/entities/movie/types";

export const MOVIE_GENRES: Genre[] = [
  { id: 878, name: "Ficção científica" },
  { id: 28, name: "Ação" },
  { id: 18, name: "Drama" }
];

const baseMovie: Movie = {
  id: 0,
  title: "",
  overview: "",
  poster_path: "/poster.jpg",
  backdrop_path: null,
  release_date: "",
  vote_average: 0,
  vote_count: 0,
  genre_ids: []
};

export const INTERSTELLAR: Movie = {
  ...baseMovie,
  id: 157336,
  title: "Interestelar",
  overview: "Uma equipe de exploradores viaja por um buraco de minhoca.",
  poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  release_date: "2014-11-05",
  vote_average: 8.4,
  vote_count: 30000,
  genre_ids: [878]
};

export const INCEPTION: Movie = {
  ...baseMovie,
  id: 27205,
  title: "A Origem",
  overview: "Um ladrão invade os sonhos das pessoas para roubar segredos.",
  poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  release_date: "2010-07-15",
  vote_average: 8.8,
  vote_count: 35000,
  genre_ids: [28]
};

export const FIGHT_CLUB: Movie = {
  ...baseMovie,
  id: 550,
  title: "Clube da Luta",
  overview: "Um operário insone e um fabricante de sabão fundam um clube.",
  poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  release_date: "1999-10-15",
  vote_average: 7.7,
  vote_count: 26000,
  genre_ids: [18]
};

export const OPPENHEIMER: Movie = {
  ...baseMovie,
  id: 872585,
  title: "Oppenheimer",
  overview: "A história do pai da bomba atômica.",
  poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  release_date: "2023-07-21",
  vote_average: 8.3,
  vote_count: 40000,
  genre_ids: [18]
};

export const DUNE: Movie = {
  ...baseMovie,
  id: 438631,
  title: "Duna",
  overview: "Paul Atreides lidera uma luta pelo destino do planeta Arrakis.",
  poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
  release_date: "2021-10-22",
  vote_average: 8.0,
  vote_count: 14000,
  genre_ids: [878]
};

export const THE_MATRIX: Movie = {
  ...baseMovie,
  id: 603,
  title: "Matrix",
  overview: "Um hacker descobre a verdade sobre a realidade.",
  poster_path: "/dXNAPwY7VrqMAo4xehXMieDUq8N.jpg",
  release_date: "1999-03-31",
  vote_average: 8.7,
  vote_count: 20000,
  genre_ids: [28]
};

export const MOVIES: Movie[] = [
  INTERSTELLAR,
  INCEPTION,
  FIGHT_CLUB,
  OPPENHEIMER,
  DUNE,
  THE_MATRIX
];