from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Article(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    tags = models.ManyToManyField(Tag)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Article {self.id} by {self.author.username}"

class ArticleContent(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='contents')
    language = models.CharField(max_length=5)  # e.g., 'en', 'fr', 'ar'
    title = models.CharField(max_length=200)
    body = models.TextField()

    class Meta:
        unique_together = ('article', 'language')

    def __str__(self):
        return f"{self.title} ({self.language})"

class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on Article {self.article.id}"