const sharepointService = require('../services/sharepoint.service');

const uploadFile = async (req, res) => {
    try {
        // In a real app, multer would handle the file parsing
        // Here we assume req.body contains file metadata or a base64 string for the mock
        const { fileName, folderPath, fileContent } = req.body;

        if (!fileName || !folderPath) {
            return res.status(400).json({ message: 'fileName and folderPath are required' });
        }

        const sharepointUrl = await sharepointService.uploadFileToSharePoint(fileContent, fileName, folderPath);
        res.json({ message: 'File uploaded successfully', url: sharepointUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error uploading to SharePoint' });
    }
};

const createFolder = async (req, res) => {
    try {
        const { folderName } = req.body;
        if (!folderName) {
            return res.status(400).json({ message: 'folderName is required' });
        }

        const sharepointUrl = await sharepointService.createFolder(folderName);
        res.json({ message: 'Folder created successfully', url: sharepointUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating SharePoint folder' });
    }
};

module.exports = {
    uploadFile,
    createFolder
};
