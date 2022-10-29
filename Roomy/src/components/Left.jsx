import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import db, { auth, provider, storage } from "../firebase";

const Container = styled.div`
	grid-area: right;
`;

const ArtCard = styled.div`
	top 50px;
	text-align: center;
	overflow: hidden;
	margin-bottom: 8px;
	border-radius: 2px;
	background-color: #fff;
	transition: box-shadow 83ms;
	position: relative;
	border: none;
	box-shadow: 0 0 5px #999, 0 0 0 rgb(0 0 0 / 20%);
`;

const UserInfo = styled.div`
	border-bottom: 1px solid rgba(0, 0, 0, 0.15);
	padding: 12px 12px 16px;
	word-wrap: break-word;
	word-break: break-word;
`;

const CardBackground = styled.div`
	background: url("/images/card-bg.svg");
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
	color: #0a66c2;
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
		&:hover {
			background-color: rgba(0, 0, 0, 0.08);
		}
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

function Left(props) {
	let user = props.user ? props.user : null;
	let photoUrl = user ? user.photoURL : "/images/photo.svg";
	let status = "";
	if (user){
		status = user.userInfo ? user.userInfo.status : "N/A";
	} else {
		status = "N/A";
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
					<h3>Status: {status}</h3>
					<a>
						<AddPhotoText>Edit Profile</AddPhotoText>
					</a>
				</UserInfo>
				<Widget>
					<a>
						<div>
							<span>Rentals</span>
							<span>Manage Rentals or Applications</span>
							<Button onClick={changeToLandlord}>I am a Landlord</Button>
							<Button onClick={changeToRenter}>I am a Renter</Button>
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

const changeToLandlord = () => {
	db.collection("profiles").doc(auth.currentUser.uid).set({
		status: 'Landlord'
	})
}

const changeToRenter = () => {
	db.collection("profiles").doc(auth.currentUser.uid).set({
		status: 'Renter'
	})
}
const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
	};
};

export default connect(mapStateToProps)(Left);
