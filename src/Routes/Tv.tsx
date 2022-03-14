import { AnimatePresence, motion, useTransform, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getPopularTvShows, getTopRatedTvShows, getTvShows, IGetTvShowsResult } from "../api";
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

function Tv() {
    const [showPoster, setShowPoster] = useState(false);
    const togglePoster = () => { setShowPoster((prev) => !prev) }

    const history = useNavigate();
    const bigTvShouwsMatch = useMatch("/tv/now/:movieId");
    const bigPopularMatch = useMatch("/tv/popular/:movieId");
    const bigUpComingMatch = useMatch("/tv/toprated/:movieId");
    const { scrollY } = useViewportScroll();
    const setScrollY = useTransform(scrollY, (value) => value + 100);
    const { data: nowData, isLoading: nowLoadding } = useQuery<IGetTvShowsResult>(["TvShows", "nowTvShows"], getTvShows)
    const { data: popularData } = useQuery<IGetTvShowsResult>(["TvShows", "popular"], getPopularTvShows)
    const { data: upcomingData } = useQuery<IGetTvShowsResult>(["TvShows", "upcoming"], getTopRatedTvShows)
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
    const onTvShowsBoxClicked = (tvshouwsId: number) => { history(`/tv/now/${tvshouwsId}`) };
    const onPopularBoxClicked = (tvshouwsId: number) => { history(`/tv/popular/${tvshouwsId}`) };
    const onUpcomingBoxCilcked = (tvshouwsId: number) => { history(`/tv/toprated/${tvshouwsId}`) };
    const onOverlayClick = () => history("/tv");
    const nowClickedTvShows = bigTvShouwsMatch?.params.movieId && nowData?.results.find((movie) => movie.id + "" === bigTvShouwsMatch.params.movieId);
    const popularClickedTvShows = bigPopularMatch?.params.movieId && popularData?.results.find((movie) => movie.id + "" === bigPopularMatch.params.movieId);
    const upcomingClickedTvShows = bigUpComingMatch?.params.movieId && upcomingData?.results.find((movie) => movie.id + "" === bigUpComingMatch.params.movieId);

    return (
        <Wrapper >{nowLoadding ? <Loader>Loading...</Loader> : <>
            <Banner bgPhoto={makeImagePath(nowData?.results[0].backdrop_path || "")}>
                <Title>{nowData?.results[0].name}</Title>
                <Overview>{nowData?.results[0].overview}</Overview>
            </Banner>
            <Slider>
                <SliderTitle >today</SliderTitle>
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
                            .map((tvShows) =>
                                <Box
                                    layoutId={tvShows.id + "today"}
                                    onClick={() => onTvShowsBoxClicked(tvShows.id)}
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
                        <SliderBtn onClick={nowIncraseIndex} whileHover={{ opacity: 1 }}>&rarr;</SliderBtn>
                    </Row>
                </AnimatePresence>
            </Slider>
            <Slider style={{ top: "300px" }}>
                <SliderTitle >popular</SliderTitle>
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
                            .map((tvShows) =>
                                <Box
                                    layoutId={tvShows.id + "popular"}
                                    onClick={() => onPopularBoxClicked(tvShows.id)}
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
            <Slider style={{ top: "600px" }}>
                <SliderTitle >top_rated</SliderTitle>
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
                            .map((tvShows) =>
                                <Box
                                    layoutId={tvShows.id + "toprated"}
                                    onClick={() => onUpcomingBoxCilcked(tvShows.id)}
                                    key={tvShows.id}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    transition={{ type: "tween" }}
                                    bgphoto={makeImagePath(tvShows.poster_path, "w500")}
                                >
                                    <Info variants={infoVariants} >
                                        <h4>{tvShows.name}</h4>
                                    </Info>
                                </Box>
                            )}
                        <SliderBtn onClick={upcomingIncraseIndex} whileHover={{ opacity: 1 }}>&rarr;</SliderBtn>
                    </Row>
                </AnimatePresence>
            </Slider>


            <AnimatePresence>
                {bigTvShouwsMatch ? (
                    <>
                        <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                        <BigMovie style={{ top: setScrollY }} layoutId={bigTvShouwsMatch.params.movieId + "today"}>
                            {nowClickedTvShows && <>
                                <BigBtn whileHover={{ backgroundColor: "rgba(0,0,0,1)" }} onClick={togglePoster} >Show another poster</BigBtn>
                                {showPoster ? <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(nowClickedTvShows.poster_path, "w500")})` }} />
                                    : <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(nowClickedTvShows.backdrop_path, "w500")})` }} />}
                                <BigTitle>{nowClickedTvShows.name}</BigTitle>
                                <BigOverview>{nowClickedTvShows.overview}</BigOverview>
                            </>}

                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
            <AnimatePresence>
                {bigPopularMatch ? (
                    <>
                        <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                        <BigMovie style={{ top: setScrollY }} layoutId={bigPopularMatch.params.movieId + "popular"}>
                            {popularClickedTvShows && <>
                                <BigBtn whileHover={{ backgroundColor: "rgba(0,0,0,1)" }} onClick={togglePoster} >Show another poster</BigBtn>
                                {showPoster ? <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(popularClickedTvShows.poster_path, "w500")})` }} />
                                    : <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(popularClickedTvShows.backdrop_path, "w500")})` }} />}
                                <BigTitle>{popularClickedTvShows.name}</BigTitle>
                                <BigOverview>{popularClickedTvShows.overview}</BigOverview>
                            </>}
                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
            <AnimatePresence>
                {bigUpComingMatch ? (
                    <>
                        <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                        <BigMovie style={{ top: setScrollY }} layoutId={bigUpComingMatch.params.movieId + "toprated"}>
                            {upcomingClickedTvShows && <>
                                <BigBtn whileHover={{ backgroundColor: "rgba(0,0,0,1)" }} onClick={togglePoster} >Show another poster</BigBtn>
                                {showPoster ? <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(upcomingClickedTvShows.poster_path, "w500")})` }} />
                                    : <BigCover style={{ backgroundImage: `linear-gradient(transparent,black), url(${makeImagePath(upcomingClickedTvShows.backdrop_path, "w500")})` }} />}
                                <BigTitle>{upcomingClickedTvShows.name}</BigTitle>
                                <BigOverview>{upcomingClickedTvShows.overview}</BigOverview>
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
export default Tv;