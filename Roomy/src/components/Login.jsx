import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import { signInAPI, registerWithEmail, signInWithEmail } from '../action';

const Container = styled.div``;

const Nav = styled.nav`
    max-width: 1128px;
    margin: auto;
    padding: 12px 0 16px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    position: relative;

    & > a {
        width: 130px;
        height: 35px;
        @media (max-width: 768px) {
            padding: 0 5px;
        }
    }
`;

const Join = styled.a`
    font-size: 16px;
    padding: 10px;
    text-decoration: none;
    border-radius: 5px;
    color: rgba(0, 0, 0, 0.6);
    margin-right: 8px;

    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
        color: rgba(0, 0, 0, 1);
    }
`;

const SignIn = styled.a`
    box-shadow: inset 0 0 0 1px #7822C7;
    border-radius: 25px;
    color: #7822C7;
    font-size: 16px;
    font-weight: 600;
    transition-duration: 167ms;
    line-height: 40px;
    padding: 10px 25px;
    text-align: center;
    background-color: transparent;
    &:hover {
        background-color: rgba(112, 181, 249, 0.15);
        box-shadow: inset 0 0 0 2px #7822C7;
    }
`;

const Section = styled.section`
    display: flex;
    flex-wrap: wrap;
    align-content: start;
    min-height: 700px;
    padding-bottom: 138px;
    padding-top: 40px;
    padding: 60px 0;
    position: relative;
    width: 100%;
    max-width: 1128px;
    justify-content: center;
    align-items: center;
    margin: auto;
    @media (max-width: 768px) {
        min-height: 0;
    }
`;

const PreSection = styled.section`
    display: flex;
    flex-wrap: wrap;
    align-content: start;
    min-height: 700px;
    padding-bottom: 138px;
    padding-top: 40px;
    padding: 60px 0;
    position: relative;
    width: 100%;
    max-width: 1128px;
    align-items: center;
    margin: auto;
    @media (max-width: 768px) {
        min-height: 0;
    }
`;

const Hero = styled.div`
    width: 100%;
    h1 {
        padding-bottom: 0;
        font-size: 56px;
        color: #7822C7;
        font-weight: 200;
        line-height: 70px;
        justify-content: center;
        text-align: center;
        @media (max-width: 768px) {
            text-align: center;
            width: 100%;
            font-size: 20px;
            line-height: 2;
        }
    }
    img {
        width: 700px;
        height: 670px;
        position: absolute;
        bottom: -2px;
        right: -150px;
        @media (max-width: 768px) {
            top: 230px;
            position: initial;
            width: initial;
            height: initial;
        }
    }
`;

const PreHero = styled.div`
    width: 100%;
    h1 {
        padding-bottom: 0;
        width: 55%;
        font-family: 'Gothic A1', sans-serif;
        font-size: 60px;
        font-weight: 100;
        color: #8f2bb8;
        line-height: 70px;
        @media (max-width: 768px) {
            text-align: center;
            width: 100%;
            font-size: 20px;
            line-height: 2;
        }
    }
    img {
        width: 880px;
        height: 400px;
        position: absolute;
        bottom: 260px;
        right: -150px;
        @media (max-width: 768px) {
            top: 230px;
            position: initial;
            width: initial;
            height: initial;
        }
    }
`;

const Form = styled.div`
    margin-top: 100px;
    width: 408px;
    @media (max-width: 768px) {
        margin: 20px auto 0;
    }
`;

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

const PreSignIn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    height: 56px;
    width: 100%;
    border-radius: 30px;
    box-shadow: inset 0 0 0 1px #8f2bb8, inset 0 0 0 2px rgb(0 0 0 / 0%), inset 0 0 0 1px rgb(0 0 0 / 0);
    border: none;
    vertical-align: middle;
    transition-duration: 167ms;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
    z-index: 0;
    &:hover {
        background-color: #EAEDED;
        color: rgba(0, 0, 0, 0.75);
        box-shadow: inset 0 0 0 2px #8f2bb8, inset 0 0 0 3px rgb(0 0 0 / 0%), inset 0 0 0 2px rgb(0 0 0 / 0);
    }
    img {
        margin-right: 25px;
    }
`;


const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom:10px;
`;

function Login(props) {
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [userName, setUserName] = useState("");
    const [fullName, setFullName] = useState("");
    const [joinType, setJoinType] = useState(true); // True = Sign In ; False = Register
    const [userType, setUserType] = useState("Renter"); // Renter or Landlord
    const [pastHero, setPastHero] = useState(false); // Splash page before signin / register

    return (
        <Container>
            {props.user && <Redirect to="/feed" />}
            <Nav>
                <a href="/">
                    <img src="/images/login-logo.svg" alt="" />
                </a>
            </Nav>
            { pastHero ?
            <Section> 
                <Nav>
                    {joinType ?
                        <div>
                            <Join onClick={() => setJoinType(false) }>Register</Join>
                            <SignIn>Sign In</SignIn>
                        </div>
                    :
                        <div>
                            <SignIn>Register</SignIn>
                            <Join onClick={() => setJoinType(true) }>Sign In</Join>
                        </div>
                    }
                </Nav>
                <Hero>
                    <h1>{joinType ? "Sign In" : "Setup Profile"}</h1>
                </Hero>
                { !joinType ? // Register
                    <Form>
                        <CenteredDiv><h1>What type of Roomie are you?</h1></CenteredDiv>
                        {userType === "Renter" ?
                            <CenteredDiv>
                                <SignIn>Renter</SignIn>
                                <Join onClick={()=>setUserType("Landlord")}>Landlord</Join>
                            </CenteredDiv>
                        :
                            <CenteredDiv>
                                <Join onClick={()=>setUserType("Renter")}>Renter</Join>
                                <SignIn>Landlord</SignIn>
                            </CenteredDiv>
                        }
                        <Google><input type="text" size="40" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" /></Google>
                        <Google><input type="text" size="40" value={photoURL} onChange={e => setPhotoURL(e.target.value)} placeholder="Profile Pic URL" /></Google>
                        <Google><input type="text" size="40" value={userName} onChange={e => setUserName(e.target.value)} placeholder="User Name" /></Google>
                        <Google><input type="email" size="40" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /></Google>
                        <Google><input type="password" size="40" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /></Google>
                        <CenteredDiv>
                            <SignIn onClick={()=>{props.registerEmail(email, password, photoURL, userName, fullName, userType)}}>Register</SignIn>
                        </CenteredDiv>
                    </Form>
                :            // Sign In
                    <Form>
                        <Google><input type="email" size="40" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /></Google>
                        <Google><input type="password" size="40" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /></Google>
                        <CenteredDiv>
                            <SignIn onClick={()=>{props.signinWithEmail(email, password)}}>Sign In</SignIn>
                        </CenteredDiv>
                        <Google onClick={() => props.signIn()}>
                            <img src="/images/google.svg" alt="" />
                            Sign in with Google
                        </Google>
                    </Form>
                }
            </Section>
            : 
            <PreSection>
                <PreHero>
                    <h1>Connecting people</h1>
                    <h1>to places</h1>
                    <img src="/images/home2.png" class="canvas" alt="" />
                </PreHero>
                <Form>
                    <PreSignIn onClick={() => setPastHero(true)}>
                        Sign In
                    </PreSignIn>
                </Form>
            </PreSection>}
        </Container>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
    };
};

const mapDispatchToProps = (dispatch) => ({
    signIn: () => dispatch(signInAPI()),
    registerEmail: (email, password, photoURL, userName, fullName, userType) => dispatch(registerWithEmail(email, password, photoURL, userName, fullName, userType)),
    signinWithEmail: (email, password) => dispatch(signInWithEmail(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
