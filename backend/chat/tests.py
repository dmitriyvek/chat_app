from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Profile, Chat, Message
from .api.serializers import MainProfileSerializer, ParticipantListSerializer


User = get_user_model()
PASSWORD = 'zxcfghuio'


class ChatAPITest(APITestCase):
    """Test case for all chat API endpoints"""

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        User.objects.create_user(
            username='user1', password=PASSWORD)
        User.objects.create_user(
            username='user2', password=PASSWORD)
        User.objects.create_user(
            username='user3', password=PASSWORD)

        profile1, profile2 = Profile.objects.all().order_by('pk')[:2]

        chat = Chat.objects.create(created_by=profile1)
        chat.participant_list.add(profile1, profile2)
        service_start_chat_message = Message.objects.create(
            author=profile1, chat=chat, content=f'chat started by: {profile1.username}', is_service=True)
        chat.last_message = service_start_chat_message

        for i in range(28):
            message = Message.objects.create(
                author=profile1 if i % 2 == 0 else profile2,
                chat=chat,
                content=i
            )

        chat.last_message = Message.objects.create(
            author=profile1, chat=chat, content='This is last message')
        chat.save()

    def setUp(self):
        self.user1, self.user2, self.user3 = User.objects.all().order_by('pk')[
            :3]
        login_url = reverse('user:login')
        login_response = self.client.post(
            login_url, {'username': self.user1.username, 'password': PASSWORD}, format='json')

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            'refresh' in login_response.data and 'access' in login_response.data)

        self.user1_access_token = login_response.data['access']
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + self.user1_access_token)

        # get token for user2
        login_response = self.client.post(
            login_url, {'username': self.user2.username, 'password': PASSWORD}, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.user2_access_token = login_response.data['access']

        # get token for user3
        login_response = self.client.post(
            login_url, {'username': self.user3.username, 'password': PASSWORD}, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.user3_access_token = login_response.data['access']

    def test_chat_detail_api(self):
        profile1, profile2 = Profile.objects.all().order_by('pk')[:2]

        chat_detail_url = reverse('chat:chat_detail', kwargs={'pk': 1})
        get_initial_chat_response = self.client.get(chat_detail_url)
        self.assertEqual(get_initial_chat_response.status_code,
                         status.HTTP_200_OK)
        self.assertTrue(
            'companion_profile' in get_initial_chat_response.data and 'messages' in get_initial_chat_response.data)

        # check companion profile data
        companion_profile = get_initial_chat_response.data['companion_profile']
        self.assertTrue(all(key in companion_profile for key in (
            'id', 'username', 'avatar_url', 'profile_description')))
        self.assertEqual(set(companion_profile.values()), {
                         profile2.id, profile2.username, profile2.avatar_url, profile2.profile_description})

        # check initial message list
        self.assertTrue(all(key in get_initial_chat_response.data['messages'] for key in (
            'last_message_index', 'message_list')))
        self.assertEqual(
            get_initial_chat_response.data['messages']['last_message_index'], 20)
        initial_message_list = get_initial_chat_response.data['messages']['message_list']
        self.assertEqual(len(initial_message_list), 20)
        self.assertTrue(all(key in initial_message_list[0] for key in (
            'id', 'content', 'timestamp', 'is_service', 'author')))
        self.assertEqual(initial_message_list[0]['author'], profile1.id)

        # chack common message list
        get_common_chat_response = self.client.get(
            f'{chat_detail_url}?last_message_index=20')
        self.assertEqual(get_common_chat_response.status_code,
                         status.HTTP_200_OK)
        self.assertFalse('companion_profile' in get_common_chat_response.data)
        self.assertTrue('messages' in get_common_chat_response.data)

        self.assertEqual(
            get_common_chat_response.data['messages']['last_message_index'], None)
        common_message_list = get_common_chat_response.data['messages']['message_list']
        self.assertEqual(len(common_message_list), 10)
        first_message = common_message_list[-1]
        self.assertTrue(all(key in first_message for key in (
            'id', 'content', 'timestamp', 'is_service', 'author')))
        self.assertEqual({first_message['id'], first_message['content'], first_message['is_service'], first_message['author']}, {
                         1, 'chat started by: user1', True, profile1.pk})

        # get chat detail by user2
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + self.user2_access_token)
        get_initial_chat_response = self.client.get(chat_detail_url)
        self.assertEqual(get_initial_chat_response.status_code,
                         status.HTTP_200_OK)
        self.assertTrue(
            'companion_profile' in get_initial_chat_response.data and 'messages' in get_initial_chat_response.data)

        # check response data
        companion_profile = get_initial_chat_response.data['companion_profile']
        self.assertTrue(all(key in companion_profile for key in (
            'id', 'username', 'avatar_url', 'profile_description')))
        self.assertEqual(set(companion_profile.values()), {
                         profile1.id, profile1.username, profile1.avatar_url, profile1.profile_description})
        initial_message_list, initial_message_list_for_user1 = get_initial_chat_response.data[
            'messages']['message_list'], initial_message_list
        self.assertEqual(initial_message_list, initial_message_list_for_user1)

        # get chat detail by user3 (witch is not in participant list)
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + self.user3_access_token)
        get_initial_chat_response = self.client.get(chat_detail_url)
        self.assertEqual(get_initial_chat_response.status_code,
                         status.HTTP_404_NOT_FOUND)

        # get chat detail by unauthorized user
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + 'invalid_token')
        get_initial_chat_response = self.client.get(chat_detail_url)
        self.assertEqual(get_initial_chat_response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_profile_detail_api(self):
        profile1, profile2, profile3 = Profile.objects.all().order_by('pk')[:3]
        chat = Chat.objects.first()
        last_message = Message.objects.first()

        profile_detail_url = reverse(
            'chat:profile_detail', kwargs={'pk': profile1.pk})

        # request from profile1
        profile_detail_response = self.client.get(profile_detail_url)
        self.assertEqual(profile_detail_response.status_code,
                         status.HTTP_200_OK)
        self.assertTrue(all(key in profile_detail_response.data for key in (
            'avatar_url', 'profile_description', 'chat_list')))
        self.assertEqual(
            profile_detail_response.data['avatar_url'], profile1.avatar_url)
        self.assertEqual(
            profile_detail_response.data['profile_description'], profile1.profile_description)
        self.assertEqual(len(profile_detail_response.data['chat_list']), 1)

        response_chat = profile_detail_response.data['chat_list'][0]
        self.assertEqual(response_chat['id'], chat.id)
        self.assertEqual(set(response_chat['participant_list']), {
                         profile1.id, profile2.id})
        chat_last_message = response_chat['last_message']
        self.assertTrue(all(key in chat_last_message for key in (
            'author', 'content', 'is_service', 'timestamp')))
        self.assertEqual({chat_last_message['content'], chat_last_message['is_service']}, {
                         last_message.content, last_message.is_service})
        self.assertTrue(
            all(key in chat_last_message['author'] for key in ('avatar_url', 'username')))
        self.assertEqual({chat_last_message['author']['avatar_url'], chat_last_message['author']['username']}, {
                         last_message.author.avatar_url, last_message.author.username})

        # request from profile2
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + self.user2_access_token)
        profile_detail_url = reverse(
            'chat:profile_detail', kwargs={'pk': profile2.pk})
        profile_detail_response = self.client.get(profile_detail_url)
        self.assertEqual(profile_detail_response.status_code,
                         status.HTTP_200_OK)
        self.assertTrue(all(key in profile_detail_response.data for key in (
            'avatar_url', 'profile_description', 'chat_list')))
        self.assertEqual(
            profile_detail_response.data['avatar_url'], profile2.avatar_url)
        self.assertEqual(
            profile_detail_response.data['profile_description'], profile2.profile_description)
        self.assertEqual(len(profile_detail_response.data['chat_list']), 1)

        response_chat = profile_detail_response.data['chat_list'][0]
        self.assertEqual(response_chat['id'], chat.id)
        self.assertEqual(set(response_chat['participant_list']), {
                         profile1.id, profile2.id})
        chat_last_message = response_chat['last_message']
        self.assertTrue(all(key in chat_last_message for key in (
            'author', 'content', 'is_service', 'timestamp')))
        self.assertEqual({chat_last_message['content'], chat_last_message['is_service']}, {
                         last_message.content, last_message.is_service})
        self.assertTrue(
            all(key in chat_last_message['author'] for key in ('avatar_url', 'username')))
        self.assertEqual({chat_last_message['author']['avatar_url'], chat_last_message['author']['username']}, {
                         last_message.author.avatar_url, last_message.author.username})

        # request from profile3
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + self.user3_access_token)
        profile_detail_url = reverse(
            'chat:profile_detail', kwargs={'pk': profile3.pk})
        profile_detail_response = self.client.get(profile_detail_url)
        self.assertEqual(profile_detail_response.status_code,
                         status.HTTP_200_OK)
        self.assertTrue(all(key in profile_detail_response.data for key in (
            'avatar_url', 'profile_description', 'chat_list')))
        self.assertEqual(
            profile_detail_response.data['avatar_url'], profile3.avatar_url)
        self.assertEqual(
            profile_detail_response.data['profile_description'], profile3.profile_description)
        self.assertEqual(len(profile_detail_response.data['chat_list']), 0)

        # request from unauthorized user
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + 'invalid_token')
        profile_detail_url = reverse(
            'chat:profile_detail', kwargs={'pk': profile1.pk})
        profile_detail_response = self.client.get(profile_detail_url)
        self.assertEqual(profile_detail_response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_get_friend_list_api(self):
        '''Check get all friends API'''
        profile_list = Profile.objects.all().order_by('id')
        profile_list[0].friend_list.add(profile_list[1], profile_list[2])

        chat_list_url = reverse('chat:friend_list')
        get_friends_response = self.client.get(
            chat_list_url, data={'format': 'json'})
        self.assertEqual(get_friends_response.status_code, status.HTTP_200_OK)

        friend_list = Profile.objects.get(pk=self.user1.pk).friend_list.all()
        serialized_friends = ParticipantListSerializer(friend_list, many=True)
        self.assertEqual(get_friends_response.data, serialized_friends.data)

        profile_list[0].friend_list.remove(profile_list[1], profile_list[2])
        get_friends_response = self.client.get(chat_list_url)
        self.assertEqual(get_friends_response.status_code, status.HTTP_200_OK)
        self.assertEqual(get_friends_response.data, [])

        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + 'invalid_token')
        get_friends_response = self.client.get(chat_list_url)
        self.assertEqual(get_friends_response.status_code,
                         status.HTTP_401_UNAUTHORIZED)
