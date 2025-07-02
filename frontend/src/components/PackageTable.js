import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

function PackageTable({ packages, created  }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Package Name</TableCell>
          <TableCell>Version</TableCell>
          <TableCell>License</TableCell>
          <TableCell>Created On</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {packages.map((pkg, index) => (
          <TableRow key={index}>
            <TableCell>{pkg.name}</TableCell>
            <TableCell>{pkg.version}</TableCell>
            <TableCell>{pkg.license}</TableCell>
            <TableCell>{created}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PackageTable;
