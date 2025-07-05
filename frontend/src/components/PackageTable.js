import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  TableContainer,
} from '@mui/material';

function PackageTable({ packages, created }) {
  return (
    <Paper
      elevation={3}
      sx={{
        mt: 8,
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Packages installed in image
      </Typography>

      <TableContainer sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Package Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Version</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>License</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created On</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {packages.map((pkg, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  },
                }}
              >
                <TableCell>{pkg.name}</TableCell>
                <TableCell>{pkg.version}</TableCell>
                <TableCell>{pkg.license}</TableCell>
                <TableCell>{created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default PackageTable;
