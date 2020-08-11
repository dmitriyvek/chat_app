from rest_framework import serializers

from chat.models import Chat, Profile
from chat.services import get_profile_by_user_id


class ProfileSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class ChatSerializer(serializers.ModelSerializer):
    participant_list = ProfileSerializer(many=True)

    class Meta:
        model = Chat
        fields = ('id', 'participant_list')
        read_only = ('id',)

    # def create(self, validated_data):
    #     # print(validated_data)
    #     participant_list = validated_data.pop('participant_list')
    #     chat = Chat()
    #     chat.save()
    #     for username in participant_list:
    #         profile = get_profile_by_user_id(username)
    #         chat.participant_list.add(profile)
    #     chat.save()
    #     return chat
