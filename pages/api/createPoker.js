import formidable from "formidable";
const fs = require('fs');
const csv = require("csvtojson/v2");
const { v4: uuid } = require('uuid');
const admin = require('firebase-admin');

const serviceAccount = require("../../app-askut-firebase-adminsdk-s9wjr-acb598998a.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://app-askut-default-rtdb.firebaseio.com"
  });
}

export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(req, res) {
  post(req, res);
}

const post = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    saveFile(req, res, fields, files.file);
  });
};

const saveFile = async (req, res, fields, file) => {
  try {
    const jsonArray = await csv({ noheader: true }).fromFile(file.path);
    const pokerId = uuid();

    const data = {
      id: pokerId,
      userId: fields.userId,
      title: fields.title,
    };

    await admin
      .firestore()
      .collection('pokers')
      .add(data);

    jsonArray.forEach((task, index) => {
      admin
        .firestore()
        .collection('tasks')
        .add({
          id: uuid(),
          title: task.field1,
          pokerId,
          active: (index === 0) ? true : false,
          status: 'waiting'
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};
