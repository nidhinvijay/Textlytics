# textlytics/urls.py
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
# Import all our page views
from paragraphs.views import app_view, frontpage_view
from users.views import login_page_view, register_page_view

urlpatterns = [
    # Page URLs
    path('', frontpage_view, name='frontpage'),      # The new landing page at the root
    path('app/', app_view, name='app'),              # The main dashboard app
    path('login/', login_page_view, name='login-page'),
    path('register/', register_page_view, name='register-page'),

    # API URLs
    path('api/users/', include('users.urls')),
    path('api/paragraphs/', include('paragraphs.urls')),

    # Admin and Docs
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]