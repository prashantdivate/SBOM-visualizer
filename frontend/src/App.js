import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import UploadSection from './components/UploadSection';
import PackageTable from './components/PackageTable';
import SummaryCards from './components/SummaryCards';

function App() {
  const [packages, setPackages] = useState([]);
  const [summary, setSummary] = useState({});

  const fetchData = async () => {
    try {
      const pkgRes = await axios.get('http://localhost:8000/packages');
      const sumRes = await axios.get('http://localhost:8000/summary');
      setPackages(pkgRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>SBOM Dashboard</Typography>
      <UploadSection onUpload={fetchData} />
      <SummaryCards summary={summary} />
      <PackageTable packages={packages} />
    </Container>
  );
}

export default App;
