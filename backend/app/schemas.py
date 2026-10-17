from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ReviewItem(BaseModel):
    id: str = Field(..., description="Unique review identifier")
    text: str = Field(..., description="Raw review or feedback text")
    author: Optional[str] = Field("Anonymous", description="Customer or reviewer name")
    rating: Optional[float] = Field(None, description="Star rating (1 to 5)")
    date: Optional[str] = Field(None, description="Review date or relative timestamp")
    source: Optional[str] = Field("Google", description="Feedback channel (Google, Yelp, Deliveroo, etc.)")

class AnalyzeRequest(BaseModel):
    business_name: str = Field(..., description="Name of store or restaurant")
    business_category: str = Field(..., description="Type of commerce business")
    reviews: List[ReviewItem] = Field(..., description="List of reviews to cluster and triage")
    custom_focus: Optional[str] = Field(None, description="Optional focus area e.g. delivery, packaging")

class SupportingQuote(BaseModel):
    quote: str
    review_id: str = "rev-01"
    source: str = "Customer Review"
    author: str = "Customer"
    sentiment_score: float = -0.8

class IssueCluster(BaseModel):
    id: str
    title: str
    category: str = "Operations"
    description: str = "Recurring operational friction reported by customers."
    severity: str = "high"  # low, medium, high, critical
    frequency: int = 2
    percentage: float = 25.0
    estimated_churn_risk: str = "High"
    affected_channels: List[str] = Field(default_factory=lambda: ["Direct Review", "Online"])
    supporting_quotes: List[SupportingQuote] = Field(default_factory=list)

class ActionTask(BaseModel):
    id: str
    cluster_id: str
    title: str
    department: str = "Operations & Service"
    priority: str = "P1 - Urgent"  # P1 - Urgent, P2 - High, P3 - Medium, P4 - Low
    assignee_role: str = "Shift Supervisor"
    estimated_resolution_time: str = "24-48 hours"
    checklist: List[str] = Field(default_factory=lambda: ["Audit current procedure", "Standardize handling checklist", "Brief shift team"])
    expected_business_outcome: str = "Prevent recurring complaints and improve customer satisfaction."
    status: str = "proposed"  # proposed, in_progress, completed

class AnalysisResult(BaseModel):
    business_name: str
    business_category: str
    total_reviews_analyzed: int
    negative_sentiment_pct: float
    recurring_complaints_count: int
    key_findings_summary: str
    clusters: List[IssueCluster]
    tasks: List[ActionTask]
    amd_metadata: Dict[str, Any]

class CustomerReplyRequest(BaseModel):
    business_name: str
    cluster_title: str
    customer_quote: str
    customer_name: Optional[str] = "Valued Customer"
    tone: Optional[str] = "empathetic_professional"
    action_taken: Optional[str] = None

class CustomerReplyResponse(BaseModel):
    reply_text: str
    action_highlight: str
    coupon_or_offer_suggested: Optional[str] = None

class StaffMemoRequest(BaseModel):
    business_name: str
    cluster_id: str
    task_id: str

class StaffMemoResponse(BaseModel):
    memo_title: str
    target_department: str
    markdown_content: str

class UpdateTaskStatusRequest(BaseModel):
    status: str
