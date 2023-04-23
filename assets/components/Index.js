import React, { useEffect, useState } from "react";
import { Button, Rating, Spinner } from "flowbite-react";

const Index = (props) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
    fetchGenre();
  }, []);

  const fetchMovies = (genre) => {
    setLoading(true);
    let url = "/api/movies";

    if (genre) {
      url += `?genre=${genre}`;
    }
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.movies);
        setLoading(false);
      });
  };

  const fetchGenre = () => {
    let url = "/api/genres";
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.genres);
        setLoading(false);
      });
  };

  return (
    <Layout>
      <Heading />
      <Filters genres={genres} fetchMovies={fetchMovies} />
      <MovieList loading={loading} movies={movies}>
        {movies.map((item, key) => (
          <MovieItem key={key} {...item} />
        ))}
      </MovieList>
    </Layout>
  );
};

const Filters = ({ genres, fetchMovies }) => {
  const [genre, setGenre] = useState("");

  const handleGenreChange = (event) => {
    const newGenre = event.target.value;
    setGenre(newGenre);
    fetchMovies(newGenre);
  };

  const genreOptions = [
    { id: "", value: "All Genres" },
    ...genres.map((genre) => ({ id: genre.id, value: genre.id })),
  ];

  return (
    <div className="py-6 px-8 flex justify-center">
      <div className="w-1/2 mr-4">
        <div className="flex items-center">
          <label
            htmlFor="genre-select"
            className="font-bold text-gray-700 mr-4 w-2/4 text-right"
          >
            Filter by Genre:
          </label>

          <select
            id="genre-select"
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            value={genre}
            onChange={handleGenreChange}
          >
            {genreOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const Layout = (props) => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = (props) => {
  return (
    <div className="mx-auto max-w-screen-sm text-center mb-5 lg:mb-12">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>

      <p className="font-light text-gray-500 lg:mb-12 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
    </div>
  );
};

const MovieList = (props) => {
  if (props.loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {props.children}
    </div>
  );
};

const MovieItem = (props) => {
  return (
    <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
      <div className="grow">
        <img
          className="object-cover w-full h-60 md:h-80"
          src={props.image}
          alt={props.title}
          alt={props.genre}
          loading="lazy"
        />
      </div>

      <div className="grow flex flex-col h-full p-3">
        <div className="grow mb-3 last:mb-0">
          {props.year || props.rating ? (
            <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
              <span>{props.year}</span>

              {props.rating ? (
                <Rating>
                  <Rating.Star />

                  <span className="ml-0.5">{props.rating}</span>
                </Rating>
              ) : null}
            </div>
          ) : null}

          <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
            {props.title}
          </h3>
          <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
            {props.plot.substr(0, 80)}...
          </p>
        </div>

        {props.wikipedia_url ? (
          <Button
            color="light"
            size="xs"
            className="w-full"
            onClick={() => window.open(props.wikipedia_url, "_blank")}
          >
            More
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Index;
