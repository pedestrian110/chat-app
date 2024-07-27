const { Router } = require("express");
const { verifyToken } = require("../middlewares/AuthMiddleware.js");
const { createChannel, getChannelMessages, getUserChannels } = require("../controllers/ChannelControler.js");

const channelRoutes = Router();
channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);
channelRoutes.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);


module.exports = channelRoutes;