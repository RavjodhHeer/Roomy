import React from 'react';
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { auth } from "../firebase";

/* This defines the actual bar going down the screen */
const Container = styled.div`
    background-color: #fff;
	box-shadow: -5px 0px 5px #999;
	border-left: 1px solid rgba(0, 0, 0, 0.08);
	padding: 0 0px;
	position: fixed;
	top: 1;
	left: 1;
	/* width: 100vw; */
	z-index: 90;
`;
const StyledSideNav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  height: 100%;
  max-width: 235px;
  position: fixed;     /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  width: 235px;     /* Set the width of the sidebar */
  z-index: 100;      /* Stay on top of everything */
  top: 1;      /* Stay at the top */
  background-color: #fff; /* White */
  box-shadow: 0px 5px 5px #999;
  overflow-x: hidden;     /* Disable horizontal scroll */
  padding-top: 10px;
`;

const Logo = styled.span`
	margin-right: 8px;
	font-size: 0;
`;

const NavIcon = styled.div`
`;

const Title = styled.div`
	align-items: center;
	justify-content: space-evenly;
	font-size: 34px;
	width: 100%;
	color: rgba(0, 0, 0, 0.6);
`;

const StyledNavItem = styled.div`
  height: 70px;
  width: 75px; /* width must be same size as NavBar to center */
  text-align: center; /* Aligns <a> inside of NavIcon div */
  margin-bottom: 0;   /* Puts space between NavItems */
  a {
    font-size: 2.7em;
    color: ${(props) => props.active ? "purple" : "#8f2bb8"};
    :hover {
      opacity: 0.7;
      text-decoration: none; /* Gets rid of underlining of icons */
    }  
  }
`;

const Button = styled.button`
  display: inline-block;
  outline: 0;
  text-align: center;
  align-items: center;
  background-color: white;
  border-color: #fff;
  border: 1px solid transparent;
  color: black;
  font-weight: 400;
  border-radius: 30px;
  font-size: 20px;
  padding: 10px 24px;
  margin: 10px 0px;
  cursor: pointer;
  text-align: center;
  &:hover {
    color: #A943D3;
  }
`;
     



class SideNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          activePath: '/',
          items: [
            {
              path: '/', /* path is used as id to check which NavItem is active basically */
              name: 'Home',
              css: 'fa fa-fw fa-home',
              key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */
            },
            {
              path: '/about',
              name: 'About',
              css: 'fa fa-fw fa-clock',
              key: 2
            },
            {
              path: '/NoMatch',
              name: 'NoMatch',
              css: 'fas fa-hashtag',
              key: 3
            },
          ]
        }  
    }
    onItemClick = (path) => {
        this.setState({ activePath: path }); /* Sets activePath which causes rerender which causes CSS to change */
    }
    render() {
        const { items, activePath } = this.state;
        return (
          <Container>
            <StyledSideNav>
                <Logo>
                    <img src="/public/images/home-logo.svg" alt="" />
                </Logo>
				<Button>
						<img src="/images/house-door-fill.svg" alt="" />
						<span> Home</span>
				</Button>	
				<Button>
						<img src="/images/building.svg" alt="" />
						<Link to="/rentals"> Rentals</Link>
				</Button>	
				<Button>
					<img src="/images/people-fill.svg" alt="" />
					<span> Roommates</span>
				</Button>
				<Button>
					<img src="/images/clipboard2-check-fill.svg" alt="" />
					<span> Applications</span>
				</Button>
                <Button>
					<img src="/images/chat-right-dots-fill.svg" alt="" />
					<span> Messages</span>
				</Button>
                <Button>
					<img src="/images/bookmark-heart-fill.svg" alt="" />
					<span> Saved Properties</span>
				</Button>
                <Button>
					<img src="/images/person-circle.svg" alt="" />
					<Link to={"/profile/" + auth.currentUser.uid}> Profile</Link>
				</Button>
                <Button>
					<img src="/images/gear.svg" alt="" />
					<span> Settings</span>
				</Button>
                {
                /* items = just array AND map() loops thru that array AND item is param of that loop */
                items.map((item) => {
                    /* Return however many NavItems in array to be rendered */
                    return (
                        <NavItem 
                            path={item.path}
                            name={item.name}
                            css={item.css}
                            onItemClick={this.onItemClick}
                            active={item.path === activePath}
                            key={item.key}
                        />                
                    );
                })
                }
            </StyledSideNav>
          </Container>
        );
    }
}

class NavItem extends React.Component {
    handleClick = () => {
        const { path, onItemClick } = this.props;
        onItemClick(path);
    }
    render() {
      const { active } = this.props;
      return (
        <StyledNavItem active={active}>
            <Link to={this.props.path} className={this.props.css} onClick={this.handleClick}>
                <NavIcon></NavIcon>
            </Link>
        </StyledNavItem>
      );
    }
  }

export default class Sidebar extends React.Component {
  render() {
    return (
        <SideNav>
            <StyledSideNav></StyledSideNav>
        </SideNav>
    );
  }
}
