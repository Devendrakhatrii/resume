// import React, { useState } from "react";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Chip,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Avatar,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   ToggleButton,
//   ToggleButtonGroup,
//   Alert,
//   Snackbar,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   IconButton,
//   Box,
//   Card,
//   CardContent,
//   CardHeader,
//   Divider,
// } from "@mui/material";
// import {
//   CloudUpload,
//   Email,
//   BarChart,
//   ErrorOutline,
//   Delete,
//   Description,
//   Person,
//   CheckCircle,
//   Cancel,
//   Warning,
// } from "@mui/icons-material";
// import axios from "axios";
// import JobDescriptionForm from "./components/JobDescriptionFrom";

// // Component for file upload and management
// const FileUploader = ({ files, onAddFiles, onRemoveFile }) => {
//   return (
//     <Card variant="outlined" sx={{ mb: 2 }}>
//       <CardHeader
//         title="Resume Upload"
//         avatar={<Description color="primary" />}
//       />
//       <CardContent>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={files.length > 0 ? 8 : 12}>
//             <Button
//               variant="contained"
//               component="label"
//               startIcon={<CloudUpload />}
//               fullWidth
//             >
//               Add Resumes
//               <input
//                 type="file"
//                 hidden
//                 multiple
//                 onChange={onAddFiles}
//                 accept=".pdf"
//               />
//             </Button>
//           </Grid>

//           {files.length > 0 && (
//             <Grid item xs={12} md={4}>
//               <ToggleButtonGroup value={true} exclusive sx={{ width: "100%" }}>
//                 <ToggleButton value={true} sx={{ width: "100%" }}>
//                   <Email sx={{ mr: 1 }} /> Enable Email Notifications
//                 </ToggleButton>
//               </ToggleButtonGroup>
//             </Grid>
//           )}
//         </Grid>

//         {files.length > 0 && (
//           <Box sx={{ mt: 2 }}>
//             <Typography
//               variant="subtitle2"
//               sx={{ mb: 1, color: "text.secondary" }}
//             >
//               Selected Files ({files.length})
//             </Typography>
//             <Paper variant="outlined" sx={{ maxHeight: 200, overflow: "auto" }}>
//               <List dense>
//                 {files.map((file, index) => (
//                   <ListItem key={index} divider={index < files.length - 1}>
//                     <ListItemText
//                       primary={file.name}
//                       secondary={`${(file.size / 1024).toFixed(1)} KB`}
//                       primaryTypographyProps={{ noWrap: true }}
//                       sx={{ maxWidth: "calc(100% - 48px)" }}
//                     />
//                     <ListItemSecondaryAction>
//                       <IconButton
//                         edge="end"
//                         aria-label="delete"
//                         onClick={() => onRemoveFile(index)}
//                         color="error"
//                       >
//                         <Delete />
//                       </IconButton>
//                     </ListItemSecondaryAction>
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// <JobDescriptionForm />;

// // Component for analysis results dashboard

// <AnalysisDialog />;

// // Component for candidate analysis results table
// const ResultsTable = ({ results, onViewAnalysis }) => {
//   if (!results || results.length === 0) return null;

//   return (
//     <Card variant="outlined">
//       <CardHeader title="Candidate Analysis" />
//       <CardContent>
//         <TableContainer component={Paper} variant="outlined">
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Candidate</TableCell>
//                 <TableCell width="30%">Match Score</TableCell>
//                 <TableCell width="20%">Status</TableCell>
//                 <TableCell width="20%">Details</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {results.map((res, index) => (
//                 <TableRow key={index} hover>
//                   <TableCell>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       {res.thumbnail ? (
//                         <Avatar
//                           src={`data:image/png;base64,${res.thumbnail}`}
//                           sx={{ mr: 2 }}
//                         />
//                       ) : (
//                         <Avatar sx={{ mr: 2 }}>
//                           {res.metadata?.name?.charAt(0) || "?"}
//                         </Avatar>
//                       )}
//                       <Box>
//                         <Typography fontWeight="medium">
//                           {res.metadata?.name || res.filename}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {res.filename}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Box
//                         sx={{
//                           width: "100%",
//                           bgcolor: "divider",
//                           borderRadius: 1,
//                           overflow: "hidden",
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             width: `${res.similarity * 100}%`,
//                             bgcolor:
//                               res.similarity > 0.7
//                                 ? "success.main"
//                                 : res.similarity > 0.5
//                                 ? "warning.main"
//                                 : "error.main",
//                             height: 24,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             color: "white",
//                             fontWeight: "bold",
//                             fontSize: 14,
//                           }}
//                         >
//                           {(res.similarity * 100).toFixed(1)}%
//                         </Box>
//                       </Box>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     {res.selected ? (
//                       res.analysis?.error ? (
//                         <Chip
//                           label="Partial"
//                           color="warning"
//                           icon={<Warning />}
//                         />
//                       ) : (
//                         <Chip
//                           label="Shortlisted"
//                           color="success"
//                           icon={<CheckCircle />}
//                         />
//                       )
//                     ) : (
//                       <Chip
//                         label="Not Selected"
//                         color="error"
//                         icon={<Cancel />}
//                       />
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="outlined"
//                       onClick={() => onViewAnalysis(index)}
//                       disabled={!res.selected}
//                       size="small"
//                     >
//                       {res.analysis?.error ? "View Partial" : "View Analysis"}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </CardContent>
//     </Card>
//   );
// };

// // Component for analysis dialog
// const AnalysisDialog = ({ open, onClose, candidate, analysis }) => {
//   if (!candidate || !analysis) return null;

//   const renderAnalysisContent = () => {
//     if (!analysis || analysis.error) {
//       return (
//         <Box>
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {analysis?.error || "Analysis failed"}
//           </Alert>

//           {analysis?.suitability_rating && (
//             <Typography variant="h6" gutterBottom>
//               Suitability Rating:
//               <Chip
//                 label={analysis.suitability_rating}
//                 color={
//                   analysis.suitability_rating >= "B"
//                     ? "success"
//                     : analysis.suitability_rating === "C"
//                     ? "warning"
//                     : "error"
//                 }
//                 sx={{ ml: 1 }}
//               />
//             </Typography>
//           )}
//         </Box>
//       );
//     }

//     return (
//       <Box>
//         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//           <Typography variant="h6">
//             Suitability:
//             <Chip
//               label={analysis.suitability_rating}
//               color={
//                 analysis.suitability_rating >= "B"
//                   ? "success"
//                   : analysis.suitability_rating === "C"
//                   ? "warning"
//                   : "error"
//               }
//               sx={{ ml: 1 }}
//             />
//           </Typography>

//           <Chip
//             label={`${(candidate.similarity * 100).toFixed(1)}% Match`}
//             color="primary"
//             variant="outlined"
//           />
//         </Box>

//         <Grid container spacing={2}>
//           <Grid item xs={12} md={6}>
//             <Paper variant="outlined" sx={{ p: 2 }}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ mb: 1, fontWeight: "bold" }}
//               >
//                 Top Matched Skills
//               </Typography>
//               <List dense>
//                 {analysis.skills_match?.map((skill, i) => (
//                   <ListItem key={i}>
//                     <CheckCircle color="success" sx={{ mr: 1, fontSize: 18 }} />
//                     <ListItemText primary={skill} />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Paper variant="outlined" sx={{ p: 2 }}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ mb: 1, fontWeight: "bold" }}
//               >
//                 Missing Qualifications
//               </Typography>
//               <List dense>
//                 {analysis.missing_qualifications?.map((item, i) => (
//                   <ListItem key={i}>
//                     <Cancel color="error" sx={{ mr: 1, fontSize: 18 }} />
//                     <ListItemText primary={item} />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>

//           <Grid item xs={12}>
//             <Paper variant="outlined" sx={{ p: 2 }}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ mb: 1, fontWeight: "bold" }}
//               >
//                 Key Strengths
//               </Typography>
//               <List dense>
//                 {analysis.strengths?.map((strength, i) => (
//                   <ListItem key={i}>
//                     <ListItemText primary={strength} />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>

//           <Grid item xs={12}>
//             <Paper variant="outlined" sx={{ p: 2 }}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ mb: 1, fontWeight: "bold" }}
//               >
//                 Recommended Interview Questions
//               </Typography>
//               <List dense>
//                 {analysis.interview_questions?.map((q, i) => (
//                   <ListItem key={i}>
//                     <ListItemText primary={`${i + 1}. ${q}`} />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     );
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           {candidate.thumbnail ? (
//             <Avatar
//               src={`data:image/png;base64,${candidate.thumbnail}`}
//               sx={{ mr: 2 }}
//             />
//           ) : (
//             <Avatar sx={{ mr: 2 }}>
//               {candidate.metadata?.name?.charAt(0) || "?"}
//             </Avatar>
//           )}
//           <Box>
//             <Typography variant="h6">
//               {candidate.metadata?.name || candidate.filename}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {candidate.filename}
//             </Typography>
//           </Box>
//         </Box>
//       </DialogTitle>
//       <DialogContent dividers>{renderAnalysisContent()}</DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // Main App component
// function App() {
//   const [jobDesc, setJobDesc] = useState("");
//   const [position, setPosition] = useState("Software Engineer");
//   const [files, setFiles] = useState([]);
//   const [results, setResults] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [openDialog, setOpenDialog] = useState(null);
//   const [emailOption, setEmailOption] = useState(false);
//   const [error, setError] = useState(null);

//   const handleAddFiles = (e) => {
//     const newFiles = Array.from(e.target.files);
//     setFiles((prev) => [...prev, ...newFiles]);
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const analyzeResumes = async () => {
//     if (!jobDesc || files.length === 0) return;

//     setLoading(true);
//     setError(null);
//     setResults(null);

//     const formData = new FormData();
//     formData.append("jd", jobDesc);
//     formData.append("position", position);
//     formData.append("send_emails", emailOption);

//     files.forEach((file) => {
//       formData.append("resumes", file);
//     });

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/analyze",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       if (response.data.error) {
//         setError(response.data.error);
//       } else {
//         setResults(response.data);
//       }
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         err.message ||
//         "Unknown error occurred";
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseError = () => {
//     setError(null);
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Box sx={{ textAlign: "center", mb: 4 }}>
//         <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
//           <Box component="span" color="primary.main">
//             AI Resume
//           </Box>{" "}
//           Analyzer
//         </Typography>
//         <Typography variant="subtitle1" color="text.secondary">
//           Automatically shortlist candidates using AI-powered analysis
//         </Typography>
//       </Box>

//       {/* Error notification */}
//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={handleCloseError}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleCloseError}
//           severity="error"
//           sx={{ width: "100%" }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>

//       {/* Input Section */}
//       <Box sx={{ mb: 4 }}>
//         <FileUploader
//           files={files}
//           onAddFiles={handleAddFiles}
//           onRemoveFile={removeFile}
//         />

//         <JobDescriptionForm
//           jobDesc={jobDesc}
//           setJobDesc={setJobDesc}
//           position={position}
//           setPosition={setPosition}
//         />

//         <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={analyzeResumes}
//             disabled={loading || !jobDesc || files.length === 0}
//             size="large"
//             sx={{ minWidth: 180, height: 48 }}
//           >
//             {loading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               "Analyze Resumes"
//             )}
//           </Button>
//         </Box>
//       </Box>

//       {/* Results Section */}
//       {results && (
//         <Box>
//           <AnalysisDashboard stats={results.stats} />
//           <ResultsTable
//             results={results.results}
//             onViewAnalysis={setOpenDialog}
//           />
//         </Box>
//       )}

//       {/* Analysis Dialog */}
//       {results && results.results[openDialog] && (
//         <AnalysisDialog
//           open={openDialog !== null}
//           onClose={() => setOpenDialog(null)}
//           candidate={results.results[openDialog]}
//           analysis={results.results[openDialog]?.analysis}
//         />
//       )}
//     </Container>
//   );
// }

// export default App;

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import FileUploader from "./components/FileUploader";
import AnalysisDashboard from "./components/AnalysisDashboard";
import ResultsTable from "./components/ResultsTable";
import AnalysisDialog from "./components/AnalysisDialog";
import JobDescriptionForm from "./components/JobDescriptionFrom";

function App() {
  const [jobDesc, setJobDesc] = useState("");
  const [position, setPosition] = useState("Software Engineer");
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);
  const [emailOption, setEmailOption] = useState(false);
  const [error, setError] = useState(null);

  const handleAddFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const analyzeResumes = async () => {
    if (!jobDesc || files.length === 0) return;

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append("jd", jobDesc);
    formData.append("position", position);
    formData.append("send_emails", emailOption);

    files.forEach((file) => {
      formData.append("resumes", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResults(response.data);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Unknown error occurred";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          <Box component="span" color="primary.main">
            AI Resume
          </Box>{" "}
          Analyzer
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Automatically shortlist candidates using AI-powered analysis
        </Typography>
      </Box>

      {/* Error notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Input Section */}
      <Box sx={{ mb: 4 }}>
        <FileUploader
          files={files}
          onAddFiles={handleAddFiles}
          onRemoveFile={removeFile}
          emailOption={emailOption}
          setEmailOption={setEmailOption}
        />

        <JobDescriptionForm
          jobDesc={jobDesc}
          setJobDesc={setJobDesc}
          position={position}
          setPosition={setPosition}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={analyzeResumes}
            disabled={loading || !jobDesc || files.length === 0}
            size="large"
            sx={{ minWidth: 180, height: 48 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Analyze Resumes"
            )}
          </Button>
        </Box>
      </Box>

      {/* Results Section */}
      {results && (
        <Box>
          <AnalysisDashboard stats={results.stats} />
          <ResultsTable
            results={results.results}
            onViewAnalysis={setOpenDialog}
          />
        </Box>
      )}

      {/* Analysis Dialog */}
      {results && results.results[openDialog] && (
        <AnalysisDialog
          open={openDialog !== null}
          onClose={() => setOpenDialog(null)}
          candidate={results.results[openDialog]}
          analysis={results.results[openDialog]?.analysis}
        />
      )}
    </Container>
  );
}

export default App;
