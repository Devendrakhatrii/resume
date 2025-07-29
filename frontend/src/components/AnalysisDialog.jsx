import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

const AnalysisDialog = ({ open, onClose, candidate, analysis }) => {
  if (!candidate || !analysis) return null;

  const renderAnalysisContent = () => {
    if (!analysis || analysis.error) {
      return (
        <Box>
          <Alert severity="error" sx={{ mb: 2 }}>
            {analysis?.error || "Analysis failed"}
          </Alert>
          {analysis?.suitability_rating && (
            <Typography variant="h6" gutterBottom>
              Suitability Rating:
              <Chip
                label={analysis.suitability_rating}
                color={
                  analysis.suitability_rating >= "B"
                    ? "success"
                    : analysis.suitability_rating === "C"
                    ? "warning"
                    : "error"
                }
                sx={{ ml: 1 }}
              />
            </Typography>
          )}
        </Box>
      );
    }

    return (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">
            Suitability:
            <Chip
              label={analysis.suitability_rating}
              color={
                analysis.suitability_rating >= "B"
                  ? "success"
                  : analysis.suitability_rating === "C"
                  ? "warning"
                  : "error"
              }
              sx={{ ml: 1 }}
            />
          </Typography>
          <Chip
            label={`${(candidate.similarity * 100).toFixed(1)}% Match`}
            color="primary"
            variant="outlined"
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Top Matched Skills
              </Typography>
              <List dense>
                {analysis.skills_match?.map((skill, i) => (
                  <ListItem key={i}>
                    <CheckCircle color="success" sx={{ mr: 1, fontSize: 18 }} />
                    <ListItemText primary={skill} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Missing Qualifications
              </Typography>
              <List dense>
                {analysis.missing_qualifications?.map((item, i) => (
                  <ListItem key={i}>
                    <Cancel color="error" sx={{ mr: 1, fontSize: 18 }} />
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Key Strengths
              </Typography>
              <List dense>
                {analysis.strengths?.map((strength, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={strength} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Recommended Interview Questions
              </Typography>
              <List dense>
                {analysis.interview_questions?.map((q, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={`${i + 1}. ${q}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {candidate.thumbnail ? (
            <Avatar
              src={`data:image/png;base64,${candidate.thumbnail}`}
              sx={{ mr: 2 }}
            />
          ) : (
            <Avatar sx={{ mr: 2 }}>
              {candidate.metadata?.name?.charAt(0) || "?"}
            </Avatar>
          )}
          <Box>
            <Typography variant="h6">
              {candidate.metadata?.name || candidate.filename}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {candidate.filename}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>{renderAnalysisContent()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisDialog;
