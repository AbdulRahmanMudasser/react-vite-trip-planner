import json
import logging
import os
from typing import Dict, Any
from django.conf import settings
from rest_framework import views, status
from rest_framework.response import Response
from dotenv import load_dotenv
import stripe

# Constants
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
EXCHANGE_RATE_PKR_TO_USD = 1 / 291 
SUCCESS_URL = "http://localhost:5173/success"
CANCEL_URL = "http://localhost:5173/cancel"
REQUIRED_FIELDS = ["tripId", "checkIn", "checkOut", "guests", "name", "email", "totalPrice"]

# Configure logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Validate environment variables
if not STRIPE_SECRET_KEY:
    logger.error("STRIPE_SECRET_KEY not found in environment variables")
    raise EnvironmentError("STRIPE_SECRET_KEY is not configured")

# Configure Stripe
stripe.api_key = STRIPE_SECRET_KEY

def convert_pkr_to_usd_cents(total_price_pkr: float) -> int:
    """Convert an amount in PKR to USD cents for Stripe.

    Args:
        total_price_pkr (float): The amount in Pakistani Rupees.

    Returns:
        int: The equivalent amount in USD cents.

    Raises:
        ValueError: If total_price_pkr is not a positive number.
    """
    if total_price_pkr <= 0:
        raise ValueError("Total price must be a positive number")
    
    total_price_usd = total_price_pkr * EXCHANGE_RATE_PKR_TO_USD
    unit_amount_cents = int(total_price_usd * 100)  # Convert USD to cents
    logger.info(
        f"Converted {total_price_pkr:.2f} PKR to {total_price_usd:.2f} USD "
        f"(cents: {unit_amount_cents})"
    )
    return unit_amount_cents

def validate_request_data(data: Dict[str, Any], required_fields: list) -> None:
    """Validate that all required fields are present in the request data.

    Args:
        data (Dict[str, Any]): The request data to validate.
        required_fields (list): List of required field names.

    Raises:
        ValueError: If any required field is missing.
    """
    for field in required_fields:
        if field not in data:
            logger.error(f"Missing required field: {field}")
            raise ValueError(f"Missing required field: {field}")

class CreateCheckoutSessionView(views.APIView):
    """API view to create a Stripe checkout session for hotel bookings."""

    def post(self, request: Any) -> Response:
        """Handle POST requests to create a Stripe checkout session.

        Args:
            request: The HTTP request containing booking details.

        Returns:
            Response: JSON response with the Stripe session ID or an error message.
        """
        try:
            # Log sanitized request data (avoid logging sensitive fields directly)
            logger.info(
                f"Received payment request for tripId: {request.data.get('tripId', 'unknown')}"
            )

            # Validate request data
            validate_request_data(request.data, REQUIRED_FIELDS)

            # Convert totalPrice from PKR to USD cents
            try:
                total_price_pkr = float(request.data["totalPrice"])
                unit_amount_cents = convert_pkr_to_usd_cents(total_price_pkr)
                total_price_usd = total_price_pkr * EXCHANGE_RATE_PKR_TO_USD
            except ValueError as e:
                logger.error(f"Invalid totalPrice format: {str(e)}")
                return Response(
                    {"error": "Invalid totalPrice format"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Create line items for Stripe
            line_items = [
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": f"Booking for Hotel ID: {request.data['tripId']}",
                            "description": (
                                f"Stay from {request.data['checkIn']} to "
                                f"{request.data['checkOut']} - {request.data['guests']} guests"
                            ),
                        },
                        "unit_amount": unit_amount_cents,
                    },
                    "quantity": 1,
                }
            ]

            # Create Stripe checkout session
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=line_items,
                mode="payment",
                success_url=SUCCESS_URL,
                cancel_url=CANCEL_URL,
                customer_email=request.data.get("email"),
                metadata={
                    "tripId": request.data["tripId"],
                    "checkIn": request.data["checkIn"],
                    "checkOut": request.data["checkOut"],
                    "guests": str(request.data["guests"]),
                    "name": request.data["name"],
                    "email": request.data["email"],
                    "phone": request.data.get("phone", ""),
                    "totalPricePKR": str(total_price_pkr),
                    "totalPriceUSD": str(round(total_price_usd, 2)),
                },
            )

            logger.info(f"Stripe session created successfully: {session.id}")
            return Response({"id": session.id}, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {str(e)}")
            return Response(
                {"error": f"Stripe error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Error creating checkout session: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )