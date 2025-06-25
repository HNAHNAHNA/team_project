import time
import random

def generate_booking_id() -> int:
    timestamp = int(time.time())  # 예: 1719213762 (10자리)
    rand_part = random.randint(100, 999)  # 3자리 랜덤
    return int(f"{timestamp}{rand_part}"[-10:])  # 10자리 유지