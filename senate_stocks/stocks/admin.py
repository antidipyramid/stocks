from django.contrib import admin
from .models import Senator, Trade, Asset
# Register your models here.

admin.site.register(Senator)
admin.site.register(Trade)
admin.site.register(Asset)
