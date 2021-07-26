const axios = require("axios");
const { v4 } = require("uuid");
const moment = require("moment");

const generarRandomUser = async () => {
  const { data } = await axios("https://randomuser.me/api");

  const randomUser = data.results[0];
  const nombreUser = `${randomUser.name.first} ${randomUser.name.last}`;
  const roommate = {
    id: v4().slice(-8),
    ingreso: moment().format("D MMMM YYYY, hh:mm:ss a"),
    nombre: nombreUser,
    email: randomUser.email,
  };  
  return roommate;
};

generarRandomUser();

module.exports = generarRandomUser;
