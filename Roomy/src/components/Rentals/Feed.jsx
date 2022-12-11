import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { saveProperty } from '../../action'; // Like handler in the future
import { displayTime } from '../../action/commonFunctions';
import RentalPostalModal from './RentalPostalModal';
import ImageDisplay from '../Misc/ImageDisplay';
import { connect } from 'react-redux';

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
    padding: 13px 13px;
    margin-top: -13px;
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
    const [bookmarkMap, setBookmarkMap] = useState(new Map());
    const [done, setDone] = useState(false);
    const user = props ? props.user : null;
    const userInfo = user ? user.userInfo : null;
    const photoUrl = user ? user.photoURL : '/images/photo.svg';

    useEffect(()=>{
        if(props.user && props.user.userInfo){
            const savedProperties = new Map();
            if(userInfo.savedProperties){
                for(let elem of userInfo.savedProperties){
                    savedProperties.set(elem, true);
                }
            }
            setBookmarkMap(savedProperties);
        }
    },[props.user]);

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

    const bookmarkOnClickHandler = (id) => {
        const temp_savedProperties = bookmarkMap;
        if(temp_savedProperties.get(id)){
            props.saveProperty(id, 'False');
            temp_savedProperties.delete(id);
        } else {
            props.saveProperty(id, 'True');
            temp_savedProperties.set(id, true);
        }
        setBookmarkMap(temp_savedProperties);
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
                                         <span>{displayTime(rental.date)}</span>
                                     </div>
                                 </a>
                                 <button
                                    onClick={() => bookmarkOnClickHandler(props.ids[key])}>
                                     {<img src={bookmarkMap.get(props.ids[key]) ? '/images/bookmark-filled.svg' : '/images/bookmark-unfilled.svg'} width="85%" height="85%" alt="" />}
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
                         </Rental>
                     ))}
            </Content>
        </Container>
    );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
    saveProperty: (id, save) => dispatch(saveProperty(id, save)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);