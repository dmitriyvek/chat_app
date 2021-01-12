from django.db import transaction
from django.core.management.base import BaseCommand, CommandError

from chat.models import Chat, Message, Profile
from user.models import CustomUser


PASSWORD = 'zxcfghuio'


class Command(BaseCommand):
    help = 'Initialized database with initial data'

    @transaction.atomic
    def handle(self, *args, **options):
        CustomUser.objects.create_user(
            username='admin', password=PASSWORD, is_superuser=True, is_staff=True)
        for i in range(1, 4):
            CustomUser.objects.create_user(
                username=f'test_user{i}', password=PASSWORD)
        admin = Profile.objects.get(id=1)
        admin.friend_list.add(2, 3)

        chat1 = Chat.objects.create(created_by=admin)
        service_start_chat_message = Message.objects.create(
            author=admin, chat=chat1, content=f'chat started by: {admin.username}', is_service=True)
        chat1.last_message = service_start_chat_message
        chat1.save()
        chat1.participant_list.add(1, 2)

        user3 = Profile.objects.get(id=3)
        chat2 = Chat.objects.create(created_by=user3)
        service_start_chat_message = Message.objects.create(
            author=user3, chat=chat2, content=f'chat started by: {user3.username}', is_service=True)
        chat2.last_message = service_start_chat_message
        chat2.save()
        chat2.participant_list.add(3, 1)

        user2 = Profile.objects.get(id=2)
        for i in range(50):
            message = Message.objects.create(
                author=admin if i % 2 == 0 else user2,
                chat=chat1,
                content=f'test message number: {i}'
            )
            chat1.last_message = message
            chat1.save()

            message = Message.objects.create(
                author=user3 if i % 2 == 0 else admin,
                chat=chat2,
                content=f'test message number: {i}'
            )
            chat2.last_message = message
            chat2.save()

        self.stdout.write(self.style.SUCCESS(
            'Successfully initialized db data'))
