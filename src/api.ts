const API_KEY = "5ea400ea660fe68253892190183d5eaa";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMove {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    },
    page: number;
    results: IMove[];
    total_pages: number;
    total_results: number;
}

export interface IDetail {
    adult: boolean;
    genres: [id: number, name: string];
    homepage: string;
    tagline: string;
    release_date: string;
    vote_average: number;
}

interface ITvShows {
    id: number;
    backdrop_path: string;
    poster_path: string;
    name: string;
    overview: string;
}

export interface IGetTvShowsResult {
    dates: {
        maximum: string;
        minimum: string;
    },
    page: number;
    results: ITvShows[];
    total_pages: number;
    total_results: number;
}

interface IMovieId {
    movieId: string;
}


export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then
        ((response) => response.json());
}

export function getTopRatedMovies() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then
        ((response) => response.json());
}

export function getUpcomingMovies() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then
        ((response) => response.json());
}

export function getTvShows() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then
        ((response) => response.json());
}

export function getPopularTvShows() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then
        ((response) => response.json());
}

export function getTopRatedTvShows() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then
        ((response) => response.json());
}


// export function getLastestTvShows() {
//     return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then
//         ((response) => response.json());
// }

