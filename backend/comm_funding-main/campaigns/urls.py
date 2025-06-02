from django.urls import path
from . import views

urlpatterns = [
    
    path('api/campaigns/create/', views.CampaignCreateAPI.as_view(), name='create_campaign'),
    path('api/campaigns/', views.CampaignListAPI.as_view(), name='campaign_list'),
    path('api/campaigns/<int:pk>/', views.SelfCampaignListAPI.as_view(), name='campaign_list_me'),

    path('api/campaigns/<int:pk>/', views.CampaignDetailAPI.as_view(), name='campaign_detail'),
    path('api/campaigns/review/', views.AdminCampaignReviewAPI.as_view(), name='campaign_review'),
    path('api/campaigns/review/<int:campaign_id>/', views.AdminCampaignReviewAPI.as_view(), name='campaign_review_update'),
    path('api/campaigns/update/<int:pk>/', views.CampaignUpdateAPI.as_view(), name='campaign_update'),
    path('api/donate/', views.DonateAPI.as_view(), name='donate'),
    path('api/campaigns/chapa/callback/', views.ChapaCallbackAPI.as_view(), name='chapa_callback'),
    path('api/campaigns/paypal/callback/', views.PayPalCallbackAPI.as_view(), name='chapa_callback'),
    path('api/withdraw/', views.WithdrawAPI.as_view(), name='withdraw'),
    path('api/Allcampaigns/', views.AdminCampaignReviewAPI.as_view(), name='withdraw'),
    path('api/Allcampaigns/<int:campaign_id>', views.AdminCampaignReviewAPI.as_view() ),
    path('admin/campaigns/<int:campaign_id>/', views.AdminCampaignReviewAPI.as_view(), name='admin-campaign-review'),
    path('api/campaigns/review/<int:campaign_id>/', views.AdminCampaignReviewAPI.as_view(), name='campaign_review_update'),
]