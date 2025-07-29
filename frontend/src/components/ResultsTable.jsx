import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { CheckCircle, Cancel, Warning } from "@mui/icons-material";

const ResultsTable = ({ results, onViewAnalysis }) => {
  if (!results || results.length === 0) return null;

  return (
    <Card variant="outlined">
      <CardHeader title="Candidate Analysis" />
      <CardContent>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Candidate</TableCell>
                <TableCell width="30%">Match Score</TableCell>
                <TableCell width="20%">Status</TableCell>
                <TableCell width="20%">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((res, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {res.thumbnail ? (
                        <Avatar
                          src={`data:image/png;base64,${res.thumbnail}`}
                          sx={{ mr: 2 }}
                        />
                      ) : (
                        <Avatar sx={{ mr: 2 }}>
                          {res.metadata?.name?.charAt(0) || "?"}
                        </Avatar>
                      )}
                      <Box>
                        <Typography fontWeight="medium">
                          {res.metadata?.name || res.filename}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {res.filename}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "100%",
                          bgcolor: "divider",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${res.similarity * 100}%`,
                            bgcolor:
                              res.similarity > 0.7
                                ? "success.main"
                                : res.similarity > 0.5
                                ? "warning.main"
                                : "error.main",
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 14,
                          }}
                        >
                          {(res.similarity * 100).toFixed(1)}%
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {res.selected ? (
                      res.analysis?.error ? (
                        <Chip
                          label="Partial"
                          color="warning"
                          icon={<Warning />}
                        />
                      ) : (
                        <Chip
                          label="Shortlisted"
                          color="success"
                          icon={<CheckCircle />}
                        />
                      )
                    ) : (
                      <Chip
                        label="Not Selected"
                        color="error"
                        icon={<Cancel />}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => onViewAnalysis(index)}
                      disabled={!res.selected}
                      size="small"
                    >
                      {res.analysis?.error ? "View Partial" : "View Analysis"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ResultsTable;
