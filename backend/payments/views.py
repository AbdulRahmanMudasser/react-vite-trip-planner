import stripe
from django.conf import settings
from rest_framework import views, status
from rest_framework.response import Response

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Retrieve the Stripe secret key from environment variables
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')

stripe.api_key = STRIPE_SECRET_KEY

class CreateCheckoutSessionView(views.APIView):
    def post(self, request):
        try:
            data = request.data
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': f"Booking for Hotel {data['hotelId']}",
                            'description': f"From {data['checkIn']} to {data['checkOut']}, {data['guests']} guests",
                        },
                        'unit_amount': int(data['totalPrice'] * 100),  # Convert to cents
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url='http://localhost:3000/success',
                cancel_url='http://localhost:3000/cancel',
                metadata={
                    'hotelId': data['hotelId'],
                    'checkIn': data['checkIn'],
                    'checkOut': data['checkOut'],
                    'guests': data['guests'],
                    'name': data['name'],
                    'email': data['email'],
                    'phone': data['phone'],
                },
            )
            return Response({'id': session.id}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)