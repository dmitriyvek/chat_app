from rest_framework import serializers
from rest_framework.authtoken.models import Token

from chat.models import Chat, Message, Profile


class TokenSerializer(serializers.ModelSerializer):
    '''Serializer of the rest-auth`s token model with additional user_id field'''

    class Meta:
        model = Token
        fields = ('key', 'user')


class ParticipantListSerializer(serializers.ModelSerializer):
    '''chat.Profile serializer for ChatDetailSerializer.participant_list'''

    class Meta:
        model = Profile
        exclude = ('user', 'friend_list')


class ProfileSerializerForLastMessage(serializers.ModelSerializer):
    '''chat.Profile serializer for LastMessageSerializer.author'''
    class Meta:
        model = Profile
        fields = ('username', 'avatar_url')


class MessageSerializer(serializers.ModelSerializer):
    '''chat.Message serializer for ChatDetailSerializer.message_list'''
    # author = serializers.CharField(source='author.username')

    class Meta:
        model = Message
        exclude = ('chat',)


class LastMessageSerializer(serializers.ModelSerializer):
    '''chat.Message serializer for ChatSerializer.last_message'''
    author = ProfileSerializerForLastMessage(many=False, read_only=True)

    class Meta:
        model = Message
        exclude = ('chat',)


class ChatSerializer(serializers.ModelSerializer):
    '''Serializer of the chat.Chat model with last_message field that returns custom represantation of the chat.Message model'''
    last_message = LastMessageSerializer(many=False, read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'participant_list', 'last_message')
        read_only = ('id',)


class InitialChatDetailSerializer(serializers.ModelSerializer):
    '''Serializer of the chat.Chat model that should be used on first chat opening'''
    companion_profile = serializers.SerializerMethodField(
        'get_companion_profile')
    messages = serializers.SerializerMethodField(
        'get_message_list_and_last_message_index')

    class Meta:
        model = Chat
        fields = ('companion_profile', 'messages')

    def get_companion_profile(self, obj):
        '''Returns profile of given user companion'''
        queryset = obj.participant_list.exclude(pk=self.context['user_id'])[0]
        return ParticipantListSerializer(instance=queryset, many=False).data

    def get_message_list_and_last_message_index(self, obj):
        '''Returns first messages chunk and last_message_index that could be None if ther are less then 20 messages in chat'''
        queryset = obj.message_list.all()[:20]
        last_message_index = None if len(
            queryset) < 20 else 20

        return {
            'last_message_index': last_message_index,
            'message_list': MessageSerializer(instance=queryset, many=True).data,
        }


class CommonChatDetailSerializer(serializers.ModelSerializer):
    '''Serializer of chat.Chat model that should be used to get regular messages chunk after initial chat opening'''
    messages = serializers.SerializerMethodField(
        'get_message_list_and_last_message_index')

    class Meta:
        model = Chat
        fields = ('messages',)

    def get_message_list_and_last_message_index(self, obj):
        '''Returns regular messages chunk and last_message_index that could be None (means that there is no more messages in this chat)'''
        last_message_index = self.context['last_message_index']
        queryset = obj.message_list.all(
        )[last_message_index:last_message_index+20]

        last_message_index = None if len(
            queryset) < 20 else last_message_index + 20

        return {
            'last_message_index': last_message_index,
            'message_list': MessageSerializer(instance=queryset, many=True).data,
        }


class MainProfileSerializer(serializers.ModelSerializer):
    '''Serializer of chat.Profile model that returns all client-important information about given user and all his open chats'''
    chat_list = ChatSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = ('avatar_url', 'profile_description', 'chat_list')
