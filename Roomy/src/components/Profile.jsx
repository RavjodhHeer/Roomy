import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserAuth } from "../action";
import styled from "styled-components";
import db, { auth, provider, storage } from "../firebase";
import { signOutAPI } from "../action";



const Header = styled.div`
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
    display: flex;
    justify-content: center;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 20px;

`;
const Div = styled.div`
    display: flex;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 6px 0px  rgba(0,0,0,0.3);
    justify-content: center;
    text-align: center;
    background-color: #8F808F;
    //border-radius: 20px;
    height: 800px;
    width: 600px;

    h2 {
        font-size: 40px;
        font: SF-Pro;
        color: white;
    }
`;


function Profile(props){
    let {id} = useParams();
    
    return (<div>

        <Header>
            <div className="top">
            
            <Photo>{<img src="https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg" />}</Photo>

            </div>

        </Header>
        <Grid>
            <Div>
            <h1>Profile UID: {props.user ? id : null}</h1>
            </Div>
            
            <Div>
            <div className="card">
            <h2>Tejvir Virk</h2>
         
            </div>
            
            </Div>

            <Div>
            <h2>Hi daddy</h2>
            </Div>
        </Grid>
  

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
