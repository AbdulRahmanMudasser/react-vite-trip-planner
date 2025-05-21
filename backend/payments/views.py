import stripe
from django.conf import settings
from rest_framework import views, status
from rest_framework.response import Response
from dotenv import load_dotenv
import os
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Retrieve the Stripe secret key from environment variables
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
if not STRIPE_SECRET_KEY:
    logger.error("STRIPE_SECRET_KEY not found in environment variables")

# Configure Stripe with your secret key
stripe.api_key = STRIPE_SECRET_KEY

class CreateCheckoutSessionView(views.APIView):
    def post(self, request):
        try:
            # Log the incoming request data (sanitize sensitive information in production)
            logger.info(f"Received payment request: {request.data}")
            
            data = request.data
            
            # Validate required fields
            required_fields = ['tripId', 'checkIn', 'checkOut', 'guests', 'name', 'email', 'totalPrice']
            for field in required_fields:
                if field not in data:
                    logger.error(f"Missing required field: {field}")
                    return Response(
                        {'error': f"Missing required field: {field}"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Create line items for Stripe
            line_items = [{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f"Booking for Hotel ID: {data['tripId']}",
                        'description': f"Stay from {data['checkIn']} to {data['checkOut']} - {data['guests']} guests",
                    },
                    'unit_amount': int(float(data['totalPrice']) * 100),  # Convert to cents
                },
                'quantity': 1,
            }]
            
            # Create the Stripe checkout session
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url='http://localhost:5173/success',  # Updated to match frontend route
                cancel_url='http://localhost:5173/booking/cancel',
                customer_email=data.get('email'),  # Pre-fill customer email
                metadata={
                    'tripId': data['tripId'],
                    'checkIn': data['checkIn'],
                    'checkOut': data['checkOut'],
                    'guests': str(data['guests']),  # Convert to string for metadata
                    'name': data['name'],
                    'email': data['email'],
                    'phone': data.get('phone', ''),  # Optional field
                },
            )
            
            logger.info(f"Stripe session created successfully: {session.id}")
            return Response({'id': session.id}, status=status.HTTP_200_OK)
            
        except stripe.error.StripeError as e:
            # Handle Stripe-specific errors
            logger.error(f"Stripe error: {str(e)}")
            return Response(
                {'error': f"Stripe error: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # Handle all other exceptions
            logger.error(f"Error creating checkout session: {str(e)}", exc_info=True)
            return Response(
                {'error': f"Server error: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )