import React, {useState} from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getUserAuth } from "../action";
import { Redirect } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Feed from "./Rentals/Feed";
import Map from "./Rentals/Map";
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import { useLoadScript } from "@react-google-maps/api";

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
                    <Map />
                </MapWrapper>

                <FeedWrapper>
                    <Feed/>
                </FeedWrapper>

            </Container>
        </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Rentals);
