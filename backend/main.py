"""
Reviewberry FastAPI application root entrypoint for Vercel deployment and local Uvicorn serving.
"""

from app.main import app

__all__ = ["app"]
