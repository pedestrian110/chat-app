const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/AuthRoutes.js");
const contactsRoutes = require("./src/routes/ContactsRoutes.js");
const setupSocket = require("./src/socket.js");
const messagesRoutes = require("./src/routes/MessagesRoutes.js");
const channelRoutes = require("./src/routes/ChannelRoutes.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(
    cors({
        origin: [process.env.ORIGIN],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

setupSocket(server);

mongoose
    .connect(databaseURL)
    .then(() => console.log("DB connection is successful"))
    .catch((err) => console.log(err.message));

app.get("/", (req, res) => {
    res.send({ Message: "Hello World" });
});
