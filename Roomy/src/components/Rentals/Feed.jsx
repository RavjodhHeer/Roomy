import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getRentalsAPI, updateRentalsAPI } from "../../action";
import styled from "styled-components";
import RentalPostalModal from "./RentalPostalModal";

const Container = styled.div`
    grid-area: main;
    /* background-color: white;
    box-shadow: -5px 0px 5px #999;
    border-left: 1px solid rgba(0,0,0,0.08);
    padding: 0 0px;
    position: relative;
    top: 60px; 
    z-index: 80; */
    float: right;
`;

const CommonBox = styled.div`
	top: 50px;
	text-align: center;
	overflow: hidden;
	margin-bottom: 8px;
	background-color: #fff;
	border-radius: 5px;
	position: relative;
	border: none;
	box-shadow: 0 0 5px #999, 0 0 0 rgb(0 0 0 / 20%);
`;

const CreateRental = styled(CommonBox)`
	display: flex;
	flex-direction: column;
	margin: 0 0 8px;
	color: #958b7b;
    top: 60px;
    height: 50px;
`;

const Rental = styled(CommonBox)`
	padding: 0;
	margin: 0 0 8px;
	overflow: visible;
`;

const Content = styled.div`
	text-align: center;
	& > img {
		width: 30px;
	}
`;

const Header = styled.div`
    text-align: left;
    button {
        text-align: right;
		display: inline-flex;
		align-items: center;
		padding: 8px;
		border: none;
		background: transparent;
		span {
			margin-left: 4px;
			color: rgba(0, 0, 0, 0.6);
			font-size: 14px;
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

const Body = styled.div`

`;

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

	return (
        <Container>
            <CreateRental>
		 		<div>
					{ userInfo && user.userInfo.status === "Landlord" &&
						<button onClick={()=>setShowModal("open")}>Create Post</button>
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
                                <h3>{rental.title}</h3>
                                <span>{rental.address}</span>
                                {/* rental post + picture */}
                                <button>
                                    <img src="/images/bookmark.svg" alt="" />
                                </button>
                            </Header>
                            <Body>
								{rental.photos && rental.photos.map((x) => (
									<img src={x} style={{width: "100px"}} />
								))}
                            </Body>
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
