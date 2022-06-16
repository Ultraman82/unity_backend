const winston = require("winston");
const cors = require("cors");
const todos = require("./routes/todos");
const signUp = require("./routes/signUp");
const signIn = require("./routes/signIn");
const blacklist = require("./routes/blacklist");
const boardlist = require("./routes/boardlist");
const connection = require("./routes/connection");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
var regex = require('./routes/regex');
winston.exceptions.handle(
  new winston.transports.Console({ colorize: true, prettyprint: true }),
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (error) => {
  throw error;
});

winston.add(new winston.transports.File({ filename: "logfile.log" }));

require("dotenv").config();

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);
  let bannedWordRegex = regex.getRegex()
  let bannedUsersList = regex.getBannedUsers()

  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {

    console.log(bannedWordRegex.test(data.body))
    // if (bannedWordRegex.test(data.body)) {
    //   console.log("forbiddend input arrived")
    // } else if (bannedUsersList.includes(data.username)) {
    //   console.log("forbiddend username arrived")
    // } else {
    //   io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    // }
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
  });
});

app.use(express.json());
app.use(cors());

app.use("/api/todos", todos);
app.use("/api/signup", signUp);
app.use("/api/signin", signIn);
app.use("/api/blacklist", blacklist);
app.use("/api/boardlist", boardlist);
app.use("/api/connection", connection);
app.use(express.static(path.join(__dirname, '/build')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.get("/console", (req, res) => {
  res.sendFile(path.join(__dirname + '/build/console.html'));
});

// app.get("/", (req, res) => {
//   res.send("test");
//   console.log("test")
// });

const uri = process.env.ATLAS_URI;
const port = process.env.PORT || 5000;

// app.listen(port, () => {
//   console.log(`Server running on port: ${port}...`);
// });

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));

