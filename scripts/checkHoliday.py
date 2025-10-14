from datetime import datetime
from googleapiclient.discovery import build
from dotenv import load_dotenv
import sys, json
import os


# ตรวจสอบวันหยุดจาก GOOGLE CALECDER
load_dotenv()
API_KEY = os.getenv("GOOGLE_CALENDER_API")
calendar_id = "th.th#holiday@group.v.calendar.google.com"

folder = "../config"
file_path = os.path.join(folder,"holidays.json")

def holiday(year=None):
    if not year:
        year = datetime.now().year
    service = build("calendar", "v3", developerKey=API_KEY)
    start = f"{year}-01-01T00:00:00Z"
    end = f"{year}-12-31T00:00:00Z"
    events_result = (
        service.events()
        .list(
            calendarId=calendar_id,
            timeMin=start,
            timeMax=end,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )
    holidays = []
    for e in events_result.get("items", []):
        holidays.append({
            "date": e["start"].get("date"),
            "name": e["summary"],
            "type": "regular"
        })
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=2)
        print("สร้างไฟล์ holidays.json ใหม่เรียบร้อย")
        
        
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(holidays, f, ensure_ascii=False, indent=2)
    print(f"ดึง {len(holidays)} วันหยุดสำหรับปี {year} เรียบร้อย")
    
if __name__ == "__main__":
    holiday()