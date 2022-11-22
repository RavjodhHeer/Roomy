import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const Container = styled.div`
     
`;

const ButtonWrapper = styled.div`
    position: absolute;
 	width: 95%;
 	display: flex;
 	justify-content: space-between;
 	top: 50%;
 	left: 50%;
 	transform: translate(-50%, -50%);
 	button {
 		width: 50px;
 		height: 50px;
 		border-radius: 50%;
 		border: 1px solid black;
 		background-color: white;
 		box-shadow: 1px 1px 5px black;
 	}
`;

const Indicator = styled.div`
 	position: absolute;
 	bottom: 100px;
 	left: 50%;
 	transform: translateX(-50%);
 	padding: 10px 25px;
 	display: flex;
 	align-items: center;
 	justify-content: center;
 	background-color: rgba(49, 49, 49, 0.7);
 	color: white;
 	border-radius: 50px;
 `;


function ImageDisplay({images}) {
    const [current, setCurrent] = useState(0);
    const length = images.length;

    if (images.length === 1) {
        return <img src={images[0]} style={{width: "100%", height: "auto"}} />
    }

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };


    return (
        <Container>
            <ButtonWrapper>
                <button class="ButtonPrev" onClick={prevSlide}> &lt; </button>
 			    <button class="ButtonNext" onClick={nextSlide}> &gt; </button>
            </ButtonWrapper>
            <Indicator>
 				{current + 1} of {length}
 			</Indicator>
            <img src={images[current]} style={{width: "100%", height: "auto"}} />
        </Container>
    );
}

export default ImageDisplay;