import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  CircularProgress,
  Backdrop,
} from '@mui/material';

function UploadSection({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    setUploadProgress(0);
    setIsProcessing(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setIsProcessing(false);

      // Upload file with progress
      await axios.post('http://localhost:8000/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setIsUploading(false);
      setIsProcessing(true); // Start processing spinner

      // Call processing endpoint
      await axios.post('http://localhost:8000/process');

      setIsProcessing(false);

      // Refresh data after processing
      if (onUpload) {
        onUpload();
      }
    } catch (error) {
      console.error('Upload or processing failed:', error);
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        mt: 2,
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
        position: 'relative',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Upload SPDX File
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <Button
          variant="outlined"
          component="label"
          disabled={isUploading || isProcessing}
        >
          Choose File
          <input type="file" hidden onChange={handleChange} />
        </Button>

        <Typography variant="body2" color="text.secondary">
          {file ? file.name : 'No file selected'}
        </Typography>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || isUploading || isProcessing}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </Box>

      {/* Upload progress bar */}
      {isUploading && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{ height: 8, borderRadius: 5 }}
        />
      )}

      {/* Upload complete message */}
      {uploadProgress === 100 && !isUploading && !isProcessing && (
        <Typography
          variant="body2"
          color="success.main"
          sx={{ mt: 1 }}
        >
          Upload complete!
        </Typography>
      )}

      {/* Processing backdrop spinner */}
      <Backdrop
        open={isProcessing}
        sx={{
          position: 'fixed',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: '#000',
          backgroundColor: 'rgba(66, 62, 62, 0.8)',
        }}
      >
        <Box 
            sx={{
              backgroundColor: '#fff',
              borderRadius: 3,
              padding: 4,
              boxShadow: 3,
              textAlign: 'center',
              minWidth: 300,
            }}
        >
          <CircularProgress color="inherit" />
          <Typography
            variant="h6"
            sx={{
              mt: 3,
              fontSize: '1.2rem',
            }}
          >
            Processing SPDX file. This may take a few moments...
          </Typography>
        </Box>
      </Backdrop>
    </Paper>
  );
}

export default UploadSection;
