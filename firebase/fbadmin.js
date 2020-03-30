const admin = require("firebase-admin");

var serviceAccount = require("../covi19-33867-firebase-adminsdk-196bn-90c32ade6c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://covi19-33867.firebaseio.com"
});

module.exports = admin;