import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import cors from 'cors';
import helmet from 'helmet';
import cron from 'node-cron';
import yauzl from 'yauzl';

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, '../public/upload');
const MAX_FILE_SIZE = 64 * 1024 * 1024; // 64MB
const FILE_AGE_LIMIT = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log('Created upload directory');
  }
}

function generateRandomFilename(): string {
  const chars = '0123456789abcdefABCDEF';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result + '.zip';
}

async function checkZipForInfoDat(filePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);

      let hasInfoDat = false;

      zipfile!.readEntry();
      zipfile!.on('entry', (entry) => {
        if (entry.fileName === 'Info.dat' || entry.fileName === 'info.dat') {
          hasInfoDat = true;
          zipfile!.close();
          return resolve(true);
        }
        zipfile!.readEntry();
      });

      zipfile!.on('end', () => {
        resolve(hasInfoDat);
      });

      zipfile!.on('error', reject);
    });
  });
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDir();
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `temp_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.toLowerCase().endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed'));
    }
  }
});

async function cleanupOldFiles() {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    const now = Date.now();
    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(UPLOAD_DIR, file);
      const stats = await fs.stat(filePath);

      if (now - stats.mtime.getTime() > FILE_AGE_LIMIT) {
        await fs.unlink(filePath);
        deletedCount++;
        console.log(`Deleted old file: ${file}`);
      }
    }

    console.log(`Cleanup completed. Deleted ${deletedCount} files.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

cron.schedule('0 */6 * * *', () => {
  console.log('Running scheduled cleanup...');
  cleanupOldFiles();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/upload', upload.single('zipfile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const tempFilePath = req.file.path;

    try {
      const hasInfoDat = await checkZipForInfoDat(tempFilePath);

      if (!hasInfoDat) {
        await fs.unlink(tempFilePath);
        return res.status(400).json({ error: 'Invalid WIP upload' });
      }

      let newFilename: string = '';
      let newFilePath: string = '';
      let fileExists: boolean = true;

      while (fileExists) {
        const generatedName = generateRandomFilename();
        const generatedPath = path.join(UPLOAD_DIR, generatedName);
        try {
          await fs.access(generatedPath);
        } catch (error: any) {
          if (error.code === 'ENOENT') {
            newFilename = generatedName;
            newFilePath = generatedPath;
            fileExists = false;
          } else {
            throw error;
          }
        }
      }

      await fs.rename(tempFilePath, newFilePath);

      const fileUrl = `${req.protocol}://${req.get('host')}/upload/${newFilename}`;
      const bsrCode = newFilename.replace('.zip', '');

      res.json({
        success: true,
        filename: newFilename,
        bsrCode: bsrCode,
        url: fileUrl,
        message: 'WIP uploaded successfully'
      });

    } catch (error) {
      try {
        await fs.unlink(tempFilePath);
      } catch {}

      console.error('Error processing ZIP file:', error);
      res.status(500).json({ error: 'Error processing ZIP file' });
    }

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/upload/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(UPLOAD_DIR, filename);

  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 64MB limit' });
    }
  }

  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  await ensureUploadDir();

  app.listen(PORT, () => {
    console.log(`WIP Uploader server running on port ${PORT}`);
    console.log(`Upload directory: ${UPLOAD_DIR}`);
    console.log('Cleanup scheduled every 6 hours');
  });
}

startServer().catch(console.error);