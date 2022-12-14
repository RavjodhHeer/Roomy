import os
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)
cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/get_other_user', methods=['POST','GET'])
def get_other_user():
    """
    Request Input: uid (string)\n
    Return other person's profile data on profile page
    """
    try:
        raw_profile = db.collection(u'profiles').document(request.form['uid']).get()
        profile = raw_profile.to_dict()
        for res in profile.get('experiences'): # Attach profile pics to experiences
            uid = res.get('uid')
            curr_profile = db.collection(u'profiles').document(uid).get()
            res['profilePic'] = curr_profile.to_dict()[u'photoURL']
        return jsonify(profile), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/get_rentals', methods=['POST','GET'])
def get_rentals():
    """
    Return all available rentals
    """
    try:
        query = db.collection(u'rentals').order_by(u'date', direction=firestore.Query.DESCENDING)
        results = query.stream()
        rentals = []
        ids = []
        for res in results:
            ids.append(res.id)

            # Attach profile pic to posts
            curr_rental = res.to_dict()
            curr_profile = db.collection(u'profiles').document(curr_rental[u'poster']).get()
            curr_rental[u'profilePic'] = curr_profile.to_dict()[u'photoURL']

            rentals.append(curr_rental)
        return jsonify({"ids": ids, "rentals": rentals}), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/get_roommates', methods=['POST','GET'])
def get_roommates():
    """
    Return all available roommates
    """
    try:
        query = db.collection(u'roommates').order_by(u'date', direction=firestore.Query.DESCENDING)
        results = query.stream()
        roommates = []
        ids = []
        for res in results:
            ids.append(res.id)

            # Attach profile pic to posts
            curr_roomy = res.to_dict()
            curr_profile = db.collection(u'profiles').document(curr_roomy[u'poster']).get()
            curr_roomy[u'profilePic'] = curr_profile.to_dict()[u'photoURL']

            roommates.append(curr_roomy)
        return jsonify({"ids": ids, "roommates": roommates}), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/get_articles', methods=['POST','GET'])
def get_articles():
    """
    Return all main page posts
    """
    try:
        query = db.collection(u'articles').order_by(u'actor.date', direction=firestore.Query.DESCENDING)
        results = query.stream()
        posts = []
        ids = []
        for res in results:
            ids.append(res.id)
            curr_post = res.to_dict()
            posts.append(curr_post)
        return jsonify({"ids": ids, "posts": posts}), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/get_single_article', methods=['POST','GET'])
def get_single_article():
    """
    Request Input: pid (string)\n
    Return single main page post
    """
    try:
        pid = request.form['pid']
        curr_post = db.collection(u'articles').document(pid).get()
        post = curr_post.to_dict()
        return jsonify({"ids":curr_post.id, "posts":post }), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/post_article', methods=['POST'])
def post_article():
    """
    Request Input: article (dictionary)\n
    Posts single main page post
    """
    try:
        article = request.json
        article['actor']['date'] = datetime.datetime.utcnow() # UTC time added here to avoid JSON misformatting
        db.collection(u'articles').add(article)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/post_rental', methods=['POST'])
def post_rental():
    """
    Request Input: rental (dictionary)\n
    Posts single rental advertisement
    """
    try:
        rental = request.json
        rental['date'] = datetime.datetime.utcnow()
        db.collection(u'rentals').add(rental)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/post_roommate', methods=['POST'])
def post_roommate():
    """
    Request Input: roommate (dictionary)\n
    Posts single roommate advertisement
    """
    try:
        roommate = request.json
        roommate['date'] = datetime.datetime.utcnow()
        db.collection(u'roommates').add(roommate)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/set_user_info', methods=['POST'])
def set_user_info():
    """
    Request Input: user_info (dictionary)\n
    Initially set user info when first creating account
    """
    try:
        info = request.json
        uid = info['uid']
        db.collection(u'profiles').document(uid).set(info)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/update_profile_data', methods=['POST'])
def update_profile_data():
    """
    Request Input: user_info (dictionary)\n
    Update existing user info
    """
    try:
        info = request.json
        uid = info['uid']
        profile = info['profile']
        db.collection(u'profiles').document(uid).update(profile)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/update_article', methods=['POST'])
def update_article():
    """
    Request Input: article_info (dictionary)\n
    Update existing post on main page
    """
    try:
        info = request.json
        pid = info['pid']
        update = info['update']
        db.collection(u'articles').document(pid).update(update)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/save_property', methods=['POST'])
def save_property():
    """
    Request Input: uid (string), key (string), save (string)\n
    Add / remove given property from user saved property list
    """
    try:
        info = request.json
        uid = info['uid']
        key = info['key']
        save = info['save']
        if(save == 'True'):
            db.collection(u'profiles').document(uid).update({
                u'savedProperties': firestore.ArrayUnion([key])
            })
        else:
            db.collection(u'profiles').document(uid).update({
                u'savedProperties': firestore.ArrayRemove([key])
            })
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

@app.route('/post_experience', methods=['POST'])
def post_experience():
    """
    Request Input: target_uid (string), exp (dictionary)\n
    Add experience with another user
    """
    try:
        info = request.json
        target_uid = info['target_uid']
        exp = info['exp']
        db.collection(u'profiles').document(target_uid).update({
            u'experiences': firestore.ArrayUnion([exp])
        })
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({f"An error occured: {e}"}), 400

if __name__ == '__main__':
    app.run(debug=True, threaded=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))