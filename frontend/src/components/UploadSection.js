import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
} from '@mui/material';

function UploadSection({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    setUploadProgress(0); // reset progress
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      await axios.post('http://localhost:8000/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      onUpload();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
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
        >
          Choose File
          <input
            type="file"
            hidden
            onChange={handleChange}
          />
        </Button>

        <Typography variant="body2" color="text.secondary">
          {file ? file.name : 'No file selected'}
        </Typography>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || isUploading}
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

      {uploadProgress === 100 && !isUploading && (
        <Typography
          variant="body2"
          color="success.main"
          sx={{ mt: 1 }}
        >
          Upload complete!!
        </Typography>
      )}
    </Paper>
  );
}

export default UploadSection;
