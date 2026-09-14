import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";

import type { Movie } from "@/entities/movie/types";
import { useWatchlistStore } from "@/features/watchlist/store/watchlistStore";
import { imageUrl } from "@/shared/api/tmdb";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const addMovie = useWatchlistStore(state => state.addMovie);
  const removeMovie = useWatchlistStore(state => state.removeMovie);
  const isInWatchlist = useWatchlistStore(state =>
    state.isInWatchlist(movie.id)
  );

  const poster = imageUrl(movie.poster_path, "w342");
  const releaseYear = movie.release_date?.slice(0, 4);

  function toggleWatchlist() {
    if (isInWatchlist) {
      removeMovie(movie.id);
      toast.info(`${movie.title} removido da sua lista`);
      return;
    }
    addMovie(movie);
    toast.success(`${movie.title} adicionado à sua lista`);
  }

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link
        to="/movie/$id"
        params={{ id: movie.id }}
        className="relative block overflow-hidden"
      >
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            loading="lazy"
            className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-[2/3] w-full items-center justify-center bg-muted text-muted-foreground">
            Sem imagem
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Button
            variant={isInWatchlist ? "default" : "secondary"}
            size="icon-sm"
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
              toggleWatchlist();
            }}
            aria-label={
              isInWatchlist
                ? "Remover da minha lista"
                : "Adicionar à minha lista"
            }
          >
            <Heart className={isInWatchlist ? "fill-current" : ""} />
          </Button>
        </div>
      </Link>
      <CardContent className="flex flex-1 flex-col gap-1 p-3">
        <Link
          to="/movie/$id"
          params={{ id: movie.id }}
          className="line-clamp-1 text-sm font-medium hover:underline"
        >
          {movie.title}
        </Link>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{releaseYear ?? "—"}</span>
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
