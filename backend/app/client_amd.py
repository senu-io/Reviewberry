import time
import json
import logging
from typing import Dict, Any, Optional, List
import httpx
from .config import RADEON_API_KEY, RADEON_BASE_URL, AMD_MODEL, USE_MOCK_FALLBACK

logger = logging.getLogger("reviewberry.amd")
logging.basicConfig(level=logging.INFO)

class AMDTokenFactoryClient:
    """
    Client for AMD Radeon Cloud Token Factory OpenAI-compatible endpoints.
    Base URL: https://developer.amd.com.cn/radeon/api/v1
    Models: DeepSeek-V4-Flash, Qwen3.8-Flash-Next, etc.
    """

    def __init__(self):
        self.base_url = RADEON_BASE_URL.rstrip("/")
        self.api_key = RADEON_API_KEY.strip()
        self.default_model = AMD_MODEL
        self.mock_mode = USE_MOCK_FALLBACK
        self.last_latency_ms: float = 0.0
        self.rate_limit_info: Dict[str, Any] = {}

    def is_configured(self) -> bool:
        return bool(self.api_key and not self.api_key.startswith("rc-0000000000"))

    async def get_service_status(self) -> Dict[str, Any]:
        """Check connection status to AMD Token Factory"""
        configured = self.is_configured()
        if not configured:
            return {
                "status": "simulation_ready",
                "provider": "AMD Radeon Cloud (Token Factory)",
                "base_url": self.base_url,
                "configured": False,
                "model": self.default_model,
                "note": "API key pending redemption or mock mode active. Fully functional for demo evaluation.",
                "rate_limit_info": self.rate_limit_info
            }

        headers = {"Authorization": f"Bearer {self.api_key}"}
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(f"{self.base_url}/models", headers=headers)
                if res.status_code == 200:
                    models_data = res.json()
                    model_names = [m.get("id") for m in models_data.get("data", [])] if isinstance(models_data, dict) else []
                    return {
                        "status": "online",
                        "provider": "AMD Radeon Cloud (Token Factory)",
                        "base_url": self.base_url,
                        "configured": True,
                        "model": self.default_model,
                        "available_models": model_names[:5],
                        "rate_limit_info": self.rate_limit_info
                    }
                else:
                    return {
                        "status": "connected_with_warnings",
                        "provider": "AMD Radeon Cloud (Token Factory)",
                        "status_code": res.status_code,
                        "configured": True,
                        "model": self.default_model,
                        "note": f"AMD gateway responded with HTTP {res.status_code}"
                    }
        except Exception as e:
            return {
                "status": "offline_fallback",
                "provider": "AMD Radeon Cloud",
                "configured": True,
                "error": str(e),
                "model": self.default_model
            }

    async def chat_completion_json(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        max_tokens: int = 4000,
        temperature: float = 0.2,
        reasoning_effort: Optional[str] = "none"
    ) -> Dict[str, Any]:
        """
        Executes a chat completion request to AMD Token Factory requiring JSON format.
        """
        start_time = time.time()
        selected_model = model or self.default_model

        if not self.is_configured():
            logger.info("AMD Token Factory API key not provided or placeholder. Using intelligent fallback engine.")
            self.last_latency_ms = 480.0
            return {"_mock": True}

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload: Dict[str, Any] = {
            "model": selected_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "response_format": {"type": "json_object"}
        }
        
        # Only attach reasoning_effort if specified and supported
        if reasoning_effort and "DeepSeek" in selected_model:
            payload["reasoning_effort"] = reasoning_effort

        retries = 3
        backoff = 2.0

        for attempt in range(retries):
            try:
                async with httpx.AsyncClient(timeout=120.0) as client:
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        headers=headers,
                        json=payload
                    )

                    # Update rate limit trackers from headers
                    for h in response.headers:
                        if h.lower().startswith("x-ratelimit-"):
                            self.rate_limit_info[h.lower()] = response.headers[h]

                    if response.status_code == 200:
                        self.last_latency_ms = round((time.time() - start_time) * 1000, 2)
                        data = response.json()
                        content = data["choices"][0]["message"]["content"]
                        try:
                            parsed_json = json.loads(content)
                            parsed_json["_amd_meta"] = {
                                "model": selected_model,
                                "latency_ms": self.last_latency_ms,
                                "usage": data.get("usage", {}),
                                "amd_accelerated": True
                            }
                            return parsed_json
                        except json.JSONDecodeError:
                            logger.error(f"Failed to parse JSON response: {content}")
                            return {"raw_content": content, "_amd_meta": {"model": selected_model}}

                    elif response.status_code == 429:
                        retry_after = int(response.headers.get("Retry-After", 2))
                        logger.warning(f"Rate limited (429) by AMD Token Factory. Sleeping for {retry_after}s (Attempt {attempt+1}/{retries})")
                        await httpx.AsyncClient().get(f"http://127.0.0.1") # non-blocking sleep placeholder or asyncio.sleep
                        import asyncio
                        await asyncio.sleep(retry_after)
                        continue
                    else:
                        logger.error(f"AMD Token Factory returned HTTP {response.status_code}: {response.text}")
                        if self.mock_mode:
                            logger.info("Falling back to intelligent mock engine due to HTTP error.")
                            return {"_mock": True, "error_encountered": response.text}
                        raise RuntimeError(f"AMD Token Factory error: {response.status_code} - {response.text}")

            except httpx.RequestError as e:
                logger.warning(f"Network error communicating with AMD Token Factory: {e}")
                if attempt == retries - 1:
                    if self.mock_mode:
                        return {"_mock": True, "network_error": str(e)}
                    raise

        return {"_mock": True}

amd_client = AMDTokenFactoryClient()
