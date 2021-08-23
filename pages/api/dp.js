const admin = require('firebase-admin');

const serviceAccount = require("../../app-askut-firebase-adminsdk-s9wjr-acb598998a.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://app-askut-default-rtdb.firebaseio.com"
  });
}

export default async function handler(req, res) {
  const docs = await admin.firestore().collection("players").where('id', '==', req.query.player).get();
  if (docs.size > 0) {
    docs.forEach(doc => {
      doc.ref.delete();
    });
  }
  return res.status(200).send({ success: true });
}