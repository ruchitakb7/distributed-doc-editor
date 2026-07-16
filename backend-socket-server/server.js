const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
      origin: [
      "http://localhost:3000",
      "https://distributed-doc-editor.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

// io.on("connection", (socket) => {
//     console.log("User Connected:", socket.id);
// });


io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join-document", (documentId) => {
        socket.join(documentId);
        console.log(`${socket.id} joined ${documentId}`);
    });

    socket.on("document-change", ({ documentId, content }) => {

        console.log("Received:", documentId);
        socket.to(documentId).emit("receive-document-change", content);
       
    });

});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Socket Server running on port ${PORT}`);
});