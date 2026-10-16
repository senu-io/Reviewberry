from typing import List, Dict, Any
from .schemas import ReviewItem

SAMPLE_DATASETS: Dict[str, Dict[str, Any]] = {
    "trattoria": {
        "id": "trattoria",
        "name": "Trattoria Luigi & Delivery",
        "location": "Rome, Italy",
        "category": "Restaurant & Food Delivery",
        "description": "Authentic Italian trattoria in Rome with strong dine-in reputation but struggling with recent delivery logistics and customer complaint volume.",
        "reviews": [
            {
                "id": "rev-01",
                "text": "The rigatoni carbonara was ice cold when it arrived! Took almost 55 minutes for the driver to reach Piazza Navona. Such a shame because dining in person is always wonderful.",
                "author": "Marco Rossi",
                "rating": 2.0,
                "date": "2 days ago",
                "source": "Deliveroo"
            },
            {
                "id": "rev-02",
                "text": "Ordered pizza and pasta on Friday night at 8 PM. Delivered over 45 minutes late, and the cheese on the pizza had congealed completely. Delivery courier didn't even use an insulated thermal bag.",
                "author": "Elena Conti",
                "rating": 1.0,
                "date": "3 days ago",
                "source": "Google Maps"
            },
            {
                "id": "rev-03",
                "text": "Every time we order takeout on the weekend, the food is lukewarm at best. The driver claimed he was waiting 25 minutes at the restaurant kitchen before the food was handed over.",
                "author": "Matteo Bianchi",
                "rating": 2.0,
                "date": "4 days ago",
                "source": "Just Eat"
            },
            {
                "id": "rev-04",
                "text": "Ordered the family dinner combo with extra truffle focaccia and dipping sauce. Guess what? No focaccia in the bag, and no sauce! Contacted store and was told to file a ticket online.",
                "author": "Giulia De Luca",
                "rating": 1.0,
                "date": "5 days ago",
                "source": "Google Maps"
            },
            {
                "id": "rev-05",
                "text": "Missing items again. Paid €8 extra for two homemade cannoli and garlic dip, bag was sealed without them. The kitchen expeditor needs to check the ticket before taping the bag shut.",
                "author": "Alessandro Moretti",
                "rating": 2.0,
                "date": "1 week ago",
                "source": "Deliveroo"
            },
            {
                "id": "rev-06",
                "text": "Tiramisu was smashed upside down inside the paper bag because they stacked a heavy hot pasta bowl right on top of a soft dessert container. Basic packaging training is desperately needed.",
                "author": "Sofia Romano",
                "rating": 1.0,
                "date": "1 week ago",
                "source": "TripAdvisor"
            },
            {
                "id": "rev-07",
                "text": "The courier drove in circles around Trastevere for 20 minutes because the receipt printout cut off the apartment intercom code and gate instructions. Fix your POS delivery slip format!",
                "author": "Davide Ricci",
                "rating": 2.0,
                "date": "1 week ago",
                "source": "Google Maps"
            },
            {
                "id": "rev-08",
                "text": "Food quality is 5/5 when sitting at the table, but 1/5 for delivery. Paper containers leak oil everywhere and arrived soaked through the paper bag. Please switch to foil-lined or vented containers.",
                "author": "Chiara Esposito",
                "rating": 2.0,
                "date": "2 weeks ago",
                "source": "Yelp"
            },
            {
                "id": "rev-09",
                "text": "Food arrived 50 mins late and was basically room temperature. The delivery driver had 3 other orders stacked in an ordinary backpack. Very disappointing service for a €60 dinner.",
                "author": "Fabio Leone",
                "rating": 1.0,
                "date": "2 weeks ago",
                "source": "Deliveroo"
            },
            {
                "id": "rev-10",
                "text": "Second time in a month where the side orders were completely forgotten. Delicious pasta as always, but I'm tired of paying for items that never make it into the delivery bag.",
                "author": "Valentina Ferrari",
                "rating": 2.0,
                "date": "2 weeks ago",
                "source": "Google Maps"
            },
            {
                "id": "rev-11",
                "text": "Dessert was ruined by hot dishes placed directly over it. Packaging layout needs an overhaul.",
                "author": "Luca Marino",
                "rating": 2.0,
                "date": "3 weeks ago",
                "source": "Just Eat"
            },
            {
                "id": "rev-12",
                "text": "Dine in experience was wonderful! Fresh pasta, great house wine, friendly waitstaff. Highly recommend visiting in person.",
                "author": "Antonio Barbieri",
                "rating": 5.0,
                "date": "3 weeks ago",
                "source": "Google Maps"
            }
        ]
    },
    "retail": {
        "id": "retail",
        "name": "UrbanVibe Lifestyle Boutique",
        "location": "Milan, Italy",
        "category": "Fashion & Lifestyle Retail",
        "description": "Multi-channel fashion store with retail shops and an e-commerce platform experiencing repeat complaints about sizing disparity and return processing.",
        "reviews": [
            {
                "id": "ret-01",
                "text": "The European Size L linen shirt fits like a Small! The size chart on the website is completely inaccurate and misleading. Had to return both shirts I bought.",
                "author": "Clara Schmidt",
                "rating": 2.0,
                "date": "1 day ago",
                "source": "Trustpilot"
            },
            {
                "id": "ret-02",
                "text": "Beware of sizing on the summer collection. I ordered my normal size 42 trousers and couldn't even button them. Need to clarify that these items follow a super slim fit cut.",
                "author": "Laura Bellini",
                "rating": 1.0,
                "date": "2 days ago",
                "source": "Google Maps"
            },
            {
                "id": "ret-03",
                "text": "Returned my unworn jacket 16 days ago via courier, tracking shows it was received at their warehouse, but customer support still hasn't issued the refund or replied to my email.",
                "author": "Simone Rinaldi",
                "rating": 1.0,
                "date": "3 days ago",
                "source": "Trustpilot"
            },
            {
                "id": "ret-04",
                "text": "The self-checkout in the flagship store is awful. Security alarm went off twice when walking out because the scanner didn't deactivate the RFID tag. Very embarrassing in front of other shoppers.",
                "author": "Beatrice Galli",
                "rating": 2.0,
                "date": "4 days ago",
                "source": "Google Maps"
            },
            {
                "id": "ret-05",
                "text": "Refund processing takes way too long compared to other fashion brands. Waiting nearly 3 weeks for €140 store credit. No phone number to call either.",
                "author": "Pietro Fontana",
                "rating": 1.0,
                "date": "1 week ago",
                "source": "Trustpilot"
            },
            {
                "id": "ret-06",
                "text": "Sizes run drastically smaller than labelled. Customer service told me I have to pay return shipping even though their size guide was wrong.",
                "author": "Greta Bernardi",
                "rating": 2.0,
                "date": "1 week ago",
                "source": "Site Reviews"
            },
            {
                "id": "ret-07",
                "text": "Store staff were having a private chat while 4 customers waited at the self-checkout because the tag detacher machine was stuck. Please train staff to monitor the self-pay area.",
                "author": "Giorgio Villa",
                "rating": 2.0,
                "date": "2 weeks ago",
                "source": "Google Maps"
            },
            {
                "id": "ret-08",
                "text": "Beautiful interior and aesthetic clothes, but checkout queues and tag removal hassles ruin the shopping experience.",
                "author": "Francesca Serra",
                "rating": 3.0,
                "date": "2 weeks ago",
                "source": "Google Maps"
            }
        ]
    }
}
