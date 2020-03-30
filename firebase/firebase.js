const Promise = require('promise');
const admin = require('./fbadmin')

const globalData = (data) =>  {
	console.log("globalData");
	console.log("data", data);
	var db = admin.firestore();
	var timestamp = new Date().getTime();
	return new Promise(function(resolve, reject) {
		let docRef = db.collection("global").doc(timestamp.toString());
		return docRef.set(JSON.parse(data)).then(ref => {
				resolve({'success': true, 'document_id': ref.id});
			}).catch(error => {
			   console.log(error);
			   reject(err);
		});
	});
}


const allStat = async() => {

}

const nepaldata = async() => {

}


module.exports = {
   globalData,
   allStat,
   nepaldata
}