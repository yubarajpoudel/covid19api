const Promise = require('promise');
const admin = require('./fbadmin')

const globalData = (data) =>  {
	console.log("data", data);
	var db = admin.firestore();
	var timestamp = new Date().getTime();
	return new Promise(function(resolve, reject) {
		let docRef = db.collection('global').doc(timestamp.toString());
		return docRef.set(JSON.parse(data)).then(ref => {
				resolve({'success': true, 'document_id': ref.id});
			}).catch(error => {
			   console.log(error);
			   reject(err);
		});
	});
}


const allStat = async(data) => {
	var db = admin.firestore();
	var timestamp = new Date().getTime();
	var mData = JSON.parse(data);
	var arrayToObject = {};
	for (var i = 0; i < mData.length; i++) {
		 arrayToObject[i.toString()] = mData[i];
	}
	console.log("data", arrayToObject);
	return new Promise(function(resolve, reject) {
		let docRef = db.collection('allstat').doc(timestamp.toString());
		return docRef.set(arrayToObject).then(ref => {
				resolve({'success': true, 'document_id': ref.id});
			}).catch(error => {
			   console.log(error);
			   reject(err);
		});
	});
}

const nepalData = async(data) => {
	console.log("data", data);
		var db = admin.firestore();
		var timestamp = new Date().getTime();
		return new Promise(function(resolve, reject) {
			let docRef = db.collection('nepal').doc(timestamp.toString());
			return docRef.set(JSON.parse(data)).then(ref => {
					resolve({'success': true, 'document_id': ref.id});
				}).catch(error => {
				   console.log(error);
				   reject(err);
			});
		});
}


module.exports = {
   globalData,
   allStat,
   nepalData
}