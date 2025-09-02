from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.indexes import GinIndex # Requires PostgreSQL

class Paragraph(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='paragraphs')
    content = models.TextField()
    word_frequency = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Paragraph by {self.user.username} at {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        # This index is THE KEY to efficient searching!
        indexes = [
            models.Index(fields=['user']),
            GinIndex(fields=['word_frequency']),
        ]