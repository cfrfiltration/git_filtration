from django.conf.urls import url, include
from . import views
urlpatterns = [
    url(r'^$', views.newtab, name='newtab'),
    url(r'^index/', views.index, name='index'),
    url(r'^dust loading/', views.dust, name='dust'),
    url(r'^pleating design/',views.pleating, name='pleating'),
    url(r'^newtab/$', views.newtab, name='newtab'),
    url(r'^newtab/action/',views.action, name='action'),
]
