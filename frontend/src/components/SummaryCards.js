import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

function SummaryCards({ summary }) {
  const actual = summary.total_packages || 0;
  const threshold = 100; // Define your threshold

  const chartData = [
    {
      name: 'Packages',
      count: actual,
    },
  ];

  const barColor = actual > threshold ? '#d32f2f' : '#1976d2'; // Red if above threshold

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {/* Summary Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total # Packages</Typography>
            <Typography
              variant="h4"
              color={actual > threshold ? 'error' : 'primary'}
            >
              {actual}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Bar Chart Card
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Package Count vs Threshold
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />

                
                <ReferenceLine
                  y={threshold}
                  stroke="#f57c00"
                  strokeDasharray="4 4"
                  label={{
                    position: 'right',
                    value: `Threshold (${threshold})`,
                    fill: '#f57c00',
                    fontSize: 12,
                  }}
                />

                <Bar
                  dataKey="count"
                  fill={barColor}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  );
}

export default SummaryCards;
