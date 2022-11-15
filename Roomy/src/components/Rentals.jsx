import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getUserAuth, getRentalsAPI } from "../action";
import { Redirect } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Feed from "./Rentals/Feed";
import Map from "./Rentals/Map";
import { RemoveScrollBar } from 'react-remove-scroll-bar';

const Container = styled.div`
    height: 100vh;
    width: 100vw;
`;

const HeaderWrapper = styled.section`
    height: 60px;
    width: 100vw;
`;

const SidebarWrapper = styled.div`
    height: calc(100vh - 60px);
    width: 235px;
    position: fixed;
    left: 0;
`;

const MapWrapper = styled.div`
    height: calc(100vh - 60px);
    width: calc(100vw - 235px - 400px);
    position: fixed;
    left: 235px;
`;

const FeedWrapper = styled.div`
    height: calc(100vh - 60px);
    width: 400px;
    position: fixed;
    right: 0;
    overflow-x: hidden; // Somehow enables vertical scrolling??? idk but its lit
`;

function Rentals (props) {
    let [scrollKey, setScrollKey] = useState(0);

    useEffect(()=>{
        props.getRentals();
    },[]);

    useEffect(()=>{
        // (Need to come back) temporary solution to profile pics already being
        // loaded in but for some reason needing a feed value to change to render
        setTimeout(() => {
            setScrollKey("abc");
          }, 2000);
    },[props.rentals]);

    function handleClickScroll(key){
        setScrollKey(key);
    }

    return (
        <div className="Rentals">
            {(!props.user && !props.loggingIn) && <Redirect to="/" />}
            <RemoveScrollBar/>
            <Container>

                <HeaderWrapper>
                    <Header/>
                </HeaderWrapper>

                <SidebarWrapper>
                    <Sidebar/>
                </SidebarWrapper>

                <MapWrapper>
                    <Map handleClickScroll={handleClickScroll}/>
                </MapWrapper>

                <FeedWrapper>
                    <Feed scrollKey={scrollKey} />
                </FeedWrapper>

            </Container>
        </div>
    );
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
        loggingIn: state.userState.loggingIn,
        rentals: state.rentalState.rentals,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getUserAuth: () => dispatch(getUserAuth()),
    getRentals: () => dispatch(getRentalsAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Rentals);
