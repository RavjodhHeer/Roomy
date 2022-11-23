import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import styled from 'styled-components';
import { postArticleAPI } from '../../action';

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

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 24px;
    img {
        width: 48px;
        height: 48px;
        background-clip: content-box;
        border-radius: 50%;
        border: 2px solid transparent;
    }
    span {
        font-weight: 600;
        font-size: 16px;
        line-height: 1.5;
        margin-left: 5px;
    }
`;

const ShareCreation = styled.div`
    display: flex;
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
        min-height: 100px;
        resize: none;
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
    }
    &:hover {
        color: #A943D3;
        background-color: rgba(0, 0, 0, 0.2);
    }
`;

function PostalModal(props) {
    const [editorText, setEditorText] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [videoFile, setVideoFile] = useState('');
    const [assetArea, setAssetArea] = useState('');

    const reset = (event) => {
        setEditorText('');
        setImageFile('');
        setVideoFile('');
        setAssetArea('');
        props.clickHandler(event);
    };

    function handleImage(event) {
        const image = event.target.files[0];

        if (image === '' || image === undefined) {
            alert(`Not an image. This file is: ${typeof imageFile}`);
            return;
        }
        setImageFile(image);
    }

    function switchAssetArea(area) {
        setImageFile('');
        setVideoFile('');
        setAssetArea(area);
    }

    function postArticle(event) {
        event.preventDefault();
        if (event.target !== event.currentTarget) {
            return;
        }

        const payload = {
            image: imageFile,
            video: videoFile,
            description: editorText,
            user: props.user,
            timestamp: Firebase.firestore.Timestamp.now(),
        };

        props.postArticle(payload);
        reset(event);
    }

    return (
        <>
            {props.showModal === 'open' && (
                <Container>
                    <Content>
                        <Header>
                            <h2>Create a post</h2>
                            <button onClick={(event) => reset(event)}>
                                <img src="/images/x-lg.svg" alt="" />
                            </button>
                        </Header>
                        <SharedContent>
                            <UserInfo>
                                {props.user.photoURL ? <img src={props.user.photoURL} alt="" /> : <img src="/images/user.svg" alt="" />}
                                <span>{props.user.displayName ? props.user.displayName : 'Name'}</span>
                            </UserInfo>
                            <Editor>
                                <textarea value={editorText} onChange={(event) => setEditorText(event.target.value)} placeholder="What's happening?" autoFocus />

                                {assetArea === 'image' ? (
                                    <UploadImage>
                                        <input type="file" accept="image/gif, image/jpeg, image/png" name="image" id="imageFile" onChange={handleImage} style={{ display: 'none' }} />
                                        <p>
                                            <label htmlFor="imageFile">Attach image</label>
                                        </p>
                                        {imageFile && <img src={URL.createObjectURL(imageFile)} alt="" />}
                                    </UploadImage>
                                ) : (
                                    assetArea === 'video' && (
                                        <>
                                            <input
                                                type="text"
                                                name="video"
                                                id="videoFile"
                                                value={videoFile}
                                                placeholder="Enter the video link"
                                                onChange={(event) => setVideoFile(event.target.value)}
                                            />
                                            {videoFile && <ReactPlayer width="100%" url={videoFile} />}
                                        </>
                                    )
                                )}
                            </Editor>
                        </SharedContent>
                        <ShareCreation>
                            <AttachAsset>
                                <AssetButton onClick={() => switchAssetArea('image')}>
                                    <img src="/images/share-image.svg" alt="" />
                                </AssetButton>
                                <AssetButton onClick={() => switchAssetArea('video')}>
                                    <img src="/images/share-video.svg" alt="" />
                                </AssetButton>
                            </AttachAsset>
                            <PostButton disabled={!editorText} onClick={(event) => postArticle(event)}>
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
    postArticle: (payload) => dispatch(postArticleAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostalModal);
