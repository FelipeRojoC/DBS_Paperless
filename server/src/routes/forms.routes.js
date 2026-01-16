const express = require('express');
const router = express.Router();
const { submitForm, getSubmissions, getSubmissionById } = require('../controllers/forms.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/', verifyToken, submitForm);
router.get('/', verifyToken, getSubmissions);
router.get('/:id', verifyToken, getSubmissionById);

module.exports = router;
