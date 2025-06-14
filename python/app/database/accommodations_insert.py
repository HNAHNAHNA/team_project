import requests
import json
from sqlalchemy.orm import Session
from app.models.accommodation import Accommodation
from app.config import settings  # application_ID가 들어있는 파일
from fastapi import APIRouter, Depends
from app.database.connection import get_db

router = APIRouter()

RAKUTEN_API_URL = "https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426?"

params = {
    "format": "json",
    "applicationId": settings.application_ID,
    "largeClassCode": "japan",
    "middleClassCode": "tokyo",
    "smallClassCode": "tokyo",
    "detailClassCode": "A",
    "searchPattern": 0,
    "responseType": "large",
    "elements": "hotelNo,hotelName,address1,address2,hotelSpecial,reviewCount,checkinTime,checkoutTime,telephoneNo,latitude,longitude,hotelImageUrl,reviewAverage,hotelMinCharge"
}

def parse_hotel_data(basic: dict, detail: dict) -> Accommodation:
    return Accommodation(
        name=basic["hotelName"],
        address=f"{basic.get('address1', '')} {basic.get('address2', '')}",
        description=basic.get("hotelSpecial", ""),
        image_url=basic.get("hotelImageUrl"),
        charge=int(basic.get("hotelMinCharge", 0)),
        latitude=float(basic.get("latitude", 0)),
        longitude=float(basic.get("longitude", 0)),
        review_count=int(basic.get("reviewCount", 0)),
        review_average=float(basic.get("reviewAverage", 0)),
        checkin_time=detail.get("checkinTime", "00:00"),
        checkout_time=detail.get("checkoutTime", "00:00"),
        telephone=basic.get("telephoneNo"),
        hotel_no=int(basic.get("hotelNo"))
    )

@router.post("/import-hotels")
def import_hotels(db: Session = Depends(get_db)):
    response = requests.get(RAKUTEN_API_URL, params=params)
    if response.status_code != 200:
        return {"error": f"Rakuten API request failed. status_code={response.status_code}"}

    data = response.json()
    hotels = data.get("hotels", [])
    count = 0

    for h in hotels:
        try:
            basic = h["hotel"][0]["hotelBasicInfo"]
            detail = h["hotel"][1].get("hotelDetailInfo", {}) if len(h["hotel"]) > 1 else {}

            # if db.query(Accommodation).filter_by(hotelNo=basic["hotelNo"]).first():
            #     continue

            hotel = parse_hotel_data(basic, detail)
            db.add(hotel)
            count += 1
            print(f"✅ inserted hotelNo={basic['hotelNo']}")

        except Exception as e:
            print(f"❌ Error parsing hotelNo={basic.get('hotelNo')}: {e}")
            continue

    db.commit()
    return {"message": f"{count} hotels imported successfully."}