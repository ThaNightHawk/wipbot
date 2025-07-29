# WIP Uploader

A Node.js TypeScript Express application for uploading ZIP files with automatic cleanup.

## Features

- Upload ZIP files up to 64MB
- Validates that ZIP files contain an `info.dat` file
- Generates random 5-character filenames using `0123456789abcdefABCDEF`
- Automatic cleanup of files older than 7 days every 6 hours
- Dark modern UI
- REST API endpoints

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Usage

- Visit `http://localhost:3000` to access the upload interface
- Upload ZIP files through the web interface or API
- Files are accessible at `/upload/{filename}`

## API Endpoints

### POST /upload
Upload a ZIP file
- Body: multipart/form-data with `zipfile` field
- Returns: JSON with success status and file URL

### GET /upload/:filename
Download an uploaded file

## Configuration

- `PORT`: Server port (default: 3000)
- Files are stored in `public/upload/` directory
- Cleanup runs every 6 hours via cron job
- Files older than 7 days are automatically deleted

## File Structure

```
src/
  ├── server.ts        # Main server file
  ├── types/           # TypeScript type definitions
public/
  ├── index.html       # Frontend interface
  └── upload/          # Uploaded files directory
```