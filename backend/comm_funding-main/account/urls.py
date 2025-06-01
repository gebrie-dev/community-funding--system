# accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/account/login/', views.LoginView.as_view(), name='login'),
    path('api/account/register/', views.RegisterUserView.as_view(), name='register'),
    path('api/account/profile/', views.CustomUserDetailView.as_view(), name='profile'),
    path('users/<int:user_id>/', views.UserByIdView.as_view(), name='user-by-id'),
    path('api/account/profile-detail/', views.ProfileDetailView.as_view(), name='profile_detail'),
    path('api/account/profile/update/', views.ProfileUpdateView.as_view(), name='profile_update'),
    path('api/account/password/reset/', views.PasswordResetRequestView.as_view(), name='password_reset'),
    path('api/account/password/reset/confirm/<str:uid>/<str:token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/account/user/update/', views.UserUpdateView.as_view(), name='user_update'),
    path('api/account/users/', views.UserListView.as_view(), name='user-list'),
]