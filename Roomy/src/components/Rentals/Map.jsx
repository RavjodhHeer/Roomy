import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GoogleMap, LoadScript} from "@react-google-maps/api";

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

function Map(props) {
    return (
        <LoadScript googleMapsApiKey="AIzaSyC5k7rL8Ed7t1I-te1afRWN7B4DczsEJho">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}>
            </GoogleMap>
        </LoadScript>
    );
}

export default Map;