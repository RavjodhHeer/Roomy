import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { getArticlesAPI, updateArticleAPI } from '../../action';
import { displayTime } from '../../action/commonFunctions';
import { useParams, Redirect} from 'react-router-dom';
import Sidebar from '../Misc/Sidebar';
import Header from '../Misc/Header';

const Container = styled.div`
    grid-area: main;
`;

const CommonBox = styled.div`
    text-align: center;
    overflow: hidden;
    margin-bottom: 8px;
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    border: none;
    box-shadow: 0 0 3px #999, 0 0 0 rgb(0 0 0 / 20%);
`;

const ShareBox = styled(CommonBox)`
    top: 65px;
    left: 245px;
    display: flex;
    flex-direction: column;
    border: none;
    margin: 0 0 8px;
    color: #958b7b;
    padding: 10px;
    width: calc(100vw - 285px);
    a {
        span {
            color: #A943D3;
        }
    }
`;

const Article = styled(CommonBox)`
    top: 65px;
    left: 245px;
    padding: 0;
    margin: 0 0 8px;
    overflow: visible;
    width: calc(100vw - 265px);
`;

const SharedActor = styled.div`
    padding-right: 40px;
    flex-wrap: nowrap;
    padding: 12px 16px 0;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    a {
        margin-right: 12px;
        flex-grow: 1;
        overflow: hidden;
        display: flex;
        img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
        }
        & > div {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            flex-basis: 0;
            margin-left: 8px;
            overflow: hidden;
            span {
                text-align: left;
                &:first-child {
                    font-size: 14px;
                    font-weight: 700;
                    color: #000;
                }
                &:nth-child(n + 2) {
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.6);
                }
            }
        }
    }
    button {
        position: absolute;
        top: 0;
        right: 12px;
        border: none;
        outline: none;
        background: transparent;
    }
`;

const Description = styled.div`
    padding: 0 16px;
    overflow: hidden;
    font-size: 14px;
    text-align: left;
`;

const SharedImage = styled.div`
    margin: 8px 16px 0;
    background-color: #f9fafb;
    img {
        width: 100%;
        height: 100%;
    }
`;

const SocialCount = styled.ul`
    line-height: 1.3;
    display: flex;
    align-items: flex-start;
    overflow: auto;
    margin: 0 16px;
    padding: 8px 0;
    border-bottom: 1px solid #e9efdf;
    color: rgba(0, 0, 0, 0.6);
    list-style: none;
    li {
        margin-right: 5px;
        font-size: 12px;
        button {
            display: flex;
            border: none;
            color: rgba(0, 0, 0, 0.6);
            background: transparent;
            span {
                padding-left: 5px;
            }
        }
    }
`;

const SocialActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 4px 12px;
    min-height: 40px;
    padding-bottom: 5px;
    button {
        display: inline-flex;
        align-items: center;
        padding: 8px;
        border: none;
        border-radius: 3px;
        background: transparent;
        span {
            margin-left: 4px;
            color: rgba(0, 0, 0, 0.6);
            font-size: 14px;
        }
        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
            span {
                color: rgba(0, 0, 0, 0.8);
            }
            svg {
                fill: rgba(0, 0, 0, 0.8);
            }
        }
    }
    button.active {
        span {
            color: #A943D3;
            font-weight: 600;
        }
        svg {
            fill: #A943D3;
        }
    }
`;

const Content = styled.div`
    text-align: center;
    & > img {
        width: 30px;
    }
`;

function Post(props) {
    const { id } = useParams();
    const [showModal, setShowModal] = useState('close');

    useEffect(() => {
        props.getArticles(id);
    }, []);

    function likeHandler(event, postIndex, id) {
        event.preventDefault();
        let currentLikes = props.articles[postIndex].likes.count;
        const { whoLiked } = props.articles[postIndex].likes;
        const user = props.user.email;
        const userIndex = whoLiked.indexOf(user);

        if (userIndex >= 0) {
            currentLikes--;
            whoLiked.splice(userIndex, 1);
        } else if (userIndex === -1) {
            currentLikes++;
            whoLiked.push(user);
        }

        const payload = {
            update: {
                likes: {
                    count: currentLikes,
                    whoLiked,
                },
            },
            id,
        };

        props.likeHandler(payload);
    }
    const user = props.user ? props.user : null;
    const photoUrl = user ? user.photoURL : '/images/photo.svg';
    const email = user ? user.email : null;
    return (
        <Container>
            {(!props.user && !props.loggingIn) && <Redirect to="/" />}
            <Sidebar />
            <Header />
            <ShareBox>
                <a href={`/feed`} style={{ textDecoration: 'none' }}>
                    <span>Go Back</span>
                </a>
            </ShareBox>
            <Content>
                {props.loading && <img src="/images/spin-loader.gif" alt="" />}
                {props.articles && props.articles.length > 0
                    && props.articles.map((article, key) => (
                        <Article key={key}>
                            <SharedActor>
                                <a href={article.actor.uid && `/profile/${article.actor.uid}`} style={{ textDecoration: 'none' }}>
                                    {article.actor.image ? <img src={article.actor.image} alt="" /> : <img src="/images/user.svg" alt="" />}
                                    <div>
                                        <span>{article.actor.title}</span>
                                        <span>{article.actor.description}</span>
                                        <span>{displayTime(article.actor.date.toDate())}</span>
                                    </div>
                                </a>
                                <button>
                                    <img src="/images/ellipses.svg" alt="" />
                                </button>
                            </SharedActor>
                            <Description>{article.description}</Description>
                            <SharedImage>
                                <a>{!article.sharedImg && article.video ? <ReactPlayer width="100%" url={article.video} /> : article.sharedImg && <img src={article.sharedImg} alt="" />}</a>
                            </SharedImage>
                            <SocialCount>
                                {props.articles[key].likes.count > 0 && (
                                    <>
                                        <li>
                                            <button>
                                                <img src="https://static-exp1.licdn.com/sc/h/d310t2g24pvdy4pt1jkedo4yb" alt="" />
                                                {/* <img src="https://static-exp1.licdn.com/sc/h/7fx9nkd7mx8avdpqm5hqcbi97" alt="" /> */}
                                                <span>{props.articles[key].likes.count}</span>
                                            </button>
                                        </li>
                                        <li>
                                            <a>
                                                {article.comments}
                                                {' '}
                                                comments
                                            </a>
                                        </li>
                                    </>
                                )}
                            </SocialCount>
                            <SocialActions>
                                <button onClick={(event) => likeHandler(event, key, props.ids[key])} className={props.articles[key].likes.whoLiked.indexOf(email) >= 0 ? 'active' : null}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 1 26 26" data-supported-dps="26x26" fill="rgba(0, 0, 0, 0.6)" width="22" height="22" focusable="false">
                                        <path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.86V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z" />
                                    </svg>
                                    <span>Like</span>
                                </button>
                                <button>
                                    <img src="/images/comment-icon.svg" alt="" />
                                    <span>Comment</span>
                                </button>
                                <button onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/post/${props.ids[key]}`)}}>
                                    <img src="/images/send-icon.svg" alt="" />
                                    <span>Share</span>
                                </button>
                            </SocialActions>
                        </Article>
                    ))}
            </Content>
        </Container>
    );
}

const mapStateToProps = (state) => ({
    user: state.userState.user,
    loggingIn: state.userState.loggingIn,
    articles: state.articleState.articles,
    ids: state.articleState.ids,
});

const mapDispatchToProps = (dispatch) => ({
    getArticles: (id) => dispatch(getArticlesAPI(id)),
    likeHandler: (payload) => dispatch(updateArticleAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
