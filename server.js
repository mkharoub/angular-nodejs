// const http = require('http'); //nodejs builtin
// const app = require('./backend/app');
// const port = process.env.PORT || 3000;
//
// // const server = http.createServer((req, res) => {
// //   res.end("This is my first response");
// // });
//
// app.set('port', port);//Telling express which port is should listen to.
// const server = http.createServer(app);
//
// server.listen(port);


const app = require("./backend/app");
const debug = require("debug")("node-angular"); //nodejs builtin package, the second identifier (node-angular), is just a name of any identifier you want!
const http = require("http");

//make sure that the port is a number specially when it comes from env variable
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};


const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

