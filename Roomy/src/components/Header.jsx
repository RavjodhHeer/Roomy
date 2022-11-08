import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { signOutAPI } from "../action";

const Container = styled.div`
	background-color: #fff;
	box-shadow: -5px 0px 5px #999;
	border-left: 1px solid rgba(0, 0, 0, 0.08);
	padding: 0 24px;
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	height: 60px;
	/* width: 100vw; */
	z-index: 90;
`;

const Content = styled.div`
	display: flex;
	align-items: center;
	margin: 0 auto;
	height: 100%;
`;

const Logo = styled.span`
	margin-right: 8px;
	font-size: 0;
`;

const Search = styled.div`
	opacity: 1;
	display: flex;
	flex-direction: row-reverse;
	flex-grow: 1;
	align-items: center;
	justify-content: right;
	position: relative;
	@media (max-width: 768px) {
		flex-grow: unset;
	}
	& > div {
		max-width: 280px;
		input {
			border: 1px;
			box-shadow: none;
			background-color: rgba(0, 0, 0, 0.1);
			border-radius: 100px;
			color: rgba(0, 0, 0, 0.9);
			width: 218px;
			padding: 0 10px 0 50px;
			line-height: 1.75;
			font-weight: 400;
			font-size: 14px;
			height: 34px;
			vertical-align: text-top;
			border-color: #A943D3;
			@media (max-width: 768px) {
				width: 140px;
			}
		}
	}
`;

const SearchIcon = styled.div`
	width: 40px;
	z-index: 1;
	position: relative;
	top: 0px;
	left: 30px;
	border-radius: 0 2px 2px 0;
	margin: 0;
	pointer-events: none;
	display: flex;
	align-items: center;
	justify-content: right;
`;

const Photo = styled.div`
    img {
        max-width: 100px;  
    }
`;

const Text = styled.div`
	display: inline-block;
	outline: 0;
	text-align: center;
	align-items: center;
	color: black;
	font-weight: 400;
	font-size: 20px;
	padding: 10px 24px;
	margin: 10px 0px;
	cursor: pointer;
	text-align: center;
`;

function Header(props) {
	return (
		<Container>
			<Content>
				<Logo>
					<a href="/">
						<Photo>
							<img src="/images/roomylogo.png" alt="" />
						</Photo>
					</a>
				</Logo>
				<Search>
                    <div>
                        <input type="text" placeholder="Search" />
                    </div>
                    <SearchIcon>
                        <img src="/images/search-icon.svg" alt="" />
                    </SearchIcon>	
                </Search>
			</Content>
		</Container>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
	};
};

const mapDispatchToProps = (dispatch) => ({
	signOut: () => dispatch(signOutAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
