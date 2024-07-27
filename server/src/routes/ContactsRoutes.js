const { Router } = require("express");
const { verifyToken } = require("../middlewares/AuthMiddleware.js");
const { getAllContacts, getContactsForDMList, searchContacts } = require("../controllers/ContactsController.js");

const contactsRoutes = Router();
contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList);
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts);

module.exports = contactsRoutes;