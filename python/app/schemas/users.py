from pydantic import BaseModel
from datetime import datetime

# +---------------------+-------------------------------------+------+-----+-------------------+-----------------------------------------------+
# | Field               | Type                                | Null | Key | Default           | Extra                                         |
# +---------------------+-------------------------------------+------+-----+-------------------+-----------------------------------------------+
# | u_user_id           | bigint                              | NO   | PRI | NULL              | auto_increment                                |
# | u_email             | varchar(100)                        | NO   | UNI | NULL              |                                               |
# | u_password_hash     | varchar(255)                        | NO   |     | NULL              |                                               |
# | u_username          | varchar(50)                         | NO   |     | NULL              |                                               |
# | u_phone_number      | varchar(30)                         | YES  | UNI | NULL              |                                               |
# | u_zipcode           | varchar(20)                         | YES  |     | NULL              |                                               |
# | u_address_main      | varchar(255)                        | YES  |     | NULL              |                                               |
# | u_address_detail    | varchar(255)                        | YES  |     | NULL              |                                               |
# | u_role              | enum('GUEST','HOST','ADMIN')        | NO   |     | GUEST             |                                               |
# | u_status            | enum('ACTIVE','INACTIVE','DELETED') | NO   |     | ACTIVE            |                                               |
# | u_refresh_token     | varchar(500)                        | YES  | UNI | NULL              |                                               |
# | u_token_expiry_date | datetime                            | YES  |     | NULL              |                                               |
# | u_created_at        | datetime                            | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
# | u_updated_at        | datetime                            | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
# | u_booking_id        | int                                 | YES  | UNI | NULL              |                                               |
# +---------------------+-------------------------------------+------+-----+-------------------+-----------------------------------------------+


class UsersOut(BaseModel):
    u_user_id: int
    u_email: str
    u_username: str
    u_phone_number: str | None = None
    u_zipcode: str | None = None
    u_address_main: str | None = None
    u_address_detail: str | None = None
    u_role: str
    u_status: str
    u_refresh_token: str | None = None
    u_token_expiry_date: datetime | None = None
    u_created_at: datetime
    u_updated_at: datetime
    u_booking_id: int | None = None

    class Config:
        orm_mode = True