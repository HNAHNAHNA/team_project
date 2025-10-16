from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.database.connection import get_db
from app.schemas.payments import PaymentHistoryItem, PaymentPrepResponse
from app.dependencies.auth import get_current_user
from app.models.payments import Payment, PaymentStatus
from app.models.user_reservations import UserReservation
from app.models.accommodation import Accommodation
from app.models.users import User

router = APIRouter(
    prefix="/api/fastapi/payments",
    tags=["payments"],
)

@router.get("/history", response_model=List[PaymentHistoryItem])
async def get_user_payment_history(
    current_user: Dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the payment history for the currently logged-in user.
    """
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user data in token")

    history = (
        db.query(
            Payment.payment_id,
            UserReservation.reservation_id,
            Accommodation.name.label("hotel_name"),
            UserReservation.check_in_date,
            UserReservation.check_out_date,
            Payment.amount,
            Payment.status,
            Payment.paid_at,
        )
        .join(UserReservation, Payment.reservation_id == UserReservation.reservation_id)
        .join(Accommodation, UserReservation.hotel_id == Accommodation.accommodation_id)
        .filter(Payment.user_id == user_id)
        .filter(Payment.status == "COMPLETED")
        .order_by(Payment.paid_at.desc())
        .all()
    )
    
    return [
        {
            "payment_id": item.payment_id,
            "reservation_id": item.reservation_id,
            "hotel_name": item.hotel_name,
            "check_in_date": item.check_in_date.isoformat(),
            "check_out_date": item.check_out_date.isoformat(),
            "amount": item.amount,
            "status": item.status,
            "paid_at": item.paid_at,
        }
        for item in history
    ]

@router.get("/prepare/{reservation_id}", response_model=PaymentPrepResponse)
async def prepare_payment_for_reservation(
    reservation_id: int,
    current_user: Dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all necessary information to prepare for a payment.
    """
    reservation = (
        db.query(UserReservation)
        .options(joinedload(UserReservation.accommodation))
        .filter(UserReservation.reservation_id == reservation_id)
        .first()
    )

    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    # Check if the reservation belongs to the current user
    user_id = current_user.get("user_id")
    if reservation.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this reservation")

    # Fetch user details separately
    user = db.query(User).filter(User.u_user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # TODO: Replace with actual price calculation logic
    amount = reservation.accommodation.charge

    return PaymentPrepResponse(
        reservation_id=reservation.reservation_id,
        hotel_name=reservation.accommodation.name,
        hotel_address=reservation.accommodation.address,
        check_in_date=reservation.check_in_date.isoformat(),
        check_out_date=reservation.check_out_date.isoformat(),
        amount=amount,
        buyer_name=user.u_username,
        buyer_phone=user.u_phone_number,
    )

@router.post("/complete_virtual")
async def complete_virtual_payment(
    payload: dict = Body(...),
    current_user: Dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Completes a virtual (mock) payment for a reservation.
    """
    reservation_id = payload.get("reservation_id")
    method = payload.get("method")
    user_id = current_user.get("user_id")

    if not all([reservation_id, method, user_id]):
        raise HTTPException(status_code=400, detail="Missing required fields")

    # 1. Find the reservation
    reservation = db.query(UserReservation).filter(
        UserReservation.reservation_id == reservation_id,
        UserReservation.user_id == user_id
    ).first()

    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found or does not belong to user")

    # 2. Check if already paid
    existing_payment = db.query(Payment).filter(Payment.reservation_id == reservation_id).first()
    if existing_payment and existing_payment.status == 'COMPLETED':
        raise HTTPException(status_code=400, detail="This reservation has already been paid for")

    # 3. Get accommodation details for the price
    accommodation = db.query(Accommodation).filter(Accommodation.accommodation_id == reservation.hotel_id).first()
    if not accommodation:
        raise HTTPException(status_code=404, detail="Accommodation details not found")

    # 4. Create or update the payment record
    if existing_payment:
        existing_payment.status = 'COMPLETED'
        existing_payment.payment_method = method.upper()
        existing_payment.paid_at = func.now()
        existing_payment.amount = accommodation.charge
    else:
        new_payment = Payment(
            reservation_id=reservation_id,
            user_id=user_id,
            amount=accommodation.charge,
            payment_method=method.upper(),
            status='COMPLETED',
            paid_at=func.now()
        )
        db.add(new_payment)

    # 5. Update reservation status
    reservation.status = 'COMPLETED'

    db.commit()

    return {"message": "Virtual payment completed successfully"}

@router.post("/cancel/{payment_id}")
async def cancel_payment(
    payment_id: int,
    current_user: Dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Cancels a payment by updating its status to CANCELLED.
    """
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user data in token")

    payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this payment")

    if payment.status != PaymentStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Only completed payments can be cancelled.")

    # Find the related reservation
    reservation = db.query(UserReservation).filter(UserReservation.reservation_id == payment.reservation_id).first()
    if not reservation:
        # This should ideally not happen if data integrity is maintained
        raise HTTPException(status_code=404, detail="Associated reservation not found")

    # Update statuses
    payment.status = PaymentStatus.CANCELLED
    reservation.status = 'PENDING_PAYMENT' # Revert reservation status

    db.commit()

    return {"message": "Payment cancelled successfully"}