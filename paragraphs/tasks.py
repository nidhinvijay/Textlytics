import re
from collections import Counter
from celery import shared_task
from .models import Paragraph

# Basic stop words list, can be expanded or use a library like NLTK
STOP_WORDS = set(['the', 'a', 'an', 'in', 'is', 'it', 'of', 'for', 'on', 'with', 'to'])

@shared_task
def process_paragraph_word_frequency(paragraph_id):
    try:
        paragraph = Paragraph.objects.get(id=paragraph_id)
    except Paragraph.DoesNotExist:
        return f"Paragraph with id {paragraph_id} not found."

    # 1. Clean the text: lowercase, remove punctuation
    text = paragraph.content.lower()
    text = re.sub(r'[^\w\s]', '', text) # Remove punctuation

    # 2. Tokenize and remove stop words
    words = [word for word in text.split() if word not in STOP_WORDS]

    # 3. Calculate frequency
    frequency_map = Counter(words)

    # 4. Update the model and save
    paragraph.word_frequency = dict(frequency_map)
    paragraph.save(update_fields=['word_frequency'])

    return f"Successfully processed paragraph {paragraph_id}"