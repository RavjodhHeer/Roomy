import React from "react";
import { useParams } from "react-router-dom";

function Profile(props){
    let {id} = useParams();
    return (<div>
        <h1>Profile UID: {id}</h1>
    </div>);
}

export default Profile;