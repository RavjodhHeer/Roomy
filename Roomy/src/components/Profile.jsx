import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import db, { auth } from "../firebase";
import { getOtherUser, postExperience, updateProfileData } from "../action";
import Sidebar from "./Sidebar"
import Header from "./Header"
import { useParams, Redirect } from 'react-router-dom';

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
	background: url(${props => props.photoUrl});
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

const AddPhotoText = styled.div`
	color: #8f2bb8;
	margin-top: 4px;
	font-size: 12px;
	line-height: 1.33;
	font-weight: 400;
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

const Button = styled.button`
  display: inline-block;
  outline: 0;
  text-align: left;
  align-items: bottom;
  background-color: white;
  border-color: #fff;
  border: 1px solid transparent;
  color: black;
  font-weight: 400;
  border-radius: 30px;
  font-size: 14px;
  padding: 5px 10px;
  margin: 10px 0px;
  cursor: pointer;
  text-align: center;
  &:hover {
    color: #A943D3;
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

const SignIn = styled.a`
	box-shadow: inset 0 0 0 1px #7822C7;
	border-radius: 25px;
	color: #7822C7;
	font-size: 16px;
	font-weight: 600;
	transition-duration: 167ms;
	line-height: 40px;
	padding: 10px 25px;
	text-align: center;
	background-color: transparent;
	&:hover {
		background-color: rgba(112, 181, 249, 0.15);
		box-shadow: inset 0 0 0 2px #7822C7;
	}
`;


function Profile(props) {
	let user = props.user ? props.user : null;
	let otherUser = props.otherUser ? props.otherUser : null;
	let photoUrl = otherUser ? otherUser.photoURL : "/images/photo.svg";
	let myUID = props.user ? props.user.uid : null;
	const [userType, setUserType] = useState("Renter");
	const [info, changeBio] = useState("About You");
	const [editMode, setEditMode] = useState(false);
	let { id } = useParams();

	//Experience
	const [expWhen, setExpWhen] = useState("");
	const [experience, setExperience] = useState("");

	// Edit profile data
	const [phoneNumber, setPhoneNumber] = useState("");
	const [gender, setGender] = useState("");
	const [roomWith, setRoomWith] = useState("");
	const [pets, setPets] = useState("");
	const [smoking, setSmoking] = useState("");
	const [visibility, setProfileVisibility] = useState(false);
	
	useEffect(()=>{
		props.getOtherUser(id);
		if (user){
			setUserType(user.userInfo ? user.userInfo.status : "Renter");
		} else {
			setUserType("Renter");
		}
		if(otherUser) {
			changeBio(otherUser.bio);
			setPhoneNumber(otherUser.phoneNumber);
			setGender(otherUser.gender);
			setProfileVisibility(otherUser.looking);
			setRoomWith(otherUser.preferences ? otherUser.preferences.roomWith : null);
			setPets(otherUser.preferences ? otherUser.preferences.pets : null);
			setSmoking(otherUser.preferences ? otherUser.preferences.smoking : null);
		}
	},[user]);

	const changeTo = (uType) => {
		db.collection("profiles").doc(auth.currentUser.uid).update({
			status: uType
		});
		setUserType(uType);
	}

	const postUserExperience = () => {
		if(!experience.length || !expWhen){
			alert("Fill the Experience Form Out Completely!");
		} else {
			postExperience(otherUser.uid, experience, expWhen);
			setExperience("");
			setExpWhen("");
			props.getOtherUser(id);
		}
	}

	const updateProfile = () => {
		const newProfileData = {
			bio: info,
			phoneNumber: phoneNumber,
			gender: gender,
			preferences: {
				roomWith: roomWith,
				pets: pets,
				smoking: smoking,
			},
			looking: visibility
		};
		updateProfileData(newProfileData);
		props.getOtherUser(id);
		setEditMode(false);
	}

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
							<Photo photoUrl={photoUrl} />
							<Link data-testid="name">{otherUser ? otherUser.displayName : "N/A"}</Link>
						</a>
						<h3>Status: {userType}</h3>
						{ otherUser && user && otherUser.uid == user.uid ?
							<>
							{editMode ?
								<>
									<LogoButton type="submit" onClick={updateProfile}>Save</LogoButton>
									<LogoButton type="submit" onClick={()=>setEditMode(false)}>Cancel</LogoButton>
								</>
							:	
								<LogoButton type="submit" onClick={()=>setEditMode(true)}>Edit</LogoButton>
							}
							</>
						:null
						}
					</UserInfo>
				</ArtCard>
				{/* Make profile public / private */}
				{editMode && 
					<CommunityCard>
						<Title>Profile Visibility</Title>
							<span>
								<SignIn onClick={()=>setProfileVisibility(!visibility)}>{visibility ? "Make Profile Private" : "Make Profile Public"}</SignIn>
							</span>
					</CommunityCard>
				}
				{ visibility || (otherUser && user && otherUser.uid == user.uid) ? <>
					<CommunityCard>
						<Title> About Me</Title>
							<a>
								{!editMode ?
									<>
										<a>
											<h1>Bio:</h1>
											<span>{otherUser && otherUser.bio && otherUser.bio.length ? otherUser.bio : "This user has no bio."}</span>
										</a>
										<a>
											<h1>Phone Number:</h1>
											<span>{otherUser && otherUser.phoneNumber && otherUser.phoneNumber.length ? otherUser.phoneNumber : "This user has no phone number linked."}</span>
										</a>
										<a>
											<h1>Gender:</h1>
											<span>{otherUser && otherUser.gender && otherUser.gender.length ? otherUser.gender : "This user doesn't have their gender set."}</span>
										</a>
									</>
								:
									<>
										{otherUser && user && otherUser.uid == user.uid && 
											<>
												<div>
													<h2>Bio:</h2>
													<textarea type="text" placeholder="Edit Bio" value={info} onChange={(e)=>changeBio(e.target.value)} id="bio"/>
												</div>
												<div>
													<h2>Phone Number:</h2>
													<input type="number" placeholder="Edit Bio" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} id="phoneNumber"/>
												</div>
												<div>
													<h2>I identify as:</h2>
													<input type="text" placeholder="Your Gender" value={gender} onChange={(e)=>setGender(e.target.value)} id="gender"/>
												</div>
											</>
										}
									</>
								}
							</a>
							{otherUser && user && otherUser.uid == user.uid && editMode &&
								<a>
									<span>Change Your Status</span>
									<span>
									<LogoButton onClick={()=> changeTo('Landlord')}>Landlord</LogoButton>
									</span>
									<LogoButton onClick={()=> changeTo('Renter')}>Renter</LogoButton>
								</a>
							}
					</CommunityCard>
					<CommunityCard>
						<Title>Preferences</Title>
							<a>
								{!editMode ?
									<>
										<a>
											<h1>Gender Preference:</h1>
											<span>{otherUser && otherUser.preferences && otherUser.preferences.roomWith ? otherUser.preferences.roomWith : "Any"}</span>
										</a>
										<a>
											<h1>Pets:</h1>
											<span>{otherUser && otherUser.preferences && otherUser.preferences.pets ? otherUser.preferences.pets : "OK with pets"}</span>
										</a>
										<a>
											<h1>Do they want to live with a smoker:</h1>
											<span>{otherUser && otherUser.preferences && otherUser.preferences.smoking ? otherUser.preferences.smoking : "Doesn't matter"}</span>
										</a>
									</>
								:
									<>
										{otherUser && user && otherUser.uid == user.uid && 
											<>
												<div>
													<h2>Prefers to room with:</h2>
													<input type="text" placeholder="Male / Female / Any" value={roomWith} onChange={(e)=>setRoomWith(e.target.value)}/>
												</div>
												<div>
													<h2>Are you OK with pets? / Do you have any?</h2>
													<textarea type="text" placeholder="Are you OK with pets? / Do you have any?" value={pets} onChange={(e)=>setPets(e.target.value)}/>
												</div>
												<div>
													<h2>Do you want to live with a smoker?</h2>
													<input type="text" placeholder="Yes / No" value={smoking} onChange={(e)=>setSmoking(e.target.value)}/>
												</div>
											</>
										}
									</>
								}
							</a>
					</CommunityCard>
					<CommunityCard>
						<Title> Experiences</Title>
						{/* Add your experience */}
						{otherUser && user && otherUser.uid != myUID && 
							<a>
								<span>
									<textarea value={experience}
										onChange={(e)=>setExperience(e.target.value)}
										placeholder="Your Experience" id="experience" />
									<input type="text" value={expWhen}
										onChange={(e)=>setExpWhen(e.target.value)}
										placeholder="When was this?" id="when" />
									<LogoButton onClick={postUserExperience}>Submit</LogoButton>
								</span>
							</a>
						}
						{otherUser && otherUser.experiences && otherUser.experiences.length ?
							<>
								{otherUser.experiences.map((exp, index) => (
									<a key={index}>
										<span>Poster: {exp.displayName}</span>
										<h3>Experience: {exp.experience}</h3>
										<span>When: {exp.when}</span>
									</a>
								))}
							</>
						:
							<a>
								<span>No Experiences Listed</span>
							</a>
						}
					</CommunityCard>
				</>
				:
				<>
					{ !props.loggingIn &&
						<CommunityCard> 
							<Title style={{ textAlign:'center' }}> This page is private</Title>
						</CommunityCard>
					}
				</>
				}
			</Container>
        </span>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
		otherUser: state.otherUserState.otherUser,
		loggingIn: state.userState.loggingIn,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getOtherUser: (uid) => dispatch(getOtherUser(uid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
