import React from 'react';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserAuth } from "../action";

function Rentals(props) {
    let {id} = useParams();
    return (
        <div>Rentals</div>
    )
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getUserAuth: () => dispatch(getUserAuth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Rentals);
