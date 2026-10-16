import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app

def test_full_api_suite():
    client = TestClient(app)

    # 1. Test health endpoint
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    print("✓ Health endpoint verified:", data)

    # 2. Test AMD status
    res = client.get("/api/amd/status")
    assert res.status_code == 200
    data = res.json()
    assert "AMD" in data["provider"]
    print("✓ AMD status endpoint verified:", data["provider"], "-", data["model"])

    # 3. Test demos listing
    res = client.get("/api/demos")
    assert res.status_code == 200
    demos = res.json()
    assert len(demos) >= 2
    print(f"✓ Demos endpoint verified: {len(demos)} demo scenarios available")

    # 4. Test specific demo dataset retrieval
    res = client.get("/api/demos/trattoria")
    assert res.status_code == 200
    demo = res.json()
    assert len(demo["reviews"]) >= 10
    print(f"✓ Trattoria demo verified: {len(demo['reviews'])} reviews loaded")

    # 5. Test analyze endpoint
    res = client.post("/api/analyze", json={
        "business_name": demo["name"],
        "business_category": demo["category"],
        "reviews": demo["reviews"]
    })
    assert res.status_code == 200
    analysis = res.json()
    assert len(analysis["clusters"]) > 0
    assert len(analysis["tasks"]) > 0
    print(f"✓ Analyze endpoint verified: {len(analysis['clusters'])} clusters, {len(analysis['tasks'])} tasks")

    # 6. Test Customer Reply generator
    first_cluster = analysis["clusters"][0]
    first_quote = first_cluster["supporting_quotes"][0]
    res = client.post("/api/customer-reply", json={
        "business_name": demo["name"],
        "cluster_title": first_cluster["title"],
        "customer_quote": first_quote["quote"],
        "customer_name": first_quote["author"]
    })
    assert res.status_code == 200
    reply = res.json()
    assert len(reply["reply_text"]) > 20
    print("✓ Customer reply endpoint verified")

    # 7. Test Staff SOP memo generator
    res = client.post("/api/staff-memo", json={
        "business_name": demo["name"],
        "cluster_id": first_cluster["id"],
        "task_id": analysis["tasks"][0]["id"]
    })
    assert res.status_code == 200
    memo = res.json()
    assert "SOP" in memo["memo_title"]
    print("✓ Staff memo endpoint verified")

    # 8. Test task status update
    task_id = analysis["tasks"][0]["id"]
    res = client.patch(f"/api/tasks/{task_id}/status", json={"status": "in_progress"})
    assert res.status_code == 200
    print("✓ Task status toggle endpoint verified")

    # 9. Test root frontend static serving
    res = client.get("/")
    assert res.status_code == 200
    assert "Reviewberry" in res.text
    print("✓ Unified frontend HTML serving verified")

    print("\n ALL ENDPOINTS AND FRONTEND SERVING VERIFIED 100% OPERATIONAL!")

if __name__ == "__main__":
    test_full_api_suite()
