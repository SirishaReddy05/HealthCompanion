const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/imageUploader', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Image Schema
const imageSchema = new mongoose.Schema({
    filename: String,
    data: Buffer,
    contentType: String,
});

const Image = mongoose.model('Image', imageSchema);

// Multer Setup (Store in Memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Image Endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const newImage = new Image({
            filename: req.file.originalname,
            data: req.file.buffer,
            contentType: req.file.mimetype,
        });

        await newImage.save();
        res.status(200).json({ message: 'Image uploaded successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Retrieve Images Endpoint
app.get('/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images.map(img => ({
            id: img._id,
            contentType: img.contentType,
            data: img.data.toString('base64')
        })));
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving images' });
    }
});

// Delete Image by ID
app.delete('/delete/:id', async (req, res) => {
    try {
        const imageId = req.params.id;
        await Image.findByIdAndDelete(imageId);  // Delete image by ID
        res.status(200).json({ message: 'Image deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting image: ' + error.message });
    }
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
