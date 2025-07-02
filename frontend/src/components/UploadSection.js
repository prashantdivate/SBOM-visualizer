import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button } from '@mui/material';

function UploadSection({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await axios.post("http://localhost:8000/upload", formData);
    onUpload();
  };

  return (
    <Box sx={{ mb: 3 }}>
      <input type="file" onChange={handleChange} />
      <Button variant="contained" onClick={handleUpload} sx={{ ml: 2 }}>
        Upload SPDX
      </Button>
    </Box>
  );
}

export default UploadSection;
