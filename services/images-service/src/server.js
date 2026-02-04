const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { consola } = require("consola");

dotenv.config();

const app = express();

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const cors_options = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3004",
    "http://localhost:80",
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(cors_options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer config (memory storage for direct upload to Supabase)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yami-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Upload helper function
const uploadToSupabase = async (file, path) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = `${path}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'images-service', status: 'ok' });
});

// Upload avatar
app.post('/avatar/upload', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    const url = await uploadToSupabase(req.file, `avatars/user-${req.user.id}`);
    res.json({ success: true, message: 'Avatar uploaded', data: { url } });
  } catch (error) {
    consola.error('Upload avatar error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload store avatar
app.post('/store/avatar/upload', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    const url = await uploadToSupabase(req.file, `stores/store-${req.user.storeId || req.user.id}/avatar`);
    res.json({ success: true, message: 'Store avatar uploaded', data: { url } });
  } catch (error) {
    consola.error('Upload store avatar error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload store cover
app.post('/store/cover/upload', verifyToken, upload.single('cover'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    const url = await uploadToSupabase(req.file, `stores/store-${req.user.storeId || req.user.id}/cover`);
    res.json({ success: true, message: 'Store cover uploaded', data: { url } });
  } catch (error) {
    consola.error('Upload store cover error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete avatar
app.delete('/avatar', verifyToken, async (req, res) => {
  try {
    // Note: In production, you'd want to track the file path in DB and delete from Supabase
    res.json({ success: true, message: 'Avatar removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get avatar
app.get('/avatar', verifyToken, async (req, res) => {
  try {
    // Note: In production, retrieve avatar URL from database
    res.json({ success: true, data: { url: null } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  consola.info(`Images Service running on port ${PORT}`);
});
