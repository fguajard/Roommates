const http = require("http");
const fs = require("fs");
const url = require("url");
const {v4} = require("uuid")
const moment = require("moment")
const generarRandomUser = require("./utils/randomUser")
const sendMailAll  = require("./utils/envioCorreo")

const server = http
  .createServer( async (req, res) => {
    let gastosJson
    let roommatesJson
    try {
      gastosJson = JSON.parse(fs.readFileSync("data/Gastos.json", "utf8"));
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end(JSON.stringify(error));
    }
    try {
      roommatesJson = JSON.parse(fs.readFileSync("data/Roommates.json", "utf8"));
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end(JSON.stringify(error));
    }
    //RUTAS CLIENTE
    if (req.url == "/") {
      try {
        const html = fs.readFileSync("public/index/index.html", "utf8");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify(error));
      }
    } 
    
    else if (req.url == "/estilos") {
      try {
        const css = fs.readFileSync("public/index/assets/style.css");
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(css);
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify(error));
      }
    } 
    
    else if (req.url == "/javascript") {
      try {
        const js = fs.readFileSync("public/index/assets/script.js");
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(js);
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify(error));
      }
    }

    else if (req.url == "/boostrapcss") {
      try {
        const bootstrapCss = fs.readFileSync("utils/bootstrap/bootstrap.min.css");
        res.writeHead(200, {"Content-Type": "text/css"});        
        res.end(bootstrapCss);
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify(error));
      }
    }

    else if (req.url == "/boostrapjs") {
      try {
        const boostrapjs = fs.readFileSync("utils/bootstrap/bootstrap.min.js");
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(boostrapjs);
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify(error));
      }
    }
    
    else if (req.url == "/jquery") {
      try {
        const jquery = fs.readFileSync("utils/jquery/jquery.js");
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(jquery);
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify(error));
      }
    }
    else if (req.url == "/axios") {
      try {
        const axios = fs.readFileSync("utils/axios/axios.min.js");
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(axios);
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify(error));
      }
    }
    else if (req.url == "/popper") {
      try {
        const popper = fs.readFileSync("utils/bootstrap/popper.js");
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(popper);
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify(error));
      }
    }
    // RUTAS API ROOMMATES
    else if (req.url == "/roommates" && req.method == "GET") {
      try {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(roommatesJson));
      } catch (error) {
        console.log(`error al leer Roommates ${error}`);
        res.statusCode = 500;
        res.end("Roommates no Disponibles");
      }
    }

    else if (req.url === "/roommate" && req.method === "POST") { 
      const roommate = await generarRandomUser()        
      roommatesJson.push(roommate);
      fs.writeFileSync("data/Roommates.json", JSON.stringify(roommatesJson));
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(roommate));            
    
}    

    // RUTAS API REST GASTOS
    else if (req.url == "/gastos" && req.method == "GET") {
      try {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(gastosJson));
      } catch (error) {
        console.log(`error al leer Gastos ${error}`);
        res.statusCode = 500;
        res.end("Gastos no Disponibles");
      }
    }
    
    else if (req.url === "/gasto" && req.method === "POST") {             
        let body = ""
        req.on("data", (chunk) => {           
           try {
            body = JSON.parse(chunk)     
           } catch (error) {
            console.log(`error al parsear ${error}`);
           }                  
        });               
        req.on("end", async () => {  
          if(!body){
            res.statusCode = 500;
            return res.end("Gasto no Agregado"); 
          }
          const gasto = {
            id : v4().slice(-8),
            creacion: moment().format('D MMMM YYYY, hh:mm:ss a'),
            update:'',
            body : {
              roommate:body.roommate,
              descripcion:body.descripcion,
              monto:body.monto
            }
          }        
         try {
          gastosJson.push(gasto);
          fs.writeFileSync("data/Gastos.json", JSON.stringify(gastosJson));
          res.writeHead(201, { "Content-Type": "application/json" });          
          // const info =  await sendMailAll(gasto)
          // console.log(info);          
          res.end(JSON.stringify(body));
         } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.end("Gasto no Agregado");
         }
        });              
        
    } 
    
    else if (req.url.startsWith("/gasto") && req.method === "DELETE") {
      try {
        const { id } = url.parse(req.url, true).query;        
        if (id) {
          const index = gastosJson.findIndex((gasto) => gasto.id === id);
          const gastoEliminado = gastosJson.splice(index, 1);
          fs.writeFileSync("data/Gastos.json", JSON.stringify(gastosJson));
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(gastoEliminado));
        }
        else{
          throw "Elemento en query string es invalido";
        }
      } catch (error) {
        console.log(`error al eliminar un gasto ${error}`);
        res.statusCode = 500;
        res.end("Gasto no Eliminado");
      }
    } 
    
    else if (req.url.startsWith("/gasto") && req.method === "PUT") {
      try {
        const { id } = url.parse(req.url, true).query;
        if (id) {
          let body = ""
          req.on("data", (chunk) => {           
             try {
              body = JSON.parse(chunk)     
             } catch (error) {
              console.log(`error al parsear ${error}`);
             }                  
          });
          req.on("end", () => {
            if(!body){
              res.statusCode = 500;
              return res.end("Nuevo Gasto es Invalido"); 
            }
            const index = gastosJson.findIndex((gasto) => gasto.id === id);
            gastosJson[index].update = moment().format('D MMMM YYYY, hh:mm:ss a');     
            gastosJson[index].body = body;
            fs.writeFileSync("data/Gastos.json", JSON.stringify(gastosJson));
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(body));
          });
          fs.writeFileSync("data/Gastos.json", JSON.stringify(gastosJson));
        }
        else{
          throw "Elemento en query string es invalido";
        }
      } catch (error) {
        console.log(`error al alterar un gasto ${error}`);
        res.statusCode = 500;
        res.end("Update fallido");
      }
    } 
    // RUTA 404
    else {
      try {
        const errorPage = fs.readFileSync("public/404.html", "utf8");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(errorPage);
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify(error));
      }
    }
  })
  

  server.listen(process.env.PORT || 3000);