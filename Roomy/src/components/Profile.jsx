import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useParams, Redirect } from 'react-router-dom';
import db, { auth } from '../firebase';
import { getOtherUser, postExperience, updateProfileData } from '../action';
import { formatPhoneNumber } from '../action/commonFunctions';
import Sidebar from './Misc/Sidebar';
import Header from './Misc/Header';
import {FormControl, FormLabel, FormControlLabel, FormGroup, 
    InputLabel, Input, RadioGroup, Radio, Switch, Divider, ListItem,
    ListItemAvatar, Avatar, ListItemText, TextField, Typography} from '@mui/material';

const Container = styled.div`
    grid-area: center;
    align-items: center;
    background-size: cover;
    padding: 70px 20px 0px 255px;
    input {
        background-color: #ffffff;
        border-radius: 20px;

    }
`;

const ArtCard = styled.div`
    position: relative;
    text-align: center;
    overflow: hidden;
    margin-bottom: 8px;
    border-radius: 5px;
    background-color: #fff;
    transition: box-shadow 83ms;
    position: relative;
    border: none;
    box-shadow: 0 0 3px #999, 0 0 0 rgb(0 0 0 / 20%);
`;

const UserInfo = styled.div`
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    padding: 12px 12px 16px;
    word-wrap: break-word;
    word-break: break-word;
`;

const CardBackground = styled.div`
    background: url("/images/card-bg.png");
    background-position: center;
    background-size: 1200px;
    height: 82px;
    margin: -12px -12px 0;
`;

const Photo = styled.div`
    box-shadow: none;
    background: url(${(props) => props.photoUrl});
    width: 100px;
    height: 100px;
    box-sizing: border-box;
    background-clip: content-box;
    background-color: #fff;
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
    border: 2px solid white;
    margin: -38px auto 12px;
    border-radius: 50%;
`;

const Link = styled.div`
    font-size: 16px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.9);
    font-weight: 600;
`;

const CommunityCard = styled(ArtCard)`
    padding: 8px 0 0;
    text-align: left;
    display: flex;
    flex-direction: column;
    a {
        color: #000;
        padding: 4px 12px;
        font-size: 15px;
        span {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        &:last-child {
            color: black;
            border-top: 1px solid #d6cec2;
            padding: 12px;
        }
    }
`;

const LogoButton = styled.button`
    display: inline-block;
    outline: 0;
    border: 0;
    font-size: 16px;
    font-weight: 400;
    border: 2px solid #8f2bb8;
    color: #000;
    cursor: pointer;
    border-radius: 100px;
    padding: 10px 15px;
    margin: 6px 10px;
    white-space: nowrap;

    :hover {
        background-color: #F4ECF7;
        background-image: none!important;
    }
`;

const Title = styled.div`
    font-size: 25px;
    padding: 10px 15px;
    font-weight: bold;
    color: #8f2bb8;
`;

const PurpleTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: 'purple',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'purple',
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
        borderColor: 'purple',
        },
    },
});

function Profile(props) {
    const user = props.user ? props.user : null;
    const otherUser = props.otherUser ? props.otherUser : null;
    const photoUrl = otherUser ? otherUser.photoURL : '/images/photo.svg';
    const myUID = props.user ? props.user.uid : null;
    const [userType, setUserType] = useState('Renter');
    const [info, changeBio] = useState('');
    const [editMode, setEditMode] = useState(false);
    const { id } = useParams();

    // Experience
    const [expWhen, setExpWhen] = useState('');
    const [experience, setExperience] = useState('');

    // Edit profile data
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [roomWith, setRoomWith] = useState('');
    const [pets, setPets] = useState('');
    const [smoking, setSmoking] = useState('');
    const [visibility, setProfileVisibility] = useState(false);

    useEffect(() => {
        props.getOtherUser(id);
        if (user) {
            setUserType(user.userInfo ? user.userInfo.status : 'Renter');
        } else {
            setUserType('Renter');
        }
    }, [user]);

    useEffect(() => {
        if(otherUser){
            changeBio(otherUser.bio);
            setPhoneNumber(otherUser.phoneNumber);
            setGender(otherUser.gender);
            setProfileVisibility(otherUser.looking);
            setRoomWith(otherUser.preferences ? otherUser.preferences.roomWith : null);
            setPets(otherUser.preferences ? otherUser.preferences.pets : null);
            setSmoking(otherUser.preferences ? otherUser.preferences.smoking : null);
        }
    }, [otherUser]);

    const changeTo = (uType) => {
        db.collection('profiles').doc(auth.currentUser.uid).update({
            status: uType,
        });
        setUserType(uType);
    };

    const postUserExperience = () => {
        if (!experience.length || !expWhen) {
            alert('Fill the Experience Form Out Completely!');
        } else {
            postExperience(otherUser.uid, experience, expWhen);
            setExperience('');
            setExpWhen('');
            props.getOtherUser(id);
        }
    };

    const updateProfile = () => {
        const newProfileData = {
            bio: info,
            phoneNumber,
            gender,
            preferences: {
                roomWith,
                pets,
                smoking,
            },
            looking: visibility,
        };
        updateProfileData(newProfileData);
        props.getOtherUser(id);
        setEditMode(false);
    };

    return (
        <span>
            {/* Force out if not logged in */}
            {(!props.user && !props.loggingIn) && <Redirect to="/" />}

            <Header />
            <Sidebar />
            <Container>
                <ArtCard>
                    <UserInfo>
                        <CardBackground />
                        <a>
                            <Photo photoUrl={photoUrl ? photoUrl : '/images/user.svg'} />
                            <Link data-testid="name">{otherUser ? otherUser.displayName : 'N/A'}</Link>
                        </a>
                        <h3>
                            Status:
                            {userType}
                        </h3>
                        { otherUser && user && otherUser.uid === user.uid
                            ? (
                                <>
                                    {editMode
                                        ? (
                                            <>
                                                <LogoButton type="submit" onClick={updateProfile}>Save</LogoButton>
                                                <LogoButton type="submit" onClick={() => setEditMode(false)}>Cancel</LogoButton>
                                            </>
                                        )
                                        : <LogoButton type="submit" onClick={() => setEditMode(true)}>Edit</LogoButton>}
                                </>
                            )
                            : null}
                    </UserInfo>
                </ArtCard>
                {/* Make profile public / private */}
                {editMode && (
                    <CommunityCard>
                        <Title>Profile Visibility</Title>
                        <span>
                            <FormGroup sx={{ m: 2 }}>
                                <FormControlLabel control={<Switch checked={visibility} onChange={(e)=>setProfileVisibility(e.target.checked)} />} label={visibility ? "Public" : "Private" } />
                            </FormGroup>
                        </span>
                    </CommunityCard>
                )}
                { visibility || (otherUser && user && otherUser.uid === user.uid) ? (
                    <>
                        <CommunityCard>
                            <Title> About Me</Title>
                            <a>
                                {!editMode
                                    ? (
                                        <>
                                            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Bio:</Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {otherUser && otherUser.bio && otherUser.bio.length ? otherUser.bio : 'This user has no bio.'}
                                            </Typography>
                                            <Divider />
                                            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Phone Number:</Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {otherUser && otherUser.phoneNumber && otherUser.phoneNumber.length ? formatPhoneNumber(otherUser.phoneNumber) : 'This user has no phone number linked.'}
                                            </Typography>
                                            <Divider />
                                            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Gender:</Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {otherUser && otherUser.gender && otherUser.gender.length ? otherUser.gender : 'This user doesn\'t have their gender set.'}
                                            </Typography>
                                        </>
                                    )
                                    : (
                                        <>
                                            {otherUser && user && otherUser.uid === user.uid
                                            && (
                                                <>
                                                    <div>
                                                        <PurpleTextField multiline rows={4} maxRows={6} variant="outlined" label="Bio" margin="dense" placeholder='Tell Us About Yourself' 
                                                        value={info} onChange={(e) => changeBio(e.target.value)} id="bio" />
                                                    </div>
                                                    <div>
                                                        <PurpleTextField label="Phone Number" margin="dense" placeholder='1112223333' variant="outlined" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} id="phoneNumber" />
                                                    </div>
                                                    <div>
                                                        <FormControl margin="dense" color="secondary">
                                                            <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                                                            <RadioGroup
                                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                                name="controlled-radio-buttons-group"
                                                                value={gender}
                                                                onChange={(e) => setGender(e.target.value)}
                                                            >
                                                                <FormControlLabel value="Female" control={<Radio color='secondary'/>} label="Female" />
                                                                <FormControlLabel value="Male" control={<Radio color='secondary'/>} label="Male" />
                                                                <FormControlLabel value="Non-Binary" control={<Radio color='secondary'/>} label="Non-Binary" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                            </a>
                            {otherUser && user && otherUser.uid === user.uid && editMode
                                && (
                                    <a>
                                        <span>Change Your Status</span>
                                        <span>
                                            <LogoButton onClick={() => changeTo('Landlord')}>Landlord</LogoButton>
                                        </span>
                                        <LogoButton onClick={() => changeTo('Renter')}>Renter</LogoButton>
                                    </a>
                                )}
                        </CommunityCard>
                        <CommunityCard>
                            <Title>Preferences</Title>
                            <a>
                                {!editMode
                                    ? (
                                        <>
                                            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Gender Preference:</Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {otherUser && otherUser.preferences && otherUser.preferences.roomWith ? otherUser.preferences.roomWith : 'Any'}
                                            </Typography>
                                            <Divider />
                                            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Pets:</Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {otherUser && otherUser.preferences && otherUser.preferences.pets ? otherUser.preferences.pets : 'OK with pets'}
                                            </Typography>
                                            <Divider />
                                            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Living With A Smoker:</Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {otherUser && otherUser.preferences && otherUser.preferences.smoking ? otherUser.preferences.smoking : 'Doesn\'t matter'}
                                            </Typography>
                                        </>
                                    )
                                    : (
                                        <>
                                            {otherUser && user && otherUser.uid === user.uid
                                            && (
                                                <>
                                                    <div>
                                                        <FormControl color="secondary" variant="standard" margin='dense' style={{width:'15%'}}>
                                                            <InputLabel shrink htmlFor="component-helper">Roommate Gender</InputLabel>
                                                            <Input id="component-helper" placeholder='Male / Female / Any' aria-describedby="component-helper-text" value={roomWith} onChange={(e) => setRoomWith(e.target.value)} />
                                                        </FormControl>
                                                    </div>
                                                    <div>
                                                        <FormControl color="secondary" variant="standard" margin='dense' style={{width:'15%'}}>
                                                            <InputLabel shrink htmlFor="component-helper">Pets</InputLabel>
                                                            <Input id="component-helper" placeholder='Are you OK with pets? / Do you have any?' aria-describedby="component-helper-text" value={pets} onChange={(e) => setPets(e.target.value)} />
                                                        </FormControl>
                                                    </div>
                                                    <div>
                                                        <FormControl color="secondary" variant="standard" margin='dense' style={{width:'15%'}}>
                                                            <InputLabel shrink htmlFor="component-helper">Smokers</InputLabel>
                                                            <Input id="component-helper" placeholder='Are you OK with living with smokers?' aria-describedby="component-helper-text" value={smoking} onChange={(e) => setSmoking(e.target.value)} />
                                                        </FormControl>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                            </a>
                        </CommunityCard>
                        <CommunityCard>
                            <Title> Experiences</Title>
                            {/* Add your experience */}
                            {otherUser && user && otherUser.uid !== myUID
                            && (
                                <a>
                                    <span>
                                        <textarea
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            placeholder="Your Experience"
                                            id="experience"
                                        />
                                        <input
                                            type="text"
                                            value={expWhen}
                                            onChange={(e) => setExpWhen(e.target.value)}
                                            placeholder="When was this?"
                                            id="when"
                                        />
                                        <LogoButton onClick={postUserExperience}>Submit</LogoButton>
                                    </span>
                                </a>
                            )}
                            {otherUser && otherUser.experiences && otherUser.experiences.length ? (
                                <>
                                    {otherUser.experiences.map((exp, index) => (
                                        <div key={index}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar src={exp.profilePic} />
                                                </ListItemAvatar>
                                                <ListItemText primary={exp.displayName} secondary={exp.experience} />
                                                <p>When: {exp.when}</p>
                                            </ListItem>
                                            <Divider />
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <a>
                                    <span>No Experiences Listed</span>
                                </a>
                            )}
                        </CommunityCard>
                    </>
                )
                    : (
                        <>
                            { !props.loggingIn
                        && (
                            <CommunityCard>
                                <Title style={{ textAlign: 'center' }}> This page is private</Title>
                            </CommunityCard>
                        )}
                        </>
                    )}
            </Container>
        </span>
    );
}

const mapStateToProps = (state) => ({
    user: state.userState.user,
    otherUser: state.otherUserState.otherUser,
    loggingIn: state.userState.loggingIn,
});

const mapDispatchToProps = (dispatch) => ({
    getOtherUser: (uid) => dispatch(getOtherUser(uid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
