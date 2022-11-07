import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getRentalsAPI, updateRentalsAPI } from "../../action";
import styled from "styled-components";
import RentalPostalModal from "./RentalPostalModal";
import ImageDisplay from "../ImageDisplay";

const Container = styled.div`
    grid-area: main;
	/* align-items: center;
	margin-top: 70px;
	margin-left: 255px;
	margin-right: 295px; */
	max-width: 500px;
 	float: right;
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
	flex-direction: row;
	border: none;
	margin: 0 0 8px;
	color: #958b7b;
	button {
		display: flex;
		align-items: left;
		outline: 0;
		border: 0;
		font-size: 20px;
		font-weight: 400;
		color: #fff;
		cursor: pointer;
		background-image: linear-gradient(to right,#c82090,#6a14d1)!important;
		border-radius: 100px;
		padding: 10px 24px;
		white-space: nowrap;
		:hover {
			background-color: #c82090;
			background-image: none!important;
		}
	}
	img {
		margin-left: 10px;
		margin-top: 10px;
		width: 48px;
		border-radius: 50%;
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

const RentalDetails = styled.div`
	padding: 0 13px;
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

const monthLookup = ["Jan ", "Feb ", "Mar ", "Apr ", "May ", "Jun ", "Jul ", "Aug ", "Sep ", "Oct ", "Nov ", "Dec "];

function displayTime(date) {
	const secondsSince = Math.floor((Date.now() - date.valueOf())/1000)
	if (secondsSince < 60) {
		return secondsSince + "s"
	}
	else if (secondsSince < 3600) {
		return Math.floor(secondsSince/60) + "m"
	}
	else if (secondsSince < 86400) {
		return Math.floor(secondsSince/3600) + "h"
	}
	else if (secondsSince < 2628000) {
		return Math.floor(secondsSince/86400) + "d"
	}
	else if (new Date().getFullYear() === date.getFullYear()) {
		return monthLookup[date.getMonth()] + date.getDate()
	}
	else {
		return monthLookup[date.getMonth()] + date.getDate() + ", " + date.getFullYear()
	}
}

function Feed(props) {
	const [showModal, setShowModal] = useState("close");

	useEffect(() => {
		props.getRentals();
	}, []);
    
	const clickHandler = (event) => {
		event.preventDefault();
		if (event.target !== event.currentTarget) {
			return;
		}
		switch (showModal) {
			case "open":
				setShowModal("close");
				break;
			case "close":
				setShowModal("open");
				break;
			default:
				setShowModal("close");
				break;
		}
	};
	const user = props.user;
	const userInfo = user ? user.userInfo : null;
	let photoUrl = user ? user.photoURL : "/images/photo.svg";
	return (
        <Container>
            <CreateRental>
		 		<div>
				 	{photoUrl ? <img src={photoUrl} alt="" /> : <img src="/images/user.svg" alt="" />}
					{ userInfo && user.userInfo.status === "Landlord" &&
						<button onClick={()=>setShowModal("open")}>
							Create Post
						</button>
					}
					<RentalPostalModal showModal={showModal} clickHandler={clickHandler}/>
		 		</div>
		 	</CreateRental>
            <Content>
                {props.loading && <img src="/images/spin-loader.gif" alt="" />}
		 		{props.rentals && props.rentals.length > 0 &&
		 			props.rentals.map((rental, key) => (
		 				<Rental key={key}>
                            <Header>
								<a>
									{photoUrl ? <img src={photoUrl} alt="" /> : <img src="/images/user.svg" alt="" />}
									<div>
										<h3>{rental.title}</h3>
										<span>{rental.address}</span>
										<span>{displayTime(rental.date.toDate())}</span>
										{/* rental post + picture */}
									</div>
								</a>
								<icon>
									<button>
										<img src="/images/bookmark-fill.svg" alt="" />
									</button>
								</icon>
                            </Header>
							<Description>{rental.description}</Description>
                            <Body>
								{rental.photos && rental.photos.length >= 1 ?
 									<ImageDisplay images={rental.photos} /> :
 									<ImageDisplay images={["/images/no-image-available.png"]} />
 								}
                            </Body>
							<RentalDetails>
								<span>Rent: $</span>
								{rental.price}
								<span>/mo </span>
								<separator>  |  </separator>
								<span>Bds: </span>
								{rental.bedrooms}
								<span> </span>
								<separator>  |  </separator>
								<span>Ba: </span>
								{rental.bathrooms}
							</RentalDetails>
							<SocialActions>
								<button>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 1 26 26" data-supported-dps="26x26" fill="rgba(0, 0, 0, 0.6)" width="22" height="22" focusable="false">
										<path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.86V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z"></path>
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

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
		loading: state.rentalState.loading,
		rentals: state.rentalState.rentals,
		ids: state.rentalState.ids,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getRentals: () => dispatch(getRentalsAPI()),
	likeHandler: (payload) => dispatch(updateRentalsAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
