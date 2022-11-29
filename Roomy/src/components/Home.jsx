import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import Left from './Home/Left';
import Main from './Home/Main';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Post from './Home/Post';

const Container = styled.div`
    max-width: 100%;
`;

const Content = styled.div`
    max-width: 1128px;
    margin: auto;
`;

const Layout = styled.div`
    display: grid;
    grid-template-areas: "left main right";
    grid-template-columns: minmax(0, 5fr) minmax(0, 12fr) minmax(300px, 7fr);
    column-gap: 25px;
    row-gap: 25px;
    margin: 25px 0;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        padding: 0 5px;
    }
`;

function Home(props) {
    return (
        <Router>
            <Container>
                {(!props.user && !props.loggingIn) && <Redirect to="/" />}
                <Content>
                    <Layout>
                        <Main />
                        <Left />
                    </Layout>
                </Content>
            </Container>
        </Router>
    );
}

const mapStateToProps = (state) => ({
    user: state.userState.user,
    loggingIn: state.userState.loggingIn,
});

export default connect(mapStateToProps)(Home);
