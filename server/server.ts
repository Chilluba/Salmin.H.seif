import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Storage for uploaded background image
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

let backgroundImage = 'default-background.jpg'; // A default image can be placed in uploads

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const newFilename = `background${path.extname(file.originalname)}`;
    // Remove old background if it exists
    const oldPath = path.join(UPLOADS_DIR, backgroundImage);
    if (fs.existsSync(oldPath) && backgroundImage !== 'default-background.jpg') {
        fs.unlinkSync(oldPath);
    }
    backgroundImage = newFilename;
    cb(null, newFilename);
  },
});

const upload = multer({ storage });

// --- Routes ---

// GET current background image
app.get('/background', (req, res) => {
  res.json({ imageUrl: `/uploads/${backgroundImage}` });
});

// POST to upload a new background image
app.post('/upload-background', upload.single('background'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ imageUrl: `/uploads/${backgroundImage}` });
});

// POST to remove the background image
app.post('/remove-background', (req, res) => {
    const oldPath = path.join(UPLOADS_DIR, backgroundImage);
    if (fs.existsSync(oldPath) && backgroundImage !== 'default-background.jpg') {
        fs.unlinkSync(oldPath);
    }
    backgroundImage = 'default-background.jpg';
    res.json({ message: 'Background removed successfully' });
});

// POST to login
const ADMIN_PASSWORD = 'admin'; // In a real app, use environment variables
let authToken = '';

app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    // Generate a simple token (in a real app, use JWT)
    authToken = `token-${Date.now()}`;
    res.json({ success: true, token: authToken });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

import { Request, Response, NextFunction } from 'express';

// Middleware to check token for protected routes
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token && token === authToken) {
        return next();
    }
    res.status(403).json({ message: 'Forbidden' });
};

// Example of a protected route
app.get('/admin-data', isAuthenticated, (req, res) => {
    res.json({ data: 'Some secret admin data' });
});

// Catch-all route to serve index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});


export default app;
