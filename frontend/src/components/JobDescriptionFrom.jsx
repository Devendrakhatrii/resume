import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Typography,
  Box,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  Work as WorkIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

const JobDescriptionForm = ({ jobDesc, setJobDesc, position, setPosition }) => {
  return (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
      <CardHeader
        title="Job Details"
        titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: 1.5,
        }}
      />

      <CardContent>
        {/* Stack fields vertically */}
        <Stack spacing={3}>
          {/* Position Title - First row */}
          <TextField
            label="Position Title"
            fullWidth
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WorkIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          {/* Job Description - Second row */}
          <Box>
            <TextField
              label="Job Description"
              multiline
              minRows={4}
              fullWidth
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste job description here..."
              required
              error={!jobDesc}
              helperText={!jobDesc ? "Job description is required" : ""}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  alignItems: "flex-start",
                  paddingTop: 1.5,
                },
                "& .MuiInputAdornment-root": {
                  marginTop: 0.5,
                },
              }}
            />

            {/* Character count - Third row */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Typography
                variant="caption"
                color={jobDesc.length === 0 ? "error" : "text.secondary"}
              >
                {jobDesc.length} characters
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionForm;
