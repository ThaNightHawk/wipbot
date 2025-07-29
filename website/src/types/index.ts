export interface UploadResponse {
  success: boolean;
  filename?: string;
  url?: string;
  message?: string;
  error?: string;
}