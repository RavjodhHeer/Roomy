import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getRoommatesAPI, updateRoommatesAPI } from '../../action';
import { displayTime } from '../../action/commonFunctions';
import RoommatePostalModal from './RoommatePostalModal';
import ImageDisplay from '../Misc/ImageDisplay';

const Container = styled.div`
    grid-area: main;
    align-items: center;
    margin-top: 70px;
    margin-left: 255px;
    margin-right: 295px;
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

const CreateRoommate = styled(CommonBox)`
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

const Roommate = styled(CommonBox)`
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
    icon {
        img {
            margin-top: 10px;
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
        top: 0;
        right: 12px;
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

const RoommateDetails = styled.div`
    padding: 13px 13px;
    margin-top: -13px;
    color: rgba(0, 0, 0, 0.8);
    overflow: hidden;
    font-size: 15px;
    font-weight: 800;
    text-align: left;
    separator {
        font-weight: 400;
    }
`;

const Body = styled.div`
    margin-left: 10px;
    padding: 0px 0px 0px 0px;
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

function RoommateFeed(props) {
    const [showModal, setShowModal] = useState('close');

    useEffect(() => {
        props.getRoommates();
    }, []);

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
    const { user } = props;
    const userInfo = user ? user.userInfo : null;
    const photoUrl = user ? user.photoURL : '/images/photo.svg';
    return (
        <Container>
            <CreateRoommate>
                <div>
                    {photoUrl ? <img src={photoUrl} alt="" /> : <img src="/images/user.svg" alt="" />}
                    { userInfo && user.userInfo.status === 'Renter' && (
                        <button onClick={() => setShowModal('open')}>
                            <span> Post a Roomie</span>
                        </button>
                    )}
                </div>
            </CreateRoommate>
            <RoommatePostalModal showModal={showModal} clickHandler={clickHandler} />
            <Content>
                {props.loading && <img src="/images/spin-loader.gif" alt="" />}
                {props.roommates && props.roommates.length > 0 && props.roommates.map((roommate, key) => (
                    <Roommate key={key}>
                        <Header>
                            <a href={roommate.poster && `/profile/${roommate.poster}`} style={{ textDecoration: 'none' }}>
                                    {roommate.profilePic ? <img src={roommate.profilePic} alt="" /> : <img src="/images/user.svg" alt="" />}
                                <div>
                                    <h3>{roommate.title}</h3>
                                    <span>{roommate.address}</span>
                                    <span>{displayTime(roommate.date.toDate())}</span>
                                    {/* roommate post + picture */}
                                </div>
                            </a>
                            <icon>
                                <button>
                                    <img src="/images/bookmark-fill.svg" alt="" />
                                </button>
                            </icon>
                        </Header>
                        <Description>{roommate.description}</Description>
                        <Body>
                            {roommate.photos && roommate.photos.length >= 1
                                     ? <ImageDisplay images={roommate.photos} />
                                     : <ImageDisplay images={['/images/no-image-available.png']} />}
                        </Body>
                        <RoommateDetails>
                            <span>Rent: $</span>
                            {roommate.price}
                            <span>/mo </span>
                            <separator>  |  </separator>
                            <span>Bds: </span>
                            {roommate.bedrooms}
                            <span> </span>
                            <separator>  |  </separator>
                            <span>Ba: </span>
                            {roommate.bathrooms}
                        </RoommateDetails>
                    </Roommate>
                ))}
            </Content>
        </Container>
    );
}

const mapStateToProps = (state) => ({
    user: state.userState.user,
    loading: state.roommateState.loading,
    roommates: state.roommateState.roommates,
    ids: state.roommateState.ids,
});

const mapDispatchToProps = (dispatch) => ({
    getRoommates: () => dispatch(getRoommatesAPI()),
    likeHandler: (payload) => dispatch(updateRoommatesAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoommateFeed);
