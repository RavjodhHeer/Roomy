import React, { Component, useEffect, useState } from "react";
import styled from "styled-components";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { getRentalsAPI } from "../../action";
import { connect } from "react-redux";

// https://react-google-maps-api-docs.netlify.app

const google = window.google;

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: 36.974117,
    lng: -122.030792
};

const MyWindow = styled.div`
    img {
        width: 100px;
        height: 100px;
    }
`;

function Map(props) {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [rentalMap, setRentalMap] = useState({});
    const [zoom, setZoom] = useState(14);
    const [infoOpen, setInfoOpen] = useState(false);

    const markerOnLoadHandler = (rental, key) => {
        rental.setIcon("/images/rental-marker.png");
        return setRentalMap(prevState => {
          return { ...prevState, [key]: rental };
        });
    };

    const markerOnClickHandler = (rental, key) => {
        // This works because selectedPlace will only be set when infoOpen is true
        // And checks infoOpen to make sure we can reopen it after closing.
        // Goal: close on double click
        if (infoOpen && selectedPlace[1] == key) {
            setInfoOpen(false);
            // console.log(selectedPlace[0]);
            return;
        }

        setSelectedPlace([rental, key]);
        if (infoOpen) {
          setInfoOpen(false);
        }

        setInfoOpen(true);
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyBX1z5nvjcjzyxSMT-QCVS3ERu6Y3iNSb0">
            <GoogleMap 
                mapContainerStyle={containerStyle} 
                center={center} 
                zoom={zoom}>
                    {props.rentals &&
                        props.rentals.map((rental, key)=> (
                            <Marker
                                key={key}
                                position={{ lat: rental.coords.latitude, lng: rental.coords.longitude }}
                                onLoad={event => markerOnLoadHandler(event, key)}
                                onClick={() => markerOnClickHandler(rental, key)}
                                onMouseOver={() => {rentalMap[key].setIcon("/images/rental-marker-highlight.png");}}
                                onMouseOut={() => {rentalMap[key].setIcon("/images/rental-marker.png");}}
                            />
                        ))}
                        {infoOpen && selectedPlace && (
                            <InfoWindow anchor={rentalMap[selectedPlace[1]]} onCloseClick={() => setInfoOpen(false)}>
                                <MyWindow>
                                    {selectedPlace[0].photos.length > 0 && <img src={selectedPlace[0].photos[0]} alt="" />}
                                    <h1>{selectedPlace[0].title}</h1>
                                    <div>{selectedPlace[0].description}</div>
                                </MyWindow>
                            </InfoWindow>
                        )}
            </GoogleMap>
        </LoadScript>
    );
}

const mapStateToProps = (state) => {
	return {
		rentals: state.rentalState.rentals,
	};
};

export default connect(mapStateToProps)(Map);