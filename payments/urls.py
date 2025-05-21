from django.urls import path
from .views import CreateCheckoutSessionView, CreateRideCheckoutSessionView

urlpatterns = [
    path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('create-ride-checkout-session/', CreateRideCheckoutSessionView.as_view(), name='create-ride-checkout-session'),
]