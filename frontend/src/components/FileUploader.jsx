import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { CloudUpload, Email, Delete, Description } from "@mui/icons-material";

const FileUploader = ({
  files,
  onAddFiles,
  onRemoveFile,
  emailOption,
  setEmailOption,
}) => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <CardHeader
      title="Resume Upload"
      avatar={<Description color="primary" />}
    />
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={files.length > 0 ? 8 : 12}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUpload />}
            fullWidth
          >
            Add Resumes
            <input
              type="file"
              hidden
              multiple
              onChange={onAddFiles}
              accept=".pdf"
            />
          </Button>
        </Grid>
        {files.length > 0 && (
          <Grid item xs={12} md={4}>
            <ToggleButtonGroup
              value={emailOption ? [true] : []}
              exclusive
              sx={{ width: "100%" }}
              onChange={(_, value) => setEmailOption(!!value)}
            >
              <ToggleButton value={true} sx={{ width: "100%" }}>
                <Email sx={{ mr: 1 }} /> Enable Email Notifications
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        )}
      </Grid>
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, color: "text.secondary" }}
          >
            Selected Files ({files.length})
          </Typography>
          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: "auto" }}>
            <List dense>
              {files.map((file, index) => (
                <ListItem key={index} divider={index < files.length - 1}>
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(1)} KB`}
                    primaryTypographyProps={{ noWrap: true }}
                    sx={{ maxWidth: "calc(100% - 48px)" }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onRemoveFile(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default FileUploader;
