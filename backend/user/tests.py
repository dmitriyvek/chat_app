from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import UntypedToken, TokenError

from chat.models import Profile


User = get_user_model()
PASSWORD = 'zxcfghuio'


class AuthFunctionalityTest(TestCase):
    """Test case for all functionality in user app: create user and profile; signup, login, refresh_token api"""

    def check_if_token_is_valid(self, token: str) -> bool:
        try:
            UntypedToken(token)
        except TokenError:
            return False
        return True

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        User.objects.create_superuser(
            username='user1', password=PASSWORD)
        User.objects.create_user(
            username='user2', password=PASSWORD)

    def setUp(self):
        self.client = Client()

    def test_internal_user_creation_methods(self):
        '''Check if User.objects.create_user() creates associated profile'''
        user_list = User.objects.all().order_by('pk')[:2]
        self.assertTrue(len(user_list) == 2)
        user1, user2 = user_list

        profile_list = Profile.objects.all().order_by('pk')[:2]
        self.assertTrue(len(profile_list) == 2)
        profile1, profile2 = profile_list

        self.assertEqual(user1.pk, profile1.pk)
        self.assertEqual(user1.username, profile1.username)
        self.assertEqual(user1.user_profile.all()[0], profile1)
        self.assertTrue(user1.is_superuser)

        self.assertEqual(user2.pk, profile2.pk)
        self.assertEqual(user2.username, profile2.username)
        self.assertEqual(user2.user_profile.all()[0], profile2)
        self.assertFalse(user2.is_superuser)

    def test_signup_api(self):
        '''Check if signup API creates associated profile and returns valid tokens'''
        signup_response = self.client.post(
            reverse('user:signup'), {'username': 'user3', 'password': PASSWORD})
        self.assertEqual(signup_response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('token' in signup_response.data)
        self.assertEqual(signup_response.data['success'], 'True')

        self.assertTrue(len(User.objects.all()) == 3)
        self.assertTrue(len(Profile.objects.all()) == 3)

        user3 = User.objects.last()
        profile3 = Profile.objects.last()

        self.assertEqual(user3.pk, profile3.pk)
        self.assertEqual(user3.username, profile3.username)
        self.assertEqual(user3.user_profile.all()[0], profile3)
        self.assertFalse(user3.is_superuser)

        self.assertTrue(self.check_if_token_is_valid(
            signup_response.data['token']['access']))
        self.assertTrue(self.check_if_token_is_valid(
            signup_response.data['token']['refresh']))

        self.assertFalse(self.check_if_token_is_valid('invalid_token'))

    def test_login_and_refresh_api(self):
        '''Check if login and refresh-token are working correctly (return valid tokens)'''
        user = User.objects.first()

        login_url = reverse('user:login')
        login_response = self.client.post(
            login_url, {'username': user.username, 'password': PASSWORD}, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            'refresh' in login_response.data and 'access' in login_response.data)

        token_list = login_response.data
        self.assertTrue(self.check_if_token_is_valid(token_list['access']))
        self.assertTrue(self.check_if_token_is_valid(token_list['refresh']))

        refresh_url = reverse('user:token_refresh')
        refresh_response = self.client.post(
            refresh_url, {'refresh': token_list['refresh']})
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in refresh_response.data)
        self.assertTrue(self.check_if_token_is_valid(
            refresh_response.data['access']))

        # login with nonexistent user
        login_response = self.client.post(
            login_url, {'username': 'nonexistent_user', 'password': 'nonexistent_password'}, format='json')
        self.assertEqual(login_response.status_code,
                         status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(
            login_response.data['detail'], 'No active account found with the given credentials')

        # get new access token with invalid refresh token
        refresh_response = self.client.post(
            refresh_url, {'refresh': 'invalid_token'})
        self.assertEqual(refresh_response.status_code,
                         status.HTTP_401_UNAUTHORIZED)
        self.assertTrue('detail' in refresh_response.data)
        self.assertEqual(
            refresh_response.data['detail'], 'Token is invalid or expired')
