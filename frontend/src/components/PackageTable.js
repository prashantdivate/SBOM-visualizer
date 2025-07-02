import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

function PackageTable({ packages }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Package Name</TableCell>
          <TableCell>Version</TableCell>
          <TableCell>License</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {packages.map((pkg, index) => (
          <TableRow key={index}>
            <TableCell>{pkg.name}</TableCell>
            <TableCell>{pkg.version}</TableCell>
            <TableCell>{pkg.license}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PackageTable;
