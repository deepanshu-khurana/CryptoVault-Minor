# File: backend/views.py (or your main project views.py)

from django.shortcuts import render

# This view renders the main index.html template for the frontend
def index(request):
    # 'index.html' is found because of the TEMPLATES DIRS setting in settings.py
    return render(request, 'index.html')