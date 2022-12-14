import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Firebase from 'firebase';
import { getUserAuth, postRoommate } from '../../action';

const Container = styled.div`
    position: fixed;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 11;
    background-color: rgba(0, 0, 0, 0.8);
    animation: fadeIn 0.3s ease;
`;

const Content = styled.div`
    width: 100%;
    max-width: 552px;
    max-height: 90%;
    background-color: #fff;
    overflow: initial;
    border-radius: 5px;
    position: relative;
    display: flex;
    flex-direction: column;
    top: 32px;
    margin: 0 auto;
`;

const Header = styled.div`
    display: block;
    padding: 10px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    font-size: 20px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
        font-weight: 400;
    }
    button {
        width: 40px;
        height: 40px;
        min-width: auto;
        border: none;
        outline: none;
        border-radius: 100px;
        background: transparent;
        img,
        svg {
            pointer-events: none;
        }
        &:hover {
            background-color: rgba(0, 0, 0, 0.2);
            svg {
                fill: rgba(0, 0, 0, 0.4);
            }
        }
    }
`;

const SharedContent = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    vertical-align: baseline;
    background: transparent;
    padding: 5px 12px;
`;

const ShareCreation = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 24px 10px 16px;
`;

const AttachAsset = styled.div`
    display: flex;
    align-items: center;
`;

const AssetButton = styled.button`
    display: flex;
    align-items: center;
    height: 40px;
    min-width: auto;
    margin-right: 8px;
    border-radius: 50%;
    border: none;
    outline: none;
    justify-content: center;
    background: transparent;
    &:hover {
        background: rgba(0, 0, 0, 0.08);
    }
`;

const PostButton = styled.button`
    display: inline-block;
    outline: 0;
    border: 0;
    font-size: 20px;
    font-weight: 400;
    color: #fff;
    cursor: pointer;
    background-image: linear-gradient(to right,#c82090,#6a14d1)!important;
    border-radius: 100px;
    padding: 10px 24px;
    margin: 10px 0px;
    white-space: nowrap;

    :hover {
        background-color: #c82090;
        background-image: none!important;
    }
`;

const Editor = styled.div`
    font-family: Arial, sans-serif;
    padding: 12px 24px;
    textarea {
        width: 100%;
        min-height: inherit;
        resize: both;
    }
    input {
        width: 100%;
        height: 35px;
        font-size: 16px;
        margin-bottom: 20px;
    }
`;

const UploadImage = styled.div`
    border-radius: 20px;
    padding: 10px 0px;
    margin: 10px 0px;
    cursor: pointer;
    text-align: center;
    img {
        width: 50%;
        padding: 6px;
    }
    &:hover {
        color: #A943D3;
        background-color: rgba(0, 0, 0, 0.2);
    }
`;

const RoommateEntry = styled.div`
    display: flex;
    padding: 10px 0px;
    align-items: center;
    justify-content: center;
    h3 {
        padding-right: 30px;
    }
`;

function RoommatePostalModal(props) {
    const [bedrooms, setBedrooms] = useState(1);
    const [sharedBathroom, setSharedBathroom] = useState(true);
    const [sharedBedroom, setSharedBedroom] = useState(true);
    const [bathrooms, setBathrooms] = useState(1);
    const [rentPrice, setRentPrice] = useState(500);
    const [smoking, setSmoking] = useState(false);
    const [pets, setPets] = useState(true);
    const [coords, setCoords] = useState({
        latitude: 37.00035647459514,
        longitude: -122.0631925615089,
    });
    const [address, setAddress] = useState('606 Engineering Loop, Santa Cruz, CA 95064');
    const [description, setDescription] = useState();
    const [title, setTitle] = useState();

    const [imageFiles, setImageFiles] = useState([]);
    const [videoFile, setVideoFile] = useState('');
    const [assetArea, setAssetArea] = useState('');

    const reset = (event) => {
        setBedrooms(1);
        setBathrooms(1);
        setRentPrice(500);
        setSmoking(false);
        setPets(true);
        setImageFiles([]);
        setAssetArea('');
        props.clickHandler(event);
    };

    function handleImage(event) {
        const image = event.target.files[0];

        if (image === '' || image === undefined) {
            alert(`Not an image. This file is: ${typeof imageFiles}`);
            return;
        }
        setImageFiles([...imageFiles, image]);
    }

    function switchAssetArea(area) {
        setImageFiles('');
        setVideoFile('');
        setAssetArea(area);
    }

    function postRoommate(event) {
        event.preventDefault();
        if (event.target !== event.currentTarget) {
            return;
        }

        const payload = {
            price: parseInt(rentPrice),
            bedrooms: parseInt(bedrooms),
            sharedBedroom,
            bathrooms: parseInt(bathrooms),
            sharedBathroom,
            description,
            address,
            title,
            preferences: {
                smoking,
                pets,
            },
            photos: imageFiles,
            coords,
            poster: props.user.uid,
            date: Firebase.firestore.Timestamp.now(),
        };
        props.postRoommate(payload);
        reset(event);
    }

    function Checkbox({ label, value, onChange }) {
        return (
            <h3>
                <input type="checkbox" checked={value} onChange={onChange} />
                {label}
            </h3>
        );
    }

    return (
        <>
            {props.showModal === 'open' && (
                <Container>
                    <Content>
                        <Header>
                            <h2>Create a Roommate Ad</h2>
                            <button onClick={(event) => reset(event)}>
                                <img src="/images/x-lg.svg" alt="" />
                            </button>
                        </Header>
                        <SharedContent>
                            <Editor>
                                <RoommateEntry>
                                    <h3>Bedrooms</h3>
                                    <input value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} placeholder="# of Bedrooms" autoFocus />
                                </RoommateEntry>
                                <RoommateEntry>
                                    <h3>Bathrooms</h3>
                                    <input value={bathrooms} onChange={(event) => setBathrooms(event.target.value)} placeholder="# of Bathrooms" autoFocus />
                                </RoommateEntry>
                                <RoommateEntry>
                                    <h3>Rent Price</h3>
                                    <input value={rentPrice} onChange={(event) => setRentPrice(event.target.value)} placeholder="How much is rent?" autoFocus />
                                </RoommateEntry>
                                <RoommateEntry>
                                    <h3>Address</h3>
                                    <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Where is it?" autoFocus />
                                </RoommateEntry>
                                <RoommateEntry>
                                    <h3>Title</h3>
                                    <textarea value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title of Post" autoFocus />
                                </RoommateEntry>
                                <RoommateEntry>
                                    <h3>Description</h3>
                                    <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tell us about the roommate!" autoFocus />
                                </RoommateEntry>
                                {assetArea === 'image' ? (
                                    <UploadImage>
                                        <input type="file" accept="image/gif, image/jpeg, image/png" name="image" id="imageFiles" onChange={handleImage} style={{ display: 'none' }} />
                                        <p>
                                            <label htmlFor="imageFiles">Upload Images</label>
                                        </p>
                                        {imageFiles && imageFiles.map((imgUrl, key) => <img key={key} src={URL.createObjectURL(imgUrl)} alt="" />)}
                                    </UploadImage>
                                ) : null}
                            </Editor>
                        </SharedContent>
                        <ShareCreation>
                            <AttachAsset>
                                <AssetButton onClick={() => switchAssetArea('image')}>
                                    <img src="/images/share-image.svg" alt="" />
                                </AssetButton>
                            </AttachAsset>
                            <PostButton onClick={(event) => postRoommate(event)}>
                                Post
                            </PostButton>
                        </ShareCreation>
                    </Content>
                </Container>
            )}
        </>
    );
}

const mapStateToProps = (state) => ({
    user: state.userState.user,
});

const mapDispatchToProps = (dispatch) => ({
    getUserAuth: () => dispatch(getUserAuth()),
    postRoommate: (payload) => dispatch(postRoommate(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoommatePostalModal);
