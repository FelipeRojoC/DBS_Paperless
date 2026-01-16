const express = require('express');
const router = express.Router();
const { uploadFile, createFolder } = require('../controllers/sharepoint.controller');

// Upload file to SharePoint
router.post('/upload', uploadFile);

// Create folder in SharePoint
router.post('/folder', createFolder);

module.exports = router;
