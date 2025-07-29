import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Paper,
  Typography,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import { BarChart } from "@mui/icons-material";

const AnalysisDashboard = ({ stats }) => {
  if (!stats) return null;

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardHeader
        title="Application Statistics"
        avatar={<BarChart color="primary" />}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">Total Candidates</Typography>
              <Typography variant="h3" color="primary">
                {stats.total}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">Shortlisted</Typography>
              <Typography variant="h3" color="success.main">
                {stats.selected}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">Avg. Match Score</Typography>
              <Typography variant="h3">
                {(stats.average_score * 100).toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Top Skills
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {Object.entries(stats.top_skills)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([skill, count], i) => (
                  <Chip
                    key={i}
                    label={`${skill} (${count})`}
                    color="primary"
                    variant="outlined"
                  />
                ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AnalysisDashboard;
