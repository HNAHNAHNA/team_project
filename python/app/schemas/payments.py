# +----------------+----------------------------------------------------+------+-----+-------------------+-------------------+
# | Field          | Type                                               | Null | Key | Default           | Extra             |
# +----------------+----------------------------------------------------+------+-----+-------------------+-------------------+
# | payment_id     | bigint                                             | NO   | PRI | NULL              | auto_increment    |
# | reservation_id | int                                                | NO   | MUL | NULL              |                   |
# | user_id        | bigint                                             | NO   | MUL | NULL              |                   |
# | amount         | decimal(10,2)                                      | NO   |     | NULL              |                   |
# | payment_method | enum('CARD','BANK_TRANSFER','KAKAOPAY','NAVERPAY') | NO   |     | NULL              |                   |
# | status         | enum('PENDING','COMPLETED','FAILED','CANCELLED')   | YES  |     | PENDING           |                   |
# | paid_at        | datetime                                           | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
# +----------------+----------------------------------------------------+------+-----+-------------------+-------------------+
from decimal import Decimal
from enum import Enum
from typing import Annotated
from pydantic import BaseModel, condecimal
from datetime import datetime

class PaymentMethod(str, Enum):
    CARD = 'CARD'
    BANK_TRANSFER = 'BANK_TRANSFER'
    KAKAOPAY = 'KAKAOPAY'
    NAVERPAY = 'NAVERPAY'

class PaymentStatus(str, Enum):
    PENDING = 'PENDING'
    COMPLETED = 'COMPLETED'
    FAILED = 'FAILED'
    CANCELLED = 'CANCELLED'

Money = Annotated[Decimal, condecimal(max_digits=10, decimal_places=2)]

class paymentsOUT (BaseModel):
    payment_id: int
    reservation_id: int
    user_id: int
    amount: Money
    payment_method: PaymentMethod
    status: PaymentStatus | None = None
    paid_at:datetime | None = None

    class config:
        orm_mode = True


class PaymentPrepResponse(BaseModel):
    reservation_id: int
    hotel_name: str
    hotel_address: str
    check_in_date: str
    check_out_date: str
    amount: Money
    buyer_name: str
    buyer_phone: str

    class Config:
        orm_mode = True


class PaymentHistoryItem(BaseModel):
    payment_id: int
    reservation_id: int
    hotel_name: str
    check_in_date: str
    check_out_date: str
    amount: Money
    status: PaymentStatus
    paid_at: datetime | None = None

    class Config:
        orm_mode = True