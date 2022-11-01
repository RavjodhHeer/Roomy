import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import db, { auth, provider, storage } from "../firebase";

const Container = styled.div`
	grid-area: right;
`;

const ArtCard = styled.div`
	top: 50px;
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
	background-size: 462px;
	height: 54px;
	margin: -12px -12px 0;
`;

const Photo = styled.div`
	box-shadow: none;
	background: url(${props => props.photoUrl});
	width: 72px;
	height: 72px;
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
		font-size: 12px;
		&:hover {
			color: #A943D3;
		}
		span {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		&:last-child {
			color: rgba(0, 0, 0, 0.6);
			border-top: 1px solid #d6cec2;
			padding: 12px;
			&:hover {
				background-color: rgba(0, 0, 0, 0.08);
			}
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
    color: #fff;
    cursor: pointer;
    background-image: linear-gradient(to right,#c82090,#6a14d1)!important;
    border-radius: 100px;
    padding: 10px 15px;
    margin: 2px 0px;
    white-space: nowrap;

    :hover {
        background-color: #c82090;
        background-image: none!important;
    }
`;


function Left(props) {
	let user = props.user ? props.user : null;
	let photoUrl = user ? user.photoURL : "/images/photo.svg";
	let uid = props.user ? props.user.uid : null;
	const [userType, setUserType] = useState("Renter");

	useEffect(()=>{
		if (user){
			setUserType(user.userInfo ? user.userInfo.status : "Renter");
		} else {
			setUserType("Renter");
		}
	},[user]);

	const changeToLandlord = () => {
		db.collection("profiles").doc(auth.currentUser.uid).set({
			status: 'Landlord'
		});
		setUserType("Landlord");
	}
	
	const changeToRenter = () => {
		db.collection("profiles").doc(auth.currentUser.uid).set({
			status: 'Renter'
		});
		setUserType("Renter");
	}

	return (
		<Container>
			<ArtCard>
				<UserInfo>
					<CardBackground />
					<a>
						<Photo photoUrl={photoUrl} />
						<Link>Welcome, {user ? user.displayName : "there"}!</Link>
					</a>
					<h3>Status: {userType}</h3>
					<a href={"/profile/"+uid}>
						<AddPhotoText>
							Edit Profile
						</AddPhotoText>
					</a>
				</UserInfo>
				<Widget>
					<a>
						<div>
							<span>Rentals</span>
							<span>Manage Rentals or Applications</span>
							<LogoButton onClick={changeToLandlord}>I am a Landlord</LogoButton>
							<LogoButton onClick={changeToRenter}>I am a Renter</LogoButton>
						</div>
						<img src="/images/widget-icon.svg" alt="" />
					</a>
				</Widget>
				<Item>
					<span>
						<img src="/images/item-icon.svg" alt="" />
						Saved Properties
					</span>
				</Item>
			</ArtCard>
			<CommunityCard>
				<a>
					<span>Roommates</span>
				</a>
				<a>
					<span>
						Social
						<img src="/images/plus-icon.svg" alt="" />
					</span>
				</a>
				<a>
					<span>Find Rentals</span>
				</a>
				<a>
					<span>Discover More</span>
				</a>
			</CommunityCard>
		</Container>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
	};
};

export default connect(mapStateToProps)(Left);
