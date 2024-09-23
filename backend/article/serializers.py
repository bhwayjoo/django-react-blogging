from rest_framework import serializers
from .models import Category, Tag, Article, ArticleContent, Comment

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'created_at']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class ArticleContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleContent
        fields = ['id', 'language', 'title', 'body']

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at']

class ArticleSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    category = CategorySerializer()
    tags = TagSerializer(many=True)
    contents = ArticleContentSerializer(many=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'author', 'category', 'tags', 'created_at', 'updated_at', 'contents', 'comments']