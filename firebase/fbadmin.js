const admin = require("firebase-admin");

var serviceAccount = require("../covid19-b3a31-firebase-adminsdk-mlhi5-2406946e94.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://covid19-b3a31.firebaseio.com"
});

module.exports = admin;
