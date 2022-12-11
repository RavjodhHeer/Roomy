import db, { auth, provider, storage, firebase } from '../firebase';
import { SET_LOADING_STATUS, SET_USER, GET_ARTICLES, GET_RENTALS, GET_ROOMMATES, SET_OTHER_USER } from './actionType';
import 'firebase/firestore';

const serverURL = 'https://server-5te64e4pdq-uw.a.run.app';

export function setUser(payload) {
    return {
        type: SET_USER,
        user: payload,
    };
}

export function setLoading(status) {
    return {
        type: SET_LOADING_STATUS,
        status,
    };
}

export function getArticles(payload, id) {
    return {
        type: GET_ARTICLES,
        payload,
        id,
    };
}

export function getRentals(payload, id) {
    return {
        type: GET_RENTALS,
        payload,
        id,
    };
}

export function getRoommates(payload, id) {
    return {
        type: GET_ROOMMATES,
        payload,
        id,
    };
}

export function setOtherUser(payload) {
    return {
        type: SET_OTHER_USER,
        otherUser: payload,
    };
}

export function getUserAuth() {
    return (dispatch) => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const docRef = db.collection('profiles').doc(user.uid);
                docRef.get().then((docIncoming) => {
                    if (docIncoming.exists) {
                        user.userInfo = docIncoming.data();
                        console.log('Retrieving DB data');
                        dispatch(setUser(user));
                    } else {
                        console.log('No such document!');
                        dispatch(setUser(null));
                    }
                }).catch((error) => {
                    console.log('Error getting document:', error);
                    dispatch(setUser(null));
                });
            } else {
                dispatch(setUser(null));
            }
        });
    };
}

export function signInAPI() {
    return (dispatch) => {
        auth.signInWithPopup(provider)
            .then((userAuth) => {
                const docRef = db.collection('profiles').doc(userAuth.user.uid);
                docRef.get().then((docIncoming) => {
                    if (docIncoming.exists) {
                        userAuth.user.userInfo = docIncoming.data();
                        dispatch(setUser(userAuth.user));
                    } else {
                        setUserInfo(userAuth.user.uid, 'Renter', userAuth.user.displayName, userAuth.user.photoURL);
                        userAuth.user.userInfo = {
                            looking: true,
                            displayName: userAuth.user.displayName,
                            status: 'Renter',
                            uid: userAuth.user.uid,
                            photoURL: userAuth.user.photoURL,
                            experiences: [],
                            preferences: {
                                roomWith: '',
                                pets: '',
                                smoking: '',
                            },
                            phoneNumber: '',
                            gender: '',
                            bio: '',
                        };
                        dispatch(setUser(userAuth.user));
                    }
                }).catch((error) => {
                    console.log('Error getting document:', error);
                });
            })
            .catch((err) => alert(err.message));
    };
}

export function registerWithEmail(email, password, photoURL, userName, fullName, userType) {
    return (dispatch) => {
        auth.createUserWithEmailAndPassword(email, password).then((userAuth) => {
            userAuth.user.updateProfile({
                displayName: fullName,
                photoURL,
            }).then(() => {
                dispatch(setUser(userAuth.user));
                setUserInfo(userAuth.user.uid, userType, fullName, photoURL);
            });
        }).catch((err) => alert(err.message));
    };
}

export function signInWithEmail(email, password) {
    return (dispatch) => {
        auth.signInWithEmailAndPassword(email, password)
            .then((userAuth) => {
                const docRef = db.collection('profiles').doc(userAuth.user.uid);
                docRef.get().then((docIncoming) => {
                    if (docIncoming.exists) {
                        userAuth.user.userInfo = docIncoming.data();
                        dispatch(setUser(userAuth.user));
                    } else {
                        setUserInfo(userAuth.user.uid, 'Renter', userAuth.user.displayName, userAuth.user.photoURL);
                        userAuth.user.userInfo = {
                            looking: true,
                            displayName: userAuth.user.displayName,
                            status: 'Renter',
                            uid: userAuth.user.uid,
                            photoURL: userAuth.user.photoURL,
                            experiences: [],
                            preferences: {
                                roomWith: '',
                                pets: '',
                                smoking: '',
                            },
                            phoneNumber: '',
                            gender: '',
                            bio: '',
                        };
                        dispatch(setUser(userAuth.user));
                    }
                }).catch((error) => {
                    console.log('Error getting document:', error);
                });
            })
            .catch((error) => alert(error));
    };
}

export function signOutAPI() {
    return (dispatch) => {
        auth.signOut()
            .then(() => dispatch(setUser(null)))
            .catch((err) => alert(err.message));
    };
}

export function postArticleAPI(payload) {
    return async (dispatch) => {
        if (payload.image !== '') {
            dispatch(setLoading(true));
            const upload = storage.ref(`images/${payload.image.name}`).put(payload.image);
            upload.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (err) => alert(err),
                async () => {
                    try {
                        const downloadURL = await upload.snapshot.ref.getDownloadURL();
                        const response = await fetch(`${serverURL}/post_article`, {
                            mode: 'cors',
                            method: "POST",
                            headers : { 
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                actor: {
                                    description: payload.user.email,
                                    title: payload.user.displayName,
                                    date: payload.timestamp,
                                    image: payload.user.photoURL,
                                    uid: auth.currentUser.uid,
                                },
                                video: payload.video,
                                sharedImg: downloadURL,
                                likes: {
                                    count: 0,
                                    whoLiked: [],
                                },
                                comments: 0,
                                description: payload.description,
                            })}
                        );
                        const results = await response.json();
                    } catch (error) {
                        console.log(error);
                        alert("Problem creating the post");
                    }
                    dispatch(setLoading(false));
                },
            );
        } else if (payload.video) {
            dispatch(setLoading(true));
            try {
                const response = await fetch(`${serverURL}/post_article`, {
                    mode: 'cors',
                    method: "POST",
                    headers : { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        actor: {
                            description: payload.user.email,
                            title: payload.user.displayName,
                            date: payload.timestamp,
                            image: payload.user.photoURL,
                            uid: auth.currentUser.uid,
                        },
                        video: payload.video,
                        sharedImg: '',
                        likes: {
                            count: 0,
                            whoLiked: [],
                        },
                        comments: 0,
                        description: payload.description,
                    })}
                );
                const results = await response.json();
            } catch (error) {
                console.log(error);
                alert("Problem creating the post");
            }
            dispatch(setLoading(false));
        } else if (payload.image === '' && payload.video === '') {
            dispatch(setLoading(true));
            try {
                const response = await fetch(`${serverURL}/post_article`, {
                    mode: 'cors', // no-cors, *cors, same-origin
                    method: "POST",
                    headers : { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        actor: {
                            description: payload.user.email,
                            title: payload.user.displayName,
                            date: payload.timestamp,
                            image: payload.user.photoURL,
                            uid: auth.currentUser.uid,
                        },
                        video: '',
                        sharedImg: '',
                        likes: {
                            count: 0,
                            whoLiked: [],
                        },
                        comments: 0,
                        description: payload.description,
                    })}
                );
                const results = await response.json();
            } catch (error) {
                console.log(error);
                alert("Problem creating the post");
            }
            dispatch(setLoading(false));
        }
        dispatch(getArticlesAPI());
    };
}

export function getArticlesAPI(pid = null) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        if (pid === null) { // Post on home page
            try {
                const response = await fetch(`${serverURL}/get_articles`);
                const results = await response.json();
                const posts = results.posts;
                posts.map((post)=>{
                    post.actor.date = new Date(post.actor.date);
                });
                const ids = results.ids;
                dispatch(getArticles(posts, ids));
            } catch (error) {
                console.log(error);
                alert("Problem loading posts");
            }
            dispatch(setLoading(false));
        } else { // Post on its own page
            try {
                const data = new FormData();
                data.append("pid", pid);
                const response = await fetch(`${serverURL}/get_single_article`, {
                    mode: 'cors',
                    method: "POST",
                    body: data
                });
                const results = await response.json();
                const posts = results.posts;
                posts.actor.date = new Date(posts.actor.date);
                const ids = results.ids;
                dispatch(getArticles([posts], [ids]));
            } catch (error) {
                console.log(error);
                alert("Problem loading posts");
            }
            dispatch(setLoading(false));
        }
    };
}

export function updateArticleAPI(payload, onSinglePostPage) {
    return async (dispatch) => {
        try {
            const response = await fetch(`${serverURL}/update_article`, {
                mode: 'cors',
                method: "POST",
                headers : { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pid: payload.id,
                    update: payload.update,
                })}
            );
            const results = await response.json();
            dispatch(getArticlesAPI(onSinglePostPage ? payload.id : null));
        } catch (error) {
            console.log(error);
            alert("Problem updating the post");
        }
    };
}

export function getRentalsAPI() {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await fetch(`${serverURL}/get_rentals`);
            const results = await response.json();
            const rentals = results.rentals;
            rentals.map((x)=>{
                x.date = new Date(x.date)
            });
            const ids = results.ids;
            dispatch(getRentals(rentals, ids));
        } catch (error) {
            console.log(error);
            alert("Problem loading posts");
        }
        dispatch(setLoading(false));
    };
}

export function updateRentalsAPI(payload) {
    return (dispatch) => {
        db.collection('rentals').doc(payload.id).update(payload.update);
    };
}

export function getRoommatesAPI() {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await fetch(`${serverURL}/get_roommates`);
            const results = await response.json();
            const roommates = results.roommates;
            roommates.map((x)=>{
                x.date = new Date(x.date)
            });
            const ids = results.ids;
            dispatch(getRoommates(roommates, ids));

        } catch (error) {
            alert("Problem loading posts");
        }
        dispatch(setLoading(false));
    };
}

export function updateRoommatesAPI(payload) {
    return (dispatch) => {
        db.collection('roommates').doc(payload.id).update(payload.update);
    };
}

export async function setUserInfo(uid, userType, displayName, photoURL) {
    try {
        const response = await fetch(`${serverURL}/set_user_info`, {
            mode: 'cors',
            method: "POST",
            headers : { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                looking: true,
                displayName,
                status: userType || 'Renter',
                uid,
                photoURL,
                experiences: [],
                preferences: {
                    roomWith: '',
                    pets: '',
                    smoking: '',
                },
                phoneNumber: '',
                gender: '',
                bio: '',
            })}
        );
        const results = await response.json();
    } catch (error) {
        console.log(error);
        alert("Problem setting user info");
    }
}

async function uploadImage(img) {
    return new Promise((resolve, reject) => {
        const upload = storage.ref(`rental_images/${img.name}`).put(img);
        upload.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (err) => console.log(err),
            async () => {
                const downloadURL = await upload.snapshot.ref.getDownloadURL();
                resolve(downloadURL);
            },
        );
    });
}

export function postRental(payload) {
    return (dispatch) => {
        let photos = [];
        for (const img of payload.photos) {
            photos.push(uploadImage(img));
        }
        let [lat, long] = [0, 0];
        Promise.all(photos).then(async (urls) => {
            photos = urls;
            const { address } = payload;
            const geoCodeToken = 'pk.eyJ1IjoibWF0dGhld2dhaW0iLCJhIjoiY2xhYXN6ZnNhMGEzYzNwcnoycjBlZmlnMSJ9.VMZ9zv6-BBkRG_kcYx9naQ';
            await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${geoCodeToken}`)
            .then((resp) => resp.json())
            .then((data) => {
                lat = data.features[0].center[1];
                long = data.features[0].center[0];
            });
            try {
                const response = await fetch(`${serverURL}/post_rental`, {
                    mode: 'cors',
                    method: "POST",
                    headers : { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        price: payload.price,
                        bedrooms: payload.bedrooms,
                        sharedBedroom: payload.sharedBedroom,
                        bathrooms: payload.bathrooms,
                        sharedBathroom: payload.sharedBathroom,
                        description: payload.description ? payload.description : 'Description Unavailable',
                        title: payload.title ? payload.title : 'Title Unavailable',
                        preferences: payload.preferences,
                        photos,
                        address: payload.address,
                        coords: {
                            latitude: lat,
                            longitude: long,
                        },
                        poster: payload.poster,
                        date: payload.date,
                    })}
                );
                const results = await response.json();
                dispatch(getRentalsAPI());
            } catch (error) {
                console.log(error);
                alert("Problem creating rental post");
            }
        });
    }
}

export function postRoommate(payload) {
    return (dispatch) => {
        let photos = [];
        for (const img of payload.photos) {
            photos.push(uploadImage(img));
        }
        Promise.all(photos).then(async (urls) => {
            photos = urls;
            try {
                const response = await fetch(`${serverURL}/post_roommate`, {
                    mode: 'cors',
                    method: "POST",
                    headers : { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        price: payload.price,
                        bedrooms: payload.bedrooms,
                        sharedBedroom: payload.sharedBedroom,
                        bathrooms: payload.bathrooms,
                        sharedBathroom: payload.sharedBathroom,
                        description: payload.description ? payload.description : 'Description Unavailable',
                        title: payload.title ? payload.title : 'Title Unavailable',
                        preferences: payload.preferences,
                        photos,
                        address: payload.address,
                        coords: {
                            latitude: payload.coords.latitude,
                            longitude: payload.coords.longitude,
                        },
                        poster: payload.poster,
                        date: payload.date,
                    })}
                );
                const results = await response.json();
                dispatch(getRoommatesAPI());
            } catch (error) {
                console.log(error);
                alert("Problem posting roommate advertisement");
            }
        });
    }
}

export function getOtherUser(uid) {
    return async (dispatch) => {
        try {
            const data = new FormData();
            data.append("uid", uid);
            const response = await fetch(`${serverURL}/get_other_user`, {
                mode: 'cors',
                method: "POST",
                body: data
            });
            const user = await response.json();
            dispatch(setOtherUser(user));
        } catch (error) {
            dispatch(setOtherUser(null));
            alert("Problem getting user info");
        }
    };
}

export async function postExperience(target_uid, message, when) {
    try {
        const data = {
            experience: message,
            when,
            uid: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
        };
        const response = await fetch(`${serverURL}/post_experience`, {
            mode: 'cors',
            method: "POST",
            headers : { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target_uid: target_uid,
                exp: data
            })}
        );
        const results = await response.json();
    } catch (error) {
        console.log(error);
        alert("Problem posting your experience");
    }
}

export async function updateProfileData(newProfileData) {
    const { uid } = auth.currentUser;
    try {
        const response = await fetch(`${serverURL}/update_profile_data`, {
            mode: 'cors',
            method: "POST",
            headers : { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: uid,
                profile: newProfileData
            })}
        );
        const results = await response.json();
    } catch (error) {
        console.log(error);
        alert("Problem updating profile data");
    }
}

// Save : Boolean (True -> Add, False -> Remove)
export async function saveProperty(key, save) {
    const { uid } = auth.currentUser;
    try {
        const response = await fetch(`${serverURL}/save_property`, {
            mode: 'cors',
            method: "POST",
            headers : { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: uid,
                key: key,
                save: save,
            })}
        );
        const results = await response.json();
    } catch (error) {
        console.log(error);
        alert("Problem saving the rental");
    }
}
