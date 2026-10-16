import asyncio
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.schemas import AnalyzeRequest, ReviewItem, CustomerReplyRequest, StaffMemoRequest
from app.engine import engine
from app.sample_data import SAMPLE_DATASETS

async def run_tests():
    print("Testing Reviewberry AI Engine with Trattoria Dataset...")
    sample = SAMPLE_DATASETS["trattoria"]
    reviews = [ReviewItem(**r) for r in sample["reviews"]]

    req = AnalyzeRequest(
        business_name=sample["name"],
        business_category=sample["category"],
        reviews=reviews
    )

    result = await engine.analyze(req)
    print(f"Analysis Complete!")
    print(f"Total reviews: {result.total_reviews_analyzed}")
    print(f"Negative sentiment: {result.negative_sentiment_pct}%")
    print(f"Clusters identified: {len(result.clusters)}")
    for c in result.clusters:
        print(f"  - [{c.severity.upper()}] {c.title} ({len(c.supporting_quotes)} quotes)")
    
    print(f"\nGenerated Action Tasks: {len(result.tasks)}")
    for t in result.tasks:
        print(f"  - [{t.priority}] {t.title} -> {t.department} ({t.assignee_role})")
        print(f"    Checklist steps: {len(t.checklist)}")

    assert len(result.clusters) > 0, "Expected at least 1 cluster"
    assert len(result.tasks) > 0, "Expected at least 1 task"
    assert len(result.clusters[0].supporting_quotes) > 0, "Expected supporting quotes"

    # Test Customer Reply Copilot
    print("\nTesting Customer Recovery Reply Generator...")
    reply_req = CustomerReplyRequest(
        business_name=sample["name"],
        cluster_title=result.clusters[0].title,
        customer_quote=result.clusters[0].supporting_quotes[0].quote,
        customer_name="Marco Rossi"
    )
    reply_res = await engine.generate_customer_reply(reply_req)
    print(f"Generated Reply Preview:\n{reply_res.reply_text[:200]}...")
    assert len(reply_res.reply_text) > 50

    # Test Staff Memo Generator
    print("\nTesting Staff SOP Memo Generator...")
    memo_res = await engine.generate_staff_memo(
        business_name=sample["name"],
        cluster=result.clusters[0],
        task=result.tasks[0]
    )
    print(f"Generated Memo Title: {memo_res.memo_title}")
    assert "OPERATIONAL BRIEFING" in memo_res.markdown_content

    print("\n ALL ENGINE TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run_tests())
