import { AnimatePresence, motion, useTransform, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult, IGetTvShowsResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
background-color: ${props => props.theme.black.lighter};;
`;

const Loader = styled.div`
height: 20vh;
display: flex;
justify-content: center;
align-items: center;
`;

const Banner = styled.div`
height: 100vh;
display: flex;
flex-direction: column;
justify-content: start;
padding: 60px;
background-size: cover;
`;

const Title = styled.h2`
font-size:78px;
margin-bottom: 16px;
`;

const Overview = styled.p`
font-size: 39px;
width:70%;
`;

const Slider = styled.div`
margin-top: 16px;
position: relative;
top: -700px;
`;

const SliderBtn = styled(motion.div)`
font-size: 48px;
justify-items: center;
align-items: center;
cursor: pointer;
opacity: 0.3;
`;

const SliderTitle = styled.span`
font-size: 48px;
padding: 16px;
text-transform: uppercase;
`;

const Row = styled(motion.div)`
display: grid;
gap:5px;
padding-right:20px;
grid-template-columns: 16% 16% 16% 16% 16% 16% 4%;
margin-bottom: 5px;
position: absolute;
width: 100%;
`;


const Box = styled(motion.div) <{ bgphoto: string }>`
background-color: white;
height: 200px;
font-size: 44px;
background-image:url(${(props) => props.bgphoto});
background-size: cover;
background-position: center center;
cursor: pointer;
&:first-child{
    transform-origin:center left;
}
&:last-child{
    transform-origin:center right;
}
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${props => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4{
        text-align: center;
        font-size: 18px;
    }
`;

const Overlay = styled(motion.div)`
position: fixed;
top:0;
width: 100%;
height: 100%;
background-color: rgba(0,0,0,0.5);
opacity: 0;
`;

const BigMovie = styled(motion.div)`
position: absolute;
width: 40vw;
height: 80vh;
left: 0;
right: 0;
margin: 0 auto;
background-color: ${props => props.theme.black.lighter};
border-radius: 15px;
overflow: hidden;
`;

const BigCover = styled.div`
width: 100%;
background-size:cover;
background-position: center center;
height: 400px;
`;

const BigTitle = styled.h3`
color: ${props => props.theme.white.lighter};
padding: 15px;
font-size: 38px;
position: relative;
top:-110px;
`;

const BigOverview = styled.p`
padding:15px;
color: ${props => props.theme.white.lighter};
top:-80px;
position: relative;

`;
const BigBtn = styled(motion.div)`
position: absolute;
right: 0;
padding: 20px;
background-color:rgba(0,0,0,0.5);
color:${props => props.theme.white.lighter};
cursor: pointer;
`;

const rowVariants = {
    hidden: {
        x: window.outerWidth,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth,
    },
}

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        zIndex: 99,
        y: -50,
        scale: 1.3,
        transition: {
            delay: 0.3,
            type: "tween",
        },
    },
}

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.3,
            type: "tween",
        },
    }
}

const offset = 6;

function Search() {
    const [showPoster, setShowPoster] = useState(false);
    const togglePoster = () => { setShowPoster((prev) => !prev) }

    const location = useLocation()
    const keyword = new URLSearchParams(location.search).get("keyword");
    console.log(keyword);
    function getSearchMovies() {
        return fetch(`
        https://api.themoviedb.org/3/search/movie?api_key=5ea400ea660fe68253892190183d5eaa&language=en-US&query=${keyword}&page=1&include_adult=false`)
            .then((response) => response.json());
    }
    function getSearchTvShows() {
        return fetch(`
        https://api.themoviedb.org/3/search/tv?api_key=5ea400ea660fe68253892190183d5eaa&language=en-US&query=${keyword}&page=1&include_adult=false`)
            .then((response) => response.json());
    }
    const { data: searchMovieData, isLoading } = useQuery<IGetMoviesResult>(["search", "movie"], getSearchMovies)
    const { data: searchTvShowData } = useQuery<IGetTvShowsResult>(["search", "TvShow"], getSearchTvShows)

    const history = useNavigate();
    const bigSearchMovieMatch = useMatch("/search/movie/:movieId");
    const bigSearchTvShowMatch = useMatch("/search/tv/:movieId");
    const { scrollY } = useViewportScroll();
    const setScrollY = useTransform(scrollY, (value) => value + 100);

    const [nowIndex, setNowIndex] = useState(0)
    const [popularIndex, setPopularIndex] = useState(0)
    const nowIncraseIndex = () => {
        if (searchMovieData) {
            if (leaving) return;
            setLeaving(true);
            const totalMovies = searchMovieData?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setNowIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };
    const popularIncraseIndex = () => {
        if (searchTvShowData) {
            if (leaving) return;
            setLeaving(true);
            const totalMovies = searchTvShowData?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setPopularIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };
    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onSearchMovieBoxClicked = (movieId: number) => { history(`/search/movie/${movieId}`) };
    const onSearchTvShowBoxClicked = (tvshouwsId: number) => { history(`/search/tv/${tvshouwsId}`) };
    const onOverlayClick = () => history("/search");
    const SearchMovieClicked = bigSearchMovieMatch?.params.movieId && searchMovieData?.results.find((prev) => prev.id + "" === bigSearchMovieMatch.params.movieId);
    const SearchTvShowClicked = bigSearchTvShowMatch?.params.movieId && searchTvShowData?.results.find((prev) => prev.id + "" === bigSearchTvShowMatch.params.movieId);

    return (
        <Wrapper >{isLoading ? <Loader>Loading...</Loader> : <>
            <Banner>
                <Title>Result Search : {keyword}</Title>
            </Banner>
            <Slider>
                <SliderTitle >movie</SliderTitle>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }}
                        key={nowIndex}>
                        {searchMovieData?.results
                            .slice(1)
                            .slice(offset * nowIndex, offset * nowIndex + offset)
                            .map((movie) =>
                                <Box
                                    layoutId={movie.id + "today"}
                                    onClick={() => onSearchMovieBoxClicked(movie.id)}
                                    key={movie.id}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    transition={{ type: "tween" }}
                                    bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                                >
                                    <Info variants={infoVariants} >
                                        <h4>{movie.title}</h4>
                                    </Info>
                                </Box>
                            )}
                        <SliderBtn onClick={nowIncraseIndex} whileHover={{ opacity: 1 }}>&rarr;</SliderBtn>
                    </Row>
                </AnimatePresence>
            </Slider>
            <Slider style={{ top: "-450px" }}>
                <SliderTitle >tv</SliderTitle>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }}
                        key={popularIndex}>
                        {searchTvShowData?.results
                            .slice(offset * popularIndex, offset * popularIndex + offset)
                            .map((tvShows) =>
                                <Box
                                    layoutId={tvShows.id + "popular"}
                                    onClick={() => onSearchTvShowBoxClicked(tvShows.id)}
                                    key={tvShows.id}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    transition={{ type: "tween" }}
                                    bgphoto={makeImagePath(tvShows.backdrop_path, "w500")}
                                >
                                    <Info variants={infoVariants} >
                                        <h4>{tvShows.name}</h4>
                                    </Info>
                                </Box>
                            )}
                        <SliderBtn onClick={popularIncraseIndex} whileHover={{ opacity: 1 }}>&rarr;</SliderBtn>
                    </Row>
                </AnimatePresence>
            </Slider>
            <AnimatePresence>
                {bigSearchMovieMatch ? (
                    <>
                        <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                        <BigMovie style={{ top: setScrollY }} layoutId={bigSearchMovieMatch.params.movieId + "today"}>
                            {SearchMovieClicked && <>
                                <BigBtn whileHover={{ backgroundColor: "rgba(0,0,0,1)" }} onClick={togglePoster} >Show another poster</BigBtn>
                                {showPoster ? <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(SearchMovieClicked.poster_path, "w500")})` }} />
                                    : <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(SearchMovieClicked.backdrop_path, "w500")})` }} />}
                                <BigTitle>{SearchMovieClicked.title}</BigTitle>
                                <BigOverview>{SearchMovieClicked.overview}</BigOverview>
                            </>}

                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
            <AnimatePresence>
                {bigSearchTvShowMatch ? (
                    <>
                        <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                        <BigMovie style={{ top: setScrollY }} layoutId={bigSearchTvShowMatch.params.movieId + "popular"}>
                            {SearchTvShowClicked && <>
                                <BigBtn whileHover={{ backgroundColor: "rgba(0,0,0,1)" }} onClick={togglePoster} >Show another poster</BigBtn>
                                {showPoster ? <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(SearchTvShowClicked.poster_path, "w500")})` }} />
                                    : <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(SearchTvShowClicked.backdrop_path, "w500")})` }} />}
                                <BigTitle>{SearchTvShowClicked.name}</BigTitle>
                                <BigOverview>{SearchTvShowClicked.overview}</BigOverview>
                            </>}
                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
        </>}</Wrapper >
    );
}
export default Search;