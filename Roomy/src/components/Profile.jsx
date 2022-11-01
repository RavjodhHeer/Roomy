import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams, Redirect } from "react-router-dom";
import { getUserAuth } from "../action";
import styled from "styled-components";
import db, { auth, provider, storage } from "../firebase";
import { signOutAPI } from "../action";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Head = styled.div`
    .top {                                           //This is all the top of the header stuff where the purple banner is
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
        padding: 15px;
        color: white;
        width: 100%;
        background: linear-gradient(0deg, #F2F3F5 25%, #A943D3 0%);

    }

`;


const Photo = styled.div`
    img {
        margin-top: 100px;
        width: 350px;  
        outline: solid;
        border-radius: 175px; 
        box-shadow: 0px 0px 20px #777;
    }
`;
const Grid = styled.div`
    display: grid;
    justify-content: center;
    grid-template-rows: repeat(4, 100px);
    grid-gap: 20px;

`;
const Div = styled.div`
    display: flex;
    border: 1px solid #ccc;
    justify-content: center;
    border-radius: 20px;
    //border-color: gray
    height: 200px;
    width: 1200px;
    text-align: center;

    h2 {
        font-size: 40px;
        font: Lucida Console;
        color: black;
    }

    h1 {
        margin-right: 900px
    }

    span {
        font-size: 45px;
    }
`;


function Profile(props){
    let user = props.user ? props.user : null;
    let photoUrl = props.user ? props.user.photoUrl : null;
    return (<div>
        <Header />
        <Sidebar />
        <Head>
            <div className="top">
            
            <Photo>{<img src={photoUrl} />}</Photo>

            </div>

        </Head>
        <Grid>
            <Div>

            <span>{user ? user.displayName : null}</span>
            
            </Div>
            
        </Grid>
        
  

    </div>);
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
        loggingIn: state.userState.loggingIn,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getUserAuth: () => dispatch(getUserAuth()),
});




export default connect(mapStateToProps, mapDispatchToProps)(Profile);
