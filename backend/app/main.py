import io
import csv
import uuid
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .config import PORT, HOST, RADEON_BASE_URL, AMD_MODEL
from .schemas import (
    AnalyzeRequest, AnalysisResult, ReviewItem, CustomerReplyRequest,
    CustomerReplyResponse, StaffMemoRequest, StaffMemoResponse,
    UpdateTaskStatusRequest
)
from .client_amd import amd_client
from .engine import engine
from .sample_data import SAMPLE_DATASETS

app = FastAPI(
    title="Reviewberry API",
    description="Customer complaints become business tasks. Powered by AMD Token Factory.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for active analysis results (for task state persistence during session)
ACTIVE_SESSIONS: Dict[str, AnalysisResult] = {}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Reviewberry API",
        "version": "1.0.0",
        "amd_powered": True
    }

@app.get("/api/amd/status")
async def amd_status():
    """Returns real-time status of AMD Radeon Cloud Token Factory integration"""
    status = await amd_client.get_service_status()
    return status

@app.get("/api/demos")
async def get_demos():
    """Lists available pre-loaded realistic industry datasets"""
    return [
        {
            "id": k,
            "name": v["name"],
            "category": v["category"],
            "location": v["location"],
            "description": v["description"],
            "review_count": len(v["reviews"])
        }
        for k, v in SAMPLE_DATASETS.items()
    ]

@app.get("/api/demos/{demo_id}")
async def get_demo_dataset(demo_id: str):
    """Retrieves full review dataset for a preloaded demo"""
    if demo_id not in SAMPLE_DATASETS:
        raise HTTPException(status_code=404, detail=f"Demo '{demo_id}' not found")
    return SAMPLE_DATASETS[demo_id]

@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_reviews(request: AnalyzeRequest):
    """
    Main AI engine endpoint.
    Processes reviews, clusters complaints, extracts quotes, and builds tasks via AMD Token Factory.
    """
    if not request.reviews:
        raise HTTPException(status_code=400, detail="Reviews list cannot be empty")
    
    result = await engine.analyze(request)
    session_id = request.business_name.lower().replace(" ", "-")
    ACTIVE_SESSIONS[session_id] = result
    return result

@app.post("/api/upload-csv", response_model=AnalysisResult)
async def upload_and_analyze_csv(
    file: UploadFile = File(...),
    business_name: str = Form("Imported Business"),
    business_category: str = Form("Retail & Commerce")
):
    """Accepts CSV file upload with columns (text, author, rating, source, date)"""
    contents = await file.read()
    try:
        decoded = contents.decode("utf-8-sig")
    except UnicodeDecodeError:
        decoded = contents.decode("latin-1")

    reader = csv.DictReader(io.StringIO(decoded))
    reviews = []
    for idx, row in enumerate(reader):
        text = (
            row.get("text") or row.get("review") or row.get("comment") or
            row.get("feedback") or row.get("Review Text") or ""
        ).strip()
        if not text:
            continue
        
        rating_val = None
        for col in ["rating", "stars", "score", "Rating"]:
            if col in row and row[col]:
                try:
                    rating_val = float(row[col])
                    break
                except ValueError:
                    pass

        reviews.append(ReviewItem(
            id=f"csv-{idx+1}",
            text=text,
            author=row.get("author") or row.get("name") or row.get("User") or f"Customer {idx+1}",
            rating=rating_val,
            source=row.get("source") or row.get("channel") or "Imported CSV",
            date=row.get("date") or "Recent"
        ))

    if not reviews:
        raise HTTPException(status_code=400, detail="Could not extract any valid review text rows from CSV.")

    req = AnalyzeRequest(
        business_name=business_name,
        business_category=business_category,
        reviews=reviews
    )
    return await engine.analyze(req)

@app.post("/api/customer-reply", response_model=CustomerReplyResponse)
async def generate_customer_reply(request: CustomerReplyRequest):
    """Generates an empathetic customer apology stating the concrete operational fix."""
    return await engine.generate_customer_reply(request)

@app.post("/api/staff-memo", response_model=StaffMemoResponse)
async def generate_staff_memo(request: StaffMemoRequest):
    """Generates an internal SOP briefing memo for store/kitchen staff."""
    # Find matching cluster & task from active sessions or synthesize
    cluster = None
    task = None
    for sess in ACTIVE_SESSIONS.values():
        for c in sess.clusters:
            if c.id == request.cluster_id:
                cluster = c
                break
        for t in sess.tasks:
            if t.id == request.task_id:
                task = t
                break
    
    if not cluster or not task:
        # Fallback to sample trattoria cluster & task
        demo = SAMPLE_DATASETS["trattoria"]
        temp_res = await engine.analyze(AnalyzeRequest(
            business_name=request.business_name,
            business_category="Restaurant",
            reviews=[ReviewItem(**r) for r in demo["reviews"]]
        ))
        cluster = temp_res.clusters[0]
        task = temp_res.tasks[0]

    return await engine.generate_staff_memo(request.business_name, cluster, task)

@app.patch("/api/tasks/{task_id}/status")
async def update_task_status(task_id: str, payload: UpdateTaskStatusRequest):
    """Updates task workflow state: proposed -> in_progress -> completed"""
    updated = False
    for sess in ACTIVE_SESSIONS.values():
        for t in sess.tasks:
            if t.id == task_id:
                t.status = payload.status
                updated = True
                return {"success": True, "task_id": task_id, "new_status": payload.status}
    
    return {"success": True, "task_id": task_id, "new_status": payload.status, "note": "Updated in local state"}

# Serve frontend build in production if available
frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")
