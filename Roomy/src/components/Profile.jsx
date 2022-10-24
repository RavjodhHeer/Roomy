import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserAuth } from "../action";

function Profile(props){
    let {id} = useParams();
    return (<div>
        <h1>Profile UID: {props.user ? id : null}</h1>
    </div>);
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getUserAuth: () => dispatch(getUserAuth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
