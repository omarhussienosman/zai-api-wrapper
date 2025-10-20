const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const apiRoutes = require('./routes/api');
const healthRoutes = require('./routes/health');
const diagnosticRoutes = require('./routes/diagnostic');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /audio|mp3|wav|mpeg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 25 * 1024 * 1024, // 25MB
    files: 1
  },
  fileFilter: fileFilter
});

app.use(upload.single('audio'));

app.use('/health', healthRoutes);
app.use('/api', apiRoutes);
app.use('/diagnostic', diagnosticRoutes);

app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;