const express=require("express");
const app=express();
const httpserver=require('http').createServer(app);
const io=require("socket.io")(httpserver);
let connections = [];

io.on("connect", (socket) => {
  connections.push(socket);
  socket.join(1);
  console.log(`${socket.id} has connected`);

  socket.on("initialize", (data) => {
    connections.map((con) => {
      if (con.id !== socket.id) {
        con.emit("on_initialize", data);
      }
    });
  });
  socket.on("col_change", (data) => {
    connections.map((con) => {
      if (con.id !== socket.id) {
        con.emit("oncol_change", data);
      }
    });
  });
  socket.on("executingDraw", (data) => {
    connections.map((con) => {
      if (con.id !== socket.id) {
        con.emit("on_executingDraw", data);
      }
    });
  });
  socket.on("executingEnd", (data) => {
    connections.map((con) => {
      if (con.id !== socket.id) {
        con.emit("on_executingEnd", data);
      }
    });
  });
  socket.on("activate", (data) => {
    connections.map((con) => {
      if (con.id !== socket.id) {
        con.emit("on_activate", data);
      }
    });
  });
  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} is disconnected`);
    connections = connections.filter((con) => con.id !== socket.id);
  });
});

app.use(express.static("public"));
let port=process.env.port || 8080;
httpserver.listen(port,()=>{console.log(`server is listening on port ${port}`)});