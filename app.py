from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import fitz  # PyMuPDF
import os
import base64
import json
from datetime import datetime
from sentence_transformers import SentenceTransformer, util
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import re
import logging
import traceback

# Load environment variables
load_dotenv()
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Set API keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    logger.error("GOOGLE_API_KEY environment variable is not set!")
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Initialize models
try:
    sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
    logger.info("Models loaded successfully")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    sbert_model = None
    llm = None

# Enhanced resume extraction with metadata
def extract_resume_data(pdf_file):
    try:
        # Rewind file pointer
        pdf_file.seek(0)

        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        full_text = ""
        metadata = {"pages": len(doc)}

        for page in doc:
            full_text += page.get_text()
            full_text += "\f"  # Form feed for page separation

        # Extract first page thumbnail
        first_page = doc[0]
        pix = first_page.get_pixmap(matrix=fitz.Matrix(0.3, 0.3))
        img_bytes = pix.tobytes("png")
        thumbnail = base64.b64encode(img_bytes).decode('utf-8')

        # Extract candidate name and email
        name = "Unknown Candidate"
        email = "No email found"

        # Improved name regex
        name_patterns = [
            r"(?i)\b([A-Z][a-z]+ [A-Z][a-z]+)\b",  # First Last
            r"(?i)\b([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)\b",  # First M. Last
            r"(?i)\b([A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+)\b"  # First Middle Last
        ]

        for pattern in name_patterns:
            name_match = re.search(pattern, full_text[:1000])
            if name_match:
                name = name_match.group(0)
                break

        # Email regex
        email_match = re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", full_text)
        if email_match:
            email = email_match.group(0)

        return {
            "text": full_text,
            "thumbnail": thumbnail,
            "metadata": {
                "name": name,
                "email": email,
                "pages": len(doc),
                "extracted_at": datetime.now().isoformat()
            }
        }
    except Exception as e:
        logger.error(f"Error extracting resume: {str(e)}")
        return {
            "text": "Resume extraction failed",
            "thumbnail": "",
            "metadata": {
                "name": "Error",
                "email": "",
                "pages": 0,
                "extracted_at": datetime.now().isoformat()
            }
        }

# Improved similarity calculation
def get_similarity_score(resume_text, jd_text):
    try:
        if not sbert_model:
            logger.error("SentenceTransformer model not loaded!")
            return 0.0

        resume_embedding = sbert_model.encode(resume_text, convert_to_tensor=True)
        jd_embedding = sbert_model.encode(jd_text, convert_to_tensor=True)
        similarity = util.pytorch_cos_sim(resume_embedding, jd_embedding)
        return round(similarity.item(), 3)
    except Exception as e:
        logger.error(f"Similarity calculation failed: {str(e)}")
        return 0.0

# Generate detailed analysis with Gemini
def generate_analysis(jd, resume_text, similarity_score):
    try:
        if not llm:
            logger.error("Gemini model not loaded!")
            return {"error": "AI model not available"}

        # Limit resume text
        resume_text = resume_text[:15000]

        analysis_prompt = PromptTemplate(
            input_variables=["jd", "resume", "score"],
            template="""
**Resume Analysis Report**
Job Role: {jd}
Similarity Score: {score}/1.00

**Instructions:**
1. Respond ONLY with valid JSON
2. Use the exact keys: skills_match, missing_qualifications, strengths, suitability_rating, interview_questions
3. Maintain consistent array formats
4. Escape special characters properly

**Analysis Tasks:**
1. skills_match: Top 5 technical skills match (array of strings)
2. missing_qualifications: 3 key missing qualifications (array of strings)
3. strengths: 2 strongest experiences (array of strings)
4. suitability_rating: Overall rating A-F (single letter)
5. interview_questions: 2 specific questions (array of strings)

**Resume Content:**
{resume}

**JSON Response:**
```json
{{
  "skills_match": ["Python", "JavaScript"],
  "missing_qualifications": ["AWS Certification", "React Experience"],
  "strengths": ["5 years backend development", "Team leadership"],
  "suitability_rating": "B",
  "interview_questions": ["Can you describe your experience with cloud infrastructure?", "How do you handle technical debt?"]
}}
"""
        )

        analysis_chain = LLMChain(llm=llm, prompt=analysis_prompt)
        response = analysis_chain.run(jd=jd, resume=resume_text, score=similarity_score)
        logger.info(f"Gemini raw response: {response}")

        # Clean and extract JSON
        json_str = response.strip()

        # Remove markdown code fences
        if json_str.startswith("```json"):
            json_str = json_str[7:]
        if json_str.endswith("```"):
            json_str = json_str[:-3]

        # Extract JSON from response
        json_start = json_str.find('{')
        json_end = json_str.rfind('}') + 1
        if json_start != -1 and json_end != -1:
            json_str = json_str[json_start:json_end]

        # Fix common JSON issues
        json_str = json_str.replace(",\n}", "\n}")
        json_str = json_str.replace(",\n]", "\n]")
        json_str = json_str.replace("'", '"')  # Replace single quotes

        parsed = json.loads(json_str)

        # Validate required keys
        required_keys = ["skills_match", "missing_qualifications",
                         "strengths", "suitability_rating", "interview_questions"]

        for key in required_keys:
            if key not in parsed:
                # Create empty values for missing keys
                if key.endswith("s"):
                    parsed[key] = []
                else:
                    parsed[key] = ""
                parsed["error"] = f"Missing key: {key} in response"

        return parsed
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing failed: {str(e)}")
        # Fallback analysis
        return {
            "skills_match": [],
            "missing_qualifications": [],
            "strengths": ["Strong technical match" if similarity_score > 0.6 else "Potential match"],
            "suitability_rating": "B" if similarity_score > 0.6 else "C",
            "interview_questions": [
                "Can you elaborate on your experience with the required technologies?",
                "How would you approach a typical task in this role?"
            ],
            "error": "JSON parsing failed. Using fallback analysis."
        }
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        return {
            "error": f"Analysis failed: {str(e)}",
            "fallback": True
        }

# Email notification function
def send_analysis_email(email, candidate_name, position, score):
    try:
        smtp_server = os.getenv("SMTP_SERVER")
        smtp_port = int(os.getenv("SMTP_PORT", 587))
        smtp_user = os.getenv("SMTP_USER")
        smtp_pass = os.getenv("SMTP_PASSWORD")

        if not all([smtp_server, smtp_user, smtp_pass]):
            logger.warning("SMTP configuration incomplete, email not sent")
            return False

        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = email
        msg['Subject'] = f"Application Update: {position}"

        body = f"""
        <h2>Application Status Update</h2>
        <p>Dear {candidate_name},</p>
        <p>Your application for <strong>{position}</strong> has been reviewed.</p>
        <p>Match Score: <strong>{score * 100:.1f}%</strong></p>
        <p>Our team will contact you if you're selected for the next stage.</p>
        <br>
        <p>Best regards,<br>Hiring Team</p>
        """

        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        return True
    except Exception as e:
        logger.error(f"Email failed: {str(e)}")
        return False

@app.route("/analyze", methods=["POST"])
def analyze_resumes():
    try:
        jd_text = request.form.get("jd")
        position_title = request.form.get("position", "Software Engineer")
        send_emails = request.form.get("send_emails", "false") == "true"
        files = request.files.getlist("resumes")

        # Input validation
        if not jd_text or len(jd_text.strip()) < 50:
            logger.warning("Invalid job description")
            return jsonify({
                "error": "Job description must be at least 50 characters"
            }), 400

        if not files or len(files) == 0:
            logger.warning("No files uploaded")
            return jsonify({
                "error": "No resume files uploaded"
            }), 400

        if len(files) > 10:
            logger.warning("Too many files uploaded")
            return jsonify({
                "error": "Maximum 10 resumes per analysis"
            }), 400

        if not sbert_model or not llm:
            logger.error("Models not loaded")
            return jsonify({
                "error": "AI models failed to load. Please check server logs."
            }), 500

        results = []
        for file in files:
            try:
                logger.info(f"Processing: {file.filename}")

                # Extract resume data
                resume_data = extract_resume_data(file)

                # Calculate similarity
                similarity_score = get_similarity_score(resume_data["text"], jd_text)

                # Generate detailed analysis only if above threshold
                analysis = {}
                if similarity_score >= 0.4:
                    analysis = generate_analysis(
                        jd_text,
                        resume_data["text"],
                        similarity_score
                    )

                # Prepare result
                result = {
                    "filename": file.filename,
                    "similarity": similarity_score,
                    "thumbnail": resume_data["thumbnail"],
                    "metadata": resume_data["metadata"],
                    "analysis": analysis,
                    "selected": similarity_score >= 0.4
                }

                # Send email notification if selected and email exists
                if (send_emails and
                    result["selected"] and
                    resume_data["metadata"]["email"] and
                    "@" in resume_data["metadata"]["email"]):
                    send_analysis_email(
                        resume_data["metadata"]["email"],
                        resume_data["metadata"]["name"],
                        position_title,
                        similarity_score
                    )

                results.append(result)

            except Exception as e:
                logger.error(f"Error processing {file.filename}: {str(e)}")
                logger.error(traceback.format_exc())
                results.append({
                    "filename": file.filename,
                    "error": str(e),
                    "selected": False
                })

        # Sort results by similarity score
        results.sort(key=lambda x: x.get("similarity", 0), reverse=True)

        # Generate dashboard stats
        total = len(results)
        selected = sum(1 for r in results if r.get("selected"))
        total_score = sum(r.get("similarity", 0) for r in results)

        stats = {
            "total": total,
            "selected": selected,
            "average_score": round(total_score / total, 3) if total > 0 else 0,
            "top_skills": {}
        }

        # Aggregate top skills from successful analyses
        for res in results:
            if (res.get("selected") and
                "analysis" in res and
                "skills_match" in res["analysis"] and
                isinstance(res["analysis"]["skills_match"], list)):
                for skill in res["analysis"]["skills_match"]:
                    if isinstance(skill, str):
                        stats["top_skills"][skill] = stats["top_skills"].get(skill, 0) + 1

        return jsonify({
            "results": results,
            "stats": stats,
            "position": position_title,
            "jd": jd_text[:500] + "..." if len(jd_text) > 500 else jd_text
        })

    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500

@app.route("/health", methods=["GET"])
def health_check():
    models_loaded = bool(sbert_model and llm)
    status = "healthy" if models_loaded else "unhealthy"
    return jsonify({
        "status": status,
        "models_loaded": models_loaded,
        "sbert_model": bool(sbert_model),
        "gemini_model": bool(llm)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)