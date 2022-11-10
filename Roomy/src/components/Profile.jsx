import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import db, { auth, provider, storage } from "../firebase";
import { getOtherUser, postExperience } from "../action";
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

const Widget = styled.div`
	border-bottom: 1px solid rgba(0, 0, 0, 0.15);
	padding: 12px 0;
	& > a {
		text-decoration: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 4px 12px;
		div {
			display: flex;
			flex-direction: column;
			text-align: left;
			span {
				font-size: 12px;
				line-height: 1.333;
				&:first-child {
					color: rgba(0, 0, 0, 0.6);
				}
				&:nth-child(2) {
					color: #000;
				}
			}
		}
	}
`;

const Item = styled.a`
	display: block;
	border-color: rgba(0, 0, 0, 0.6);
	text-align: left;
	padding: 12px;
	font-size: 12px;
	span {
		display: flex;
		align-items: center;
	}
	&:hover {
		background-color: rgba(0, 0, 0, 0.08);
	}
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
		&:hover {
			color: #A943D3;
		}
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
    margin: 6px 0px;
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

const sub = styled.div`
    font-size: 25px;
`;


function Profile(props) {
	let user = props.user ? props.user : null;
	let otherUser = props.otherUser ? props.otherUser : null;
	let photoUrl = otherUser ? otherUser.photoURL : "/images/photo.svg";
	let myUID = props.user ? props.user.uid : null;
	const [userType, setUserType] = useState("Renter");
	const [info, changeBio] = useState("About You");
	let { id } = useParams();

	//Experience
	const [expWhen, setExpWhen] = useState("");
	const [experience, setExperience] = useState("");
	
	useEffect(()=>{
		props.getOtherUser(id);
		if (user){
			setUserType(user.userInfo ? user.userInfo.status : "Renter");
		} else {
			setUserType("Renter");
		}
		if(otherUser) {
			changeBio(otherUser.bio);
		}
	},[user]);

	const changeTo = (uType) => {
		db.collection("profiles").doc(auth.currentUser.uid).update({
			status: uType
		});
		setUserType(uType);
	}

	const writeData = event => {
		event.preventDefault();
		var info = event.target.elements.bio.value;
		changeBio(info);
		db.collection("profiles").doc(auth.currentUser.uid).update({
			bio: info
		});
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
							<Link>{otherUser ? otherUser.displayName : "N/A"}</Link>
						</a>
						<h3>Status: {userType}</h3>
						<a href={"/profile/"+myUID}>
							<AddPhotoText>
								Edit Profile
							</AddPhotoText>
						</a>
					</UserInfo>
				</ArtCard>
				<CommunityCard>
					<Title> About Me</Title>
						<a>
							<h2>{info ? info : "This user has no bio."}</h2>
							{otherUser && user && otherUser.uid == user.uid && 
								<form onSubmit={writeData}>
									<input type="text" placeholder="Edit Bio" id="bio"/>
									<LogoButton type="submit">Edit</LogoButton>
								</form>
							}
						</a>
						{otherUser && user && otherUser.uid == user.uid && 
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
