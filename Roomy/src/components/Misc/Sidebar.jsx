import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { signOutAPI } from '../../action';

/* This defines the actual bar going down the screen */
const Container = styled.div`
    background-color: #fff;
    box-shadow: -5px 0px 5px #999;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    padding: 0 0px;
    position: fixed;
    width: 100%;
    top: 60px;
    top: 2;
    /* width: 100vw; */
    z-index: 80;
`;
const StyledSideNav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  height: 100%;
  width: 32vw;     /* Set the width of the sidebar */
  max-width: 235px;
  position: fixed;     /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  z-index: 100;      /* Stay on top of everything */
  top: 1;      /* Stay at the top */
  background-color: #fff; /* White */
  box-shadow: 0px 5px 5px #999;
  overflow-x: hidden;     /* Disable horizontal scroll */
  padding-top: 10px;
`;

const Button = styled.button`
  display: inline-block;
  outline: 0;
  text-align: center;
  align-items: center;
  background-color: white;
  border-color: #fff;
  border: 1px solid transparent;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 400;
  border-radius: 100px;
  font-size: 20px;
  padding: 10px 24px;
  margin: 10px 0px;
  cursor: pointer;
  text-align: center;
  &:hover {
    color: #A943D3;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const LogoButton = styled.button`
    display: inline-block;
    outline: 0;
    border: 0;
    font-size: 20px;
    font-weight: 400;
    color: #fff;
    cursor: pointer;
    background-image: linear-gradient(to right,#c82090,#6a14d1)!important;
    border-radius: 100px;
    padding: 10px 24px;
    margin: 10px 0px;
    white-space: nowrap;

    :hover {
        background-color: #c82090;
        background-image: none!important;
    }
`;

function SideNav({ signout, uid }) {
    return (
        <Container>
            <StyledSideNav>
                <a href="/feed">
                    <Button>
                        <img src="/images/house-door-fill.svg" alt="" />
                        <span> Home</span>
                    </Button>
                </a>
                <a href="/rentals">
                    <Button>
                        <img src="/images/building.svg" alt="" />
                        <span> Rentals</span>
                    </Button>
                </a>
                <a href="/roommates">
                    <Button>
                        <img src="/images/people-fill.svg" alt="" />
                        <span> Roommates</span>
                    </Button>
                </a>
                <a href="/feed">
                    <Button>
                        <img src="/images/clipboard2-check-fill.svg" alt="" />
                        <span> Applications</span>
                    </Button>
                </a>
                <a href="/feed">
                    <Button>
                        <img src="/images/chat-right-dots-fill.svg" alt="" />
                        <span> Messages</span>
                    </Button>
                </a>
                <a href="/saved">
                    <Button>
                        <img src="/images/bookmark-heart-fill.svg" alt="" />
                        <span> Saved Properties</span>
                    </Button>
                </a>
                <a href={uid ? `/profile/${uid}` : '/feed'} data-testid="profile">
                    <Button>
                        <img src="/images/person-circle.svg" alt="" />
                        <span> Profile</span>
                    </Button>
                </a>
                <LogoButton onClick={signout}>
                    <img src="/images/box-arrow-left.svg" alt="" />
                    <span> Sign Out</span>
                </LogoButton>
            </StyledSideNav>
        </Container>
    );
}

function Sidebar(props) {
    return (
        <SideNav signout={props.signOut} uid={props.user ? props.user.uid : null}>
            <StyledSideNav />
        </SideNav>
    );
}

const mapStateToProps = (state) => ({
    user: state.userState.user,
});

const mapDispatchToProps = (dispatch) => ({
    signOut: () => dispatch(signOutAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
