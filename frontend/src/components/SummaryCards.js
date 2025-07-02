import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

function SummaryCards({ summary }) {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total # Packages</Typography>
            <Typography variant="h4">{summary.total_packages}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default SummaryCards;
