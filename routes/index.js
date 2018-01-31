const express = require('express');
const fs = require('fs');
const controller = require('../controllers/controller');
const router = express.Router();
// Route to homepage
router.get("/", controller.homePage);
// Routes here
router.get("/api/imagesearch/", controller.empty);
router.get("/api/imagesearch/:search", controller.searchCheck, controller.imageSearch);
router.get("/api/latest/imagesearch/", controller.latestSearch);
module.exports = router;