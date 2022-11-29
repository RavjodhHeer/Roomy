import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { saveProperty } from '../../action'; // Like handler in the future
import { displayTime } from '../../action/commonFunctions';
import RentalPostalModal from './RentalPostalModal';
import ImageDisplay from '../Misc/ImageDisplay';

const Container = styled.div`
    flex-direction: column;
    /* background-color: white; */
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

const CreateRental = styled(CommonBox)`
    display: flex;
    flex-direction: column;
    border: none;
    margin: 0 0 8px;
    color: #958b7b;
    div {
        button {
            color: #65676b;
            font-size: 18px;
            border: none;
            line-height: 1.5;
            min-height: 48px;
            display: flex;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.1);
            font-weight: 300;
            &:hover {
                background-color: rgba(0, 0, 0, 0.15);
            }
        }
        &:first-child {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            img {
                width: 48px;
                border-radius: 50%;
                margin-right: 8px;
            }
            button {
                margin: 4px 0;
                flex-grow: 1;
                padding-left: 16px;
                border: none;
                border-radius: 35px;
                text-align: left;
            }
        }
        &:nth-child(2) {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            padding-bottom: 4px;
            button {
                img {
                    margin: 0 4px 0 -2px;
                }
            }
        }
    }
`;

const Rental = styled(CommonBox)`
    padding: 0;
    margin: 0 0 8px;
    overflow: visible;
`;

const Content = styled.div`
    text-align: center;
    & > img {
        width: 100px;
    }
`;

const Header = styled.div`
    padding: 10px 13px;
    overflow: hidden;
    font-size: 16px;
    text-align: left;
    button {
        img {
            margin-top: 15px;
        }
    }
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
                    font-size: 15px;
                    font-weight: 700;
                    color: #000;
                }
                &:nth-child(n + 2) {
                    font-size: 13px;
                    color: rgba(0, 0, 0, 0.6);
                }
            }
        }
    }
    button {
        position: absolute;
        top: -4px;
        right: 2px;
        border: none;
        outline: none;
        background: transparent;
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

const Description = styled.div`
    padding: 0 13px;
    overflow: hidden;
    font-size: 14px;
    text-align: left;
`;

const RentalDetails = styled.div`
    padding: 0 13px;
    color: rgba(0, 0, 0, 0.8);
    overflow: hidden;
    font-size: 15px;
    font-weight: 800;
    text-align: left;
`;

const Separator = styled.span`
    font-weight: 400;
`;

const Body = styled.div`
    margin-left: 10px;
    padding: 8px 0px 8px 0px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    flex-basis: calc(100% / 3);
    margin: 8px 16px 8px 8px;
    border-color: rgba(0, 0, 0, 0.2);
    img {
        border: 3px solid white;
        border-radius: 5px;
        width: 100%;
        height: 100%;
    }
`;

function Feed(props) {
    const [showModal, setShowModal] = useState('close');
    const [bookmarkMap, setBookmarkMap] = useState([]);

    const user = props ? props.user : null;
    const userInfo = user ? user.userInfo : null;
    const savedProperties = userInfo ? userInfo.savedProperties : null;
    const photoUrl = user ? user.photoURL : '/images/photo.svg';

    useEffect(() => {
        const element = document.getElementById(props.scrollKey);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [props.scrollKey]);

    const clickHandler = (event) => {
        event.preventDefault();
        if (event.target !== event.currentTarget) {
            return;
        }
        switch (showModal) {
        case 'open':
            setShowModal('close');
            break;
        case 'close':
            setShowModal('open');
            break;
        default:
            setShowModal('close');
            break;
        }
    };

    const bookmarkOnClickHandler = (id, key) => {
        bookmarkMap[key] === '/images/bookmark-filled.svg' ? saveProperty(id, 'False') : saveProperty(id, 'True');
        const newimage = bookmarkMap[key] === '/images/bookmark-unfilled.svg' ? '/images/bookmark-filled.svg' : '/images/bookmark-unfilled.svg';
        const nextMap = bookmarkMap.map((img, index) => {
            if (index === key) {
                return newimage;
            }
            return img;
        });
        setBookmarkMap(nextMap);
    };

    return (
        <Container>
            <CreateRental>
                { userInfo && props.allowposting && user.userInfo.status === 'Landlord' && (
                    <div>
                        {photoUrl ? <img src={photoUrl} alt="" /> : <img src="/images/user.svg" alt="" />}
                        <button onClick={() => setShowModal('open')}>
                            <span> List a property</span>
                        </button>
                    </div>
                )}
            </CreateRental>
            <RentalPostalModal showModal={showModal} clickHandler={clickHandler} />
            <Content>
                {props.loading && <img src="/images/spin-loader.gif" alt="" />}
                {props.rentals && props.rentals.length > 0
                     && props.rentals.map((rental, key) => (
                         <Rental id={key} key={key}>
                             <Header>
                                 <a href={rental.poster && `/profile/${rental.poster}`} style={{ textDecoration: 'none' }}>
                                     {rental.profilePic ? <img src={rental.profilePic} alt="" /> : <img src="/images/user.svg" alt="" />}
                                     <div>
                                         <h3>{rental.title}</h3>
                                         <span>{rental.address}</span>
                                         <span>{displayTime(rental.date.toDate())}</span>
                                     </div>
                                 </a>
                                 <button
                                     onLoad={savedProperties === null || bookmarkMap[key] ? console.log('Need to wait for DB') : setBookmarkMap(bookmarkMap[key] = (savedProperties && savedProperties.includes(props.ids[key])) ? '/images/bookmark-filled.svg' : '/images/bookmark-unfilled.svg')}
                                     onClick={() => bookmarkOnClickHandler(props.ids[key], key)}
                                 >
                                     {bookmarkMap[key] && <img src={bookmarkMap[key]} width="85%" height="85%" alt="" />}
                                 </button>
                             </Header>
                             <Description>{rental.description}</Description>
                             <Body>
                                 {rental.photos && rental.photos.length >= 1
                                     ? <ImageDisplay images={rental.photos} />
                                     : <ImageDisplay images={['/images/no-image-available.png']} />}
                             </Body>
                             <RentalDetails>
                                 <span>Rent: $</span>
                                 {rental.price}
                                 <span>/mo </span>
                                 <Separator>  |  </Separator>
                                 <span>Bds: </span>
                                 {rental.bedrooms}
                                 <span> </span>
                                 <Separator>  |  </Separator>
                                 <span>Ba: </span>
                                 {rental.bathrooms}
                             </RentalDetails>
                             <SocialActions>
                                 <button>
                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 1 26 26" data-supported-dps="26x26" fill="rgba(0, 0, 0, 0.6)" width="22" height="22" focusable="false">
                                         <path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.86V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z" />
                                     </svg>
                                     <span>Like</span>
                                 </button>
                                 <button>
                                     <img src="/images/comment-icon.svg" alt="" />
                                     <span>Comment</span>
                                 </button>
                                 <button>
                                     <img src="/images/share-icon.svg" alt="" />
                                     <span>Share</span>
                                 </button>
                                 <button>
                                     <img src="/images/send-icon.svg" alt="" />
                                     <span>Send application</span>
                                 </button>
                             </SocialActions>
                         </Rental>
                     ))}
            </Content>
        </Container>
    );
}

export default Feed;
