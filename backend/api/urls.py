from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('predict/', views.predict_rating, name='predict_rating'),
    path('codeforces/ratingHistory/', views.get_rating_history, name='get_rating_history'),
    path('codeforces/userInfo/', views.get_user_info, name='get_user_info'),
]
