import db, { auth, provider, storage, firebase } from "../firebase";
import { SET_LOADING_STATUS, SET_USER, GET_ARTICLES, GET_RENTALS, GET_ROOMMATES, SET_OTHER_USER } from "./actionType";
import "firebase/firestore";

export function setUser(payload) {
	return {
		type: SET_USER,
		user: payload,
	};
}

export function setLoading(status) {
	return {
		type: SET_LOADING_STATUS,
		status: status,
	};
}

export function getArticles(payload, id) {
	return {
		type: GET_ARTICLES,
		payload: payload,
		id: id,
	};
}

export function getRentals(payload, id) {
	return {
		type: GET_RENTALS,
		payload: payload,
		id: id,
	};
}

export function getRoommates(payload, id) {
	return {
		type: GET_ROOMMATES,
		payload: payload,
		id: id,
	};
}

export function setOtherUser(payload) {
	return {
		type: SET_OTHER_USER,
		otherUser: payload,
	}
}

export function getUserAuth() {
	return (dispatch) => {
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				var docRef = db.collection("profiles").doc(user.uid);
				docRef.get().then((docIncoming) => {
					if (docIncoming.exists) {
						user.userInfo = docIncoming.data();
						console.log("Retrieving DB data");
						dispatch(setUser(user));
					} else {
						console.log("No such document!");
						dispatch(setUser(null));
					}
				}).catch((error) => {
					console.log("Error getting document:", error);
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
		.then(userAuth => {
			var docRef = db.collection("profiles").doc(userAuth.user.uid);
			docRef.get().then((docIncoming) => {
				if (docIncoming.exists) {
					userAuth.user.userInfo = docIncoming.data();
					dispatch(setUser(userAuth.user));
				} else {
					setUserInfo(userAuth.user.uid, "Renter", userAuth.user.displayName, userAuth.user.photoURL);
					userAuth.user.userInfo = {
						looking: true,
						displayName: userAuth.user.displayName,
						status: "Renter",
						uid: userAuth.user.uid,
						photoURL: userAuth.user.photoURL,
						experiences: []
					}
					dispatch(setUser(userAuth.user));
				}
			}).catch((error) => {
				console.log("Error getting document:", error);
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
                photoURL: photoURL
            }).then(() => {
				dispatch(setUser(userAuth.user));
				setUserInfo(userAuth.user.uid, userType, fullName, photoURL);
			});
        }).catch((err) => alert(err.message));
	};
}

export function signInWithEmail(email, password) {
	return (dispatch) => {
		auth.signInWithEmailAndPassword(email,password)
			.then(userAuth => {
				var docRef = db.collection("profiles").doc(userAuth.user.uid);
				docRef.get().then((docIncoming) => {
					if (docIncoming.exists) {
						userAuth.user.userInfo = docIncoming.data();
						dispatch(setUser(userAuth.user));
					} else {
						setUserInfo(userAuth.user.uid, "Renter", userAuth.user.displayName, userAuth.user.photoURL);
						userAuth.user.userInfo = {
							looking: true,
							displayName: userAuth.user.displayName,
							status: "Renter",
							uid: userAuth.user.uid,
							photoURL: userAuth.user.photoURL,
							experiences: []
						}
						dispatch(setUser(userAuth.user));
					}
				}).catch((error) => {
					console.log("Error getting document:", error);
				});
			})
			.catch(error => alert(error));
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
	return (dispatch) => {
		if (payload.image !== "") {
			dispatch(setLoading(true));
			const upload = storage.ref(`images/${payload.image.name}`).put(payload.image);
			upload.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				},
				(err) => alert(err),
				async () => {
					const downloadURL = await upload.snapshot.ref.getDownloadURL();
					db.collection("articles").add({
						actor: {
							description: payload.user.email,
							title: payload.user.displayName,
							date: payload.timestamp,
							image: payload.user.photoURL,
						},
						video: payload.video,
						sharedImg: downloadURL,
						likes: {
							count: 0,
							whoLiked: [],
						},
						comments: 0,
						description: payload.description,
					});
					dispatch(setLoading(false));
				}
			);
		} else if (payload.video) {
			dispatch(setLoading(true));
			db.collection("articles").add({
				actor: {
					description: payload.user.email,
					title: payload.user.displayName,
					date: payload.timestamp,
					image: payload.user.photoURL,
				},
				video: payload.video,
				sharedImg: "",
				likes: {
					count: 0,
					whoLiked: [],
				},
				comments: 0,
				description: payload.description,
			});
			dispatch(setLoading(false));
		} else if (payload.image === "" && payload.video === "") {
			dispatch(setLoading(true));
			db.collection("articles").add({
				actor: {
					description: payload.user.email,
					title: payload.user.displayName,
					date: payload.timestamp,
					image: payload.user.photoURL,
				},
				video: "",
				sharedImg: "",
				likes: {
					count: 0,
					whoLiked: [],
				},
				comments: 0,
				description: payload.description,
			});
			dispatch(setLoading(false));
		}
	};
}

export function getArticlesAPI() {
	return (dispatch) => {
		dispatch(setLoading(true));
		let payload;
		let id;
		db.collection("articles")
			.orderBy("actor.date", "desc")
			.onSnapshot((snapshot) => {
				payload = snapshot.docs.map((doc) => doc.data());
				id = snapshot.docs.map((doc) => doc.id);
				dispatch(getArticles(payload, id));
			});
		dispatch(setLoading(false));
	};
}

export function updateArticleAPI(payload) {
	return (dispatch) => {
		db.collection("articles").doc(payload.id).update(payload.update);
	};
}

export function getRentalsAPI() {
	return (dispatch) => {
		dispatch(setLoading(true));
		let payload;
		let id;
		db.collection("rentals")
			.orderBy("date", "desc") // order by date in descreasing order
			.onSnapshot((snapshot) => {
				payload = snapshot.docs.map((doc) => doc.data());
				id = snapshot.docs.map((doc) => doc.id);
				dispatch(getRentals(payload, id));
			});
		dispatch(setLoading(false));
	};
}

export function updateRentalsAPI(payload) {
	return (dispatch) => {
		db.collection("rentals").doc(payload.id).update(payload.update);
	};
}

export function getRoommatesAPI() {
	return (dispatch) => {
		dispatch(setLoading(true));
		let payload;
		let id;
		db.collection("roommates")
			.orderBy("date", "desc") // order by date in descreasing order
			.onSnapshot((snapshot) => {
				payload = snapshot.docs.map((doc) => doc.data());
				id = snapshot.docs.map((doc) => doc.id);
				dispatch(getRoommates(payload, id));
			});
		dispatch(setLoading(false));
	};
}

export function updateRoommatesAPI(payload) {
	return (dispatch) => {
		db.collection("roommates").doc(payload.id).update(payload.update);
	};
}

export function setUserInfo(uid, userType, displayName, photoURL){
	db.collection("profiles").doc(uid).set({
		looking: true,
		displayName: displayName,
		status: userType ? userType : "Renter",
		uid: uid,
		photoURL: photoURL,
		experiences: []
	});
}

async function uploadImage(img){
	return new Promise(function(resolve, reject){
		const upload = storage.ref(`rental_images/${img.name}`).put(img);
		upload.on(
			"state_changed",
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			},
			(err) => console.log(err),
			async () => {
				const downloadURL = await upload.snapshot.ref.getDownloadURL();
				resolve(downloadURL);
			}
		);
	});
}

/*
async function uploadImageRoommates(img){
	return new Promise(function(resolve, reject){
		const upload = storage.ref(`roommates_images/${img.name}`).put(img);
		upload.on(
			"state_changed",
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			},
			(err) => console.log(err),
			async () => {
				const downloadURL = await upload.snapshot.ref.getDownloadURL();
				resolve(downloadURL);
			}
		);
	});
}
*/

export function postRental(payload) {
	let photos = [];
	for (const img of payload.photos ){
		photos.push(uploadImage(img));
	}
	let [lat, long] = [0, 0];
	Promise.all(photos).then(async (urls)=>{
		photos = urls;
		const address = payload.address;
		const geoCodeToken = "pk.eyJ1IjoibWF0dGhld2dhaW0iLCJhIjoiY2xhYXN6ZnNhMGEzYzNwcnoycjBlZmlnMSJ9.VMZ9zv6-BBkRG_kcYx9naQ";
        await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${geoCodeToken}`)
        .then((resp)=>resp.json())
        .then((data)=>{
            lat = data.features[0].center[1];
            long = data.features[0].center[0];
        });
		db.collection("rentals").add({
			price: payload.price,
 			bedrooms: payload.bedrooms,
 			sharedBedroom: payload.sharedBedroom,
			bathrooms: payload.bathrooms,
			sharedBathroom: payload.sharedBathroom,
			description: payload.description ? payload.description : "Description Unavailable",
			title: payload.title ? payload.title : "Title Unavailable",
			preferences: payload.preferences,
			photos,
			address: payload.address,
			coords: {
				latitude: lat,
				longitude: long
			},
			poster: payload.poster,
			date: payload.date,
		});
	});
}

export function postRoommate(payload) {
	let photos = [];
	for (const img of payload.photos ){
		photos.push(uploadImage(img));
	}
	Promise.all(photos).then((urls)=>{
		photos = urls;
		db.collection("roommates").add({
			price: payload.price,
			bedrooms: payload.bedrooms,
			sharedBedroom: payload.sharedBedroom,
			bathrooms: payload.bathrooms,
			sharedBathroom: payload.sharedBathroom,
			description: payload.description ? payload.description : "Description Unavailable",
			title: payload.title ? payload.title : "Title Unavailable",
			preferences: payload.preferences,
			photos,
			address: payload.address,
			coords: {
				latitude: payload.coords.latitude,
				longitude: payload.coords.longitude
			},
			poster: payload.poster,
			date: payload.date,
		});
	});
}

export function getOtherUser(uid) {
	return (dispatch) => {
		var docRef = db.collection("profiles").doc(uid);
		docRef.get().then((docIncoming) => {
			if (docIncoming.exists) {
				dispatch(setOtherUser(docIncoming.data()));
			} else {
				console.log("No such document!");
			}
		}).catch((error) => {
			console.log("Error getting document:", error);
		});
	}
}

export function postExperience(target_uid, message, when) {
	const data = {
		experience: message,
		when: when,
		uid: auth.currentUser.uid,
		displayName: auth.currentUser.displayName
	}
	const profile = db.collection("profiles").doc(target_uid);
	profile.update({
		experiences: firebase.firestore.FieldValue.arrayUnion(data)
	})
}