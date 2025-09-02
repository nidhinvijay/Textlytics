from django.db import transaction
from django.db.models import F, IntegerField
from django.db.models.functions import Cast
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Paragraph
from .serializers import ParagraphCreateSerializer, ParagraphResultSerializer
from .tasks import process_paragraph_word_frequency

from django.shortcuts import render
def app_view(request):
    return render(request, 'index.html')
# This new view serves the public landing page (frontpage.html)
def frontpage_view(request):
    return render(request, 'frontpage.html')

class ParagraphSubmitView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ParagraphCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        text_block = serializer.validated_data['text_block']

        # Split text block into individual paragraphs
        raw_paragraphs = [p.strip() for p in text_block.split('\n') if p.strip()]

        if not raw_paragraphs:
            return Response({"error": "No text provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Use a transaction to ensure all or nothing
        with transaction.atomic():
            paragraph_instances = [Paragraph(user=request.user, content=p) for p in raw_paragraphs]
            created_paragraphs = Paragraph.objects.bulk_create(paragraph_instances)
            
            # Trigger a background task for each new paragraph
            for p in created_paragraphs:
                process_paragraph_word_frequency.delay(p.id)

        return Response(
            {"message": f"{len(created_paragraphs)} paragraphs submitted for processing."},
            status=status.HTTP_202_ACCEPTED
        )

class ParagraphSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ParagraphResultSerializer

    def get_queryset(self):
        user = self.request.user
        search_word = self.request.query_params.get('word', '').lower()

        if not search_word:
            return Paragraph.objects.none() # Return empty if no word is provided

        # THE EFFICIENT QUERY
        return Paragraph.objects.filter(
            user=user,
            word_frequency__has_key=search_word
        ).annotate(
            frequency=Cast(F(f'word_frequency__{search_word}'), output_field=IntegerField())
        ).order_by('-frequency')[:10]