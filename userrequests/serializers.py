from rest_framework import serializers
from .models import UserRequests


def validate_file_extension(value):
    import os
    from django.core.exceptions import ValidationError
    ext = os.path.splitext(value.name)[1]  # [0] returns path+filename
    valid_extensions = ['.jpg', '.png', '.btp']
    if not ext.lower() in valid_extensions:
        raise ValidationError(u'Unsupported file extension.')


class UserRequestsSerializer(serializers.ModelSerializer):

    provider = serializers.SerializerMethodField()
    category_type = serializers.SerializerMethodField()
    service_type = serializers.SerializerMethodField()
    file = serializers.FileField(max_length=None, use_url=True, validators=[validate_file_extension], required=False)

    class Meta:
        model = UserRequests
        exclude = ['user']

    def get_provider(self, obj):
        return obj.get_provider_display()

    def get_category_type(self, obj):
        return obj.get_category_type_display()

    def get_service_type(self, obj):
        return obj.get_service_type_display()
