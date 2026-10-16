import os
from pathlib import Path
from dotenv import load_dotenv

# Load from .env if present
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

RADEON_API_KEY = os.getenv("RADEON_API_KEY", "")
RADEON_BASE_URL = os.getenv("RADEON_BASE_URL", "https://developer.amd.com.cn/radeon/api/v1")
AMD_MODEL = os.getenv("AMD_MODEL", "DeepSeek-V4-Flash")
USE_MOCK_FALLBACK = os.getenv("USE_MOCK_FALLBACK", "true").lower() in ("true", "1", "yes")

PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")
