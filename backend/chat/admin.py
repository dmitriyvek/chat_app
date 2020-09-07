from django.contrib import admin

from .models import Profile, Chat, Message


class MessageAdmin(admin.ModelAdmin):
    fields = ['author', 'chat', 'content']
    search_fields = ['chat__id']

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('chat', 'author')


class MessageInLine(admin.TabularInline):
    model = Message
    extra = 0

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('chat', 'author')


class ChatAdmin(admin.ModelAdmin):
    fields = ['participant_list', 'last_message']
    raw_id_fields = ['last_message']


admin.site.register(Chat, ChatAdmin)
admin.site.register(Profile)
admin.site.register(Message, MessageAdmin)
