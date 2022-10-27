import React from "react";
import { BrowserRouter as Router, Switch, 
    Route, Redirect,} from "react-router-dom";

// function Rentals (props){
//     let {id} = useParams();
//     return (<div>
//         <h1>Profile UID: {props.user ? id : null}</h1>
//     </div>);
// }

// const mapStateToProps = (state) => {
// 	return {
// 		user: state.userState.user,
// 	};
// };

// const mapDispatchToProps = (dispatch) => ({
// 	getUserAuth: () => dispatch(getUserAuth()),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const Rentals = () => {
    return (
        <div>
            <h1>Rentals Page</h1>
        </div>
    );
};

export default Rentals;
