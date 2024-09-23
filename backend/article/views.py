from rest_framework import viewsets, permissions
from .models import Category, Tag, Article, ArticleContent, Comment
from .serializers import CategorySerializer, TagSerializer, ArticleSerializer, ArticleContentSerializer, CommentSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.exceptions import NotFound


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        

class ArticleContentViewSet(viewsets.ModelViewSet):
    queryset = ArticleContent.objects.all()
    serializer_class = ArticleContentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ArticleManager:
    permission_classes = [IsAuthenticated]
    def get(self, article_id):
        try:
            article = Article.objects.get(id=article_id)
            serializer = ArticleSerializer(article)
            return Response(serializer.data)
        except Article.DoesNotExist:
            raise NotFound("Article not found.")

    def create(self, data, user):
        serializer = ArticleSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, article_id, data):
        try:
            article = Article.objects.get(id=article_id)
            serializer = ArticleSerializer(article, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Article.DoesNotExist:
            raise NotFound("Article not found.")

    def delete(self, article_id):
        try:
            article = Article.objects.get(id=article_id)
            article.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Article.DoesNotExist:
            raise NotFound("Article not found.")

class CommentManager:
    permission_classes = [IsAuthenticated]

    def get(self, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
            serializer = CommentSerializer(comment)
            return Response(serializer.data)
        except Comment.DoesNotExist:
            raise NotFound("Comment not found.")

    def create(self, data, user):
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, comment_id, data):
        try:
            comment = Comment.objects.get(id=comment_id)
            serializer = CommentSerializer(comment, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Comment.DoesNotExist:
            raise NotFound("Comment not found.")

    def delete(self, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            raise NotFound("Comment not found.")

class ArticleSearchManager:
    def search(self, tag=None, category=None, keyword=None):
        queryset = Article.objects.all()

        if tag:
            queryset = queryset.filter(tags__name=tag)

        if category:
            queryset = queryset.filter(category__name=category)

        if keyword:
            queryset = queryset.filter(
                Q(contents__title__icontains=keyword) |
                Q(contents__body__icontains=keyword)
            ).distinct()

        serializer = ArticleSerializer(queryset, many=True)
        return Response(serializer.data)