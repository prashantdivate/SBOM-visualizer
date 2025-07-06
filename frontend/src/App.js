import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  CssBaseline,
  Box,
} from '@mui/material';

import UploadSection from './components/UploadSection';
import PackageTable from './components/PackageTable';
import SummaryCards from './components/SummaryCards';

import { useTypingText } from "./useTypingtext";

function App() {
  const [packages, setPackages] = useState([]);
  const [created, setCreated] = useState(null);
  const [summary, setSummary] = useState({});

  const fetchData = async () => {
    try {
      const pkgRes = await axios.get('http://localhost:8000/packages');
      const sumRes = await axios.get('http://localhost:8000/summary');

      setPackages(pkgRes.data.packages || []);
      setCreated(pkgRes.data.created || null);
      setSummary(sumRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const { word } = useTypingText(
    ["upload", "scan", "analyze", "secure"],
    50,
    20,
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/SBOM.webp)', // replace with your image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          zIndex: 1,
        }}
      />

      {/* Main Content */}
      <Container sx={{ pt: 4, pb: 6, position: 'relative', zIndex: 1, color: 'black' }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #2196F3, #9C27B0, #E91E63)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SBOM Manager Dashboard
        </Typography>

        <div style={{ fontSize: "20px", marginTop:'5%' }}>
          Simplify SBOM management by {word}
        </div>

        <UploadSection onUpload={fetchData} />
        <SummaryCards summary={summary} />
        <PackageTable packages={packages} created={created} />
      </Container>
    </Box>
  );
}

export default App;
