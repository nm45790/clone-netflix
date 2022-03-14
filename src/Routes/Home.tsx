import { AnimatePresence, motion, useTransform, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { getMovies, getTopRatedMovies, getUpcomingMovies, IDetail, IGetMoviesResult } from "../api";
import { MovieIdState } from "../atom";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
background-color: black;
`;

const Loader = styled.div`
height: 20vh;
display: flex;
justify-content: center;
align-items: center;
`;

const Banner = styled.div < { bgPhoto: string }>`
height: 80vh;
display: flex;
flex-direction: column;
justify-content: center;
padding: 60px;
background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)),url(${(props) => props.bgPhoto});
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
`;

const SliderBtn = styled(motion.div)`
font-size: 48px;
display: flex;
justify-items: center;
align-items: center;
cursor: pointer;
opacity: 0.3;
background-color: rgba(255,255,255,0.2);
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
font-size: 18px;
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
        zIndex: 98,
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

function Home() {
    const [idState, setIdState] = useState();
    const [showPoster, setShowPoster] = useState(false);
    const history = useNavigate();
    const bigMovieMatch = useMatch("/movies/now/:movieId");
    const bigPopularMatch = useMatch("/movies/popular/:movieId");
    const bigUpComingMatch = useMatch("/movies/upcoming/:movieId");
    const { scrollY } = useViewportScroll();
    const setScrollY = useTransform(scrollY, (value) => value + 100);
    const { data: nowData, isLoading: nowLoadding } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies)
    const { data: popularData } = useQuery<IGetMoviesResult>(["movies", "popular"], getTopRatedMovies)
    const { data: upcomingData } = useQuery<IGetMoviesResult>(["movies", "upcoming"], getUpcomingMovies)
    const togglePoster = () => { setShowPoster((prev) => !prev) }
    // const setId = () => {
    //     setIdState(bigMovieMatch?.params.movieId as any); setShowDetail(props => !props);
    // }
    // function getMovieDetail() {
    //     return fetch(`
    //     https://api.themoviedb.org/3/movie/${idState}?api_key=5ea400ea660fe68253892190183d5eaa&language=en-US`)
    //         .then((response) => response.json());
    // }
    // const { data: detailData } = useQuery<IDetail>(["movies", "detail"], getMovieDetail);

    const [nowIndex, setNowIndex] = useState(0)
    const [popularIndex, setPopularIndex] = useState(0)
    const [upComingIndex, setUpComingIndex] = useState(0)
    const nowIncraseIndex = () => {
        if (nowData) {
            if (leaving) return;
            setLeaving(true);
            const totalMovies = nowData?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setNowIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };
    const popularIncraseIndex = () => {
        if (popularData) {
            if (leaving) return;
            setLeaving(true);
            const totalMovies = popularData?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setPopularIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };
    const upcomingIncraseIndex = () => {
        if (upcomingData) {
            if (leaving) return;
            setLeaving(true);
            const totalMovies = upcomingData?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setUpComingIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };
    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onMovieBoxClicked = (movieId: number) => { history(`/movies/now/${movieId}`) };
    const onPopularBoxClicked = (movieId: number) => { history(`/movies/popular/${movieId}`) };
    const onUpcomingBoxCilcked = (movieId: number) => { history(`/movies/upcoming/${movieId}`) };
    const onOverlayClick = () => history("/");
    const nowClickedMovie = bigMovieMatch?.params.movieId && nowData?.results.find((movie) => movie.id + "" === bigMovieMatch.params.movieId);
    const popularClickedMovie = bigPopularMatch?.params.movieId && popularData?.results.find((movie) => movie.id + "" === bigPopularMatch.params.movieId);
    const upcomingClickedMovie = bigUpComingMatch?.params.movieId && upcomingData?.results.find((movie) => movie.id + "" === bigUpComingMatch.params.movieId);

    return (
        <Wrapper >{nowLoadding ? <Loader>Loading...</Loader> : <>
            <Banner
                bgPhoto={makeImagePath(nowData?.results[0].backdrop_path || "")}>
                <Title>{nowData?.results[0].title}</Title>
                <Overview>{nowData?.results[0].overview}</Overview>
            </Banner>
            <Slider>
                <SliderTitle >Now playing</SliderTitle>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }}
                        key={nowIndex}>
                        {nowData?.results
                            .slice(1)
                            .slice(offset * nowIndex, offset * nowIndex + offset)
                            .map((movie) =>
                                <Box
                                    layoutId={movie.id + "now"}
                                    onClick={
                                        () => onMovieBoxClicked(movie.id)}
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
            <Slider style={{ top: "300px" }}>
                <SliderTitle >Top_rated</SliderTitle>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }}
                        key={popularIndex}>
                        {popularData?.results
                            .slice(offset * popularIndex, offset * popularIndex + offset)
                            .map((movie) =>
                                <Box
                                    layoutId={movie.id + "top_rated"}
                                    onClick={() => onPopularBoxClicked(movie.id)}
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
                        <SliderBtn onClick={popularIncraseIndex} whileHover={{ opacity: 1 }}>&rarr;</SliderBtn>
                    </Row>
                </AnimatePresence>
            </Slider>
            <Slider style={{ top: "600px" }}>
                <SliderTitle >upcoming</SliderTitle>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }}
                        key={upComingIndex}>
                        {upcomingData?.results
                            .slice(offset * upComingIndex, offset * upComingIndex + offset)
                            .map((movie) =>
                                <Box
                                    layoutId={movie.id + "upcoming"}
                                    onClick={() => onUpcomingBoxCilcked(movie.id)}
                                    key={movie.id}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    transition={{ type: "tween" }}
                                    bgphoto={makeImagePath(movie.poster_path, "w500")}
                                >
                                    <Info variants={infoVariants} >
                                        <h4>{movie.title}</h4>
                                    </Info>
                                </Box>
                            )}
                        <SliderBtn onClick={upcomingIncraseIndex} whileHover={{ opacity: 1 }}>&rarr;</SliderBtn>
                    </Row>
                </AnimatePresence>
            </Slider>
            <AnimatePresence>
                {bigMovieMatch ? (
                    <>
                        <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                        <BigMovie
                            style={{ top: setScrollY }} layoutId={bigMovieMatch.params.movieId + "now"}>
                            {nowClickedMovie && <>
                                <BigBtn whileHover={{ backgroundColor: "rgba(0,0,0,1)" }} onClick={togglePoster} >Show another poster</BigBtn>
                                {showPoster ? <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(nowClickedMovie.poster_path, "w500")})` }} />
                                    : <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(nowClickedMovie.backdrop_path, "w500")})` }} />}
                                <BigTitle>{nowClickedMovie.title}</BigTitle>
                                <BigOverview>{nowClickedMovie.overview}</BigOverview>
                            </>}
                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
            <AnimatePresence>
                {bigPopularMatch ? (
                    <>
                        <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                        <BigMovie style={{ top: setScrollY }} layoutId={bigPopularMatch.params.movieId + "top_rated"}>
                            {popularClickedMovie && <>
                                <BigBtn whileHover={{ backgroundColor: "rgba(0,0,0,1)" }} onClick={togglePoster} >Show another poster</BigBtn>
                                {showPoster ? <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(popularClickedMovie.poster_path, "w500")})` }} />
                                    : <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(popularClickedMovie.backdrop_path, "w500")})` }} />}
                                <BigTitle>{popularClickedMovie.title}</BigTitle>
                                <BigOverview>{popularClickedMovie.overview}</BigOverview>
                            </>}
                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
            <AnimatePresence>
                {bigUpComingMatch ? (
                    <>
                        <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                        <BigMovie style={{ top: setScrollY }} layoutId={bigUpComingMatch.params.movieId + "upcoming"}>
                            {upcomingClickedMovie && <>
                                <BigBtn whileHover={{ backgroundColor: "rgba(0,0,0,1)" }} onClick={togglePoster} >Show another poster</BigBtn>
                                {showPoster ? <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(upcomingClickedMovie.poster_path, "w500")})` }} />
                                    : <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(upcomingClickedMovie.backdrop_path, "w500")})` }} />}
                                <BigTitle>{upcomingClickedMovie.title}</BigTitle>
                                <BigOverview>{upcomingClickedMovie.overview}</BigOverview>
                            </>}
                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
        </>}</Wrapper >
    );
}
//   {upcomingClickedMovie && <>
//     <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(upcomingClickedMovie.poster_path, "w500")})` }} />
//     <BigTitle>{upcomingClickedMovie.title}</BigTitle>
//     <BigOverview>{upcomingClickedMovie.overview}</BigOverview>
// </>}
export default Home;