from rest_framework import serializers
from .models import Paragraph

class ParagraphCreateSerializer(serializers.Serializer):
    text_block = serializers.CharField()

class ParagraphResultSerializer(serializers.ModelSerializer):
    # Add the annotated frequency field to the output
    frequency = serializers.IntegerField(read_only=True)

    class Meta:
        model = Paragraph
        fields = ('id', 'content', 'frequency', 'created_at')