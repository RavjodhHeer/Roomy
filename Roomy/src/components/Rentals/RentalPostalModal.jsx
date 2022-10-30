import React, {useState} from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getUserAuth, postRental } from "../../action";
import { Redirect } from "react-router";
import Firebase from "firebase";

const Google = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #fff;
	height: 56px;
	width: 100%;
	border-radius: 30px;
	box-shadow: inset 0 0 0 1px rgb(0 0 0 / 60%), inset 0 0 0 2px rgb(0 0 0 / 0%), inset 0 0 0 1px rgb(0 0 0 / 0);
	border: none;
	vertical-align: middle;
	transition-duration: 167ms;
	font-size: 20px;
	color: rgba(0, 0, 0, 0.6);
	z-index: 0;
	margin-bottom:10px;
	&:hover {
		background-color: rgba(207, 207, 207, 0.25);
		color: rgba(0, 0, 0, 0.75);
		box-shadow: inset 0 0 0 2px rgb(0 0 0 / 60%), inset 0 0 0 3px rgb(0 0 0 / 0%), inset 0 0 0 2px rgb(0 0 0 / 0);
	}
	img {
		margin-right: 25px;
	}
	input {
		border: none;
		background: transparent;
		margin-right: 10%;
	}
	input:focus{
		outline: none;
	}
`;

function RentalPostalModal (props){
    const [bedrooms, setBedrooms] = useState(1);
    const [sharedBathroom, setSharedBathroom] = useState(true);
    const [sharedBedroom, setSharedBedroom] = useState(true);
    const [bathrooms, setBathrooms] = useState(1);
    const [rentPrice, setRentPrice] = useState(500);
    const [smoking, setSmoking] = useState(false);
    const [pets, setPets] = useState(false);
    const [coords, setCoords] = useState({
        x: 123,
        y: 345
    })
    const [description, setDescription] = useState("Lovely room");
    const [photos, setPhotos] = useState([]);
    
    function postRental(){
        let payload = {
            price: rentPrice,
            bedrooms,
            sharedBedroom,
            bathrooms,
            sharedBathroom,
            description,
            preferences: {
                smoking,
                pets,
            },
            photos,
            coords,
            poster: props.user.uid,
            date: Firebase.firestore.Timestamp.now(),
        }
        props.postRental(payload);
    }
    return (
        <div>
            <Google><input type="email" size="40" value={bedrooms} onChange={e => setBedrooms(e.target.value)} placeholder="# of Bedrooms" /></Google>
        </div>
    );
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getUserAuth: () => dispatch(getUserAuth()),
    postRental: (payload) => dispatch(postRental()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RentalPostalModal);