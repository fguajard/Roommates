const nodemailer = require("nodemailer");
const fs = require("fs");
let roommatesJson;

try {
  roommatesJson = JSON.parse(fs.readFileSync("data/Roommates.json", "utf8"));
} catch (error) {
  console.log(error);
  res.statusCode = 500;
  res.end(JSON.stringify(error));
}

const listaCorreos = roommatesJson.map((roomate) => roomate.email);
listaCorreos.push("nodemailerfguajard@gmail.com");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nodemailerfguajard@gmail.com",
    pass: "Nodemailer",
  },
});

const sendMailAll = async (gasto) => {
  return new Promise((resolve, reject) => {
    const { creacion, body } = gasto;
    const { roommate, descripcion, monto } = body;
    const mailOptions = {
      from: "nodemailerfguajard@gmail.com",
      to: listaCorreos,
      subject: "Se ha generado una nueva compra",
      text: `${roommate} realizo una compra de ${descripcion} por $${monto}\nfecha: ${creacion}`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
};

const test = {
  id: "d65f94e8",
  creacion: "25 July 2021, 11:51:00 pm",
  update: "",
  body: {
    roommate: "Francisco",
    descripcion: "cosas",
    monto: "700000",
  },
};



module.exports = sendMailAll;
