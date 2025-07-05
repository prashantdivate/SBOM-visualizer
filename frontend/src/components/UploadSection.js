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
      setIsProcessing(false);

      await axios.post('http://localhost:8000/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setIsUploading(false);
      setIsProcessing(true); // ⏳ Start showing spinner

      await onUpload(); // Wait for backend parsing/extraction

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
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

      {isUploading && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{ height: 8, borderRadius: 5 }}
        />
      )}

      {uploadProgress === 100 && !isUploading && !isProcessing && (
        <Typography
          variant="body2"
          color="success.main"
          sx={{ mt: 1 }}
        >
          Upload complete!
        </Typography>
      )}

      {/* BACKDROP SPINNER DURING PROCESSING */}
      <Backdrop
        open={isProcessing}
        sx={{
          position: 'absolute',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: '#000',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {isUploading
              ? 'Uploading SPDX file...'
              : 'Processing SPDX file. This may take a few moments...'}
          </Typography>
        </Box>
      </Backdrop>
    </Paper>
  );
}

export default UploadSection;
