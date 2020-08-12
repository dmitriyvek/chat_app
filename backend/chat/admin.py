from django.contrib import admin

from .models import Profile, Chat, Message


class MessageAdmin(admin.ModelAdmin):
    fields = ['author', 'chat', 'content']


class MessageInLine(admin.TabularInline):
    model = Message
    extra = 0


class ChatAdmin(admin.ModelAdmin):
    inlines = [MessageInLine]
    search_fields = ['title']


admin.site.register(Chat, ChatAdmin)
admin.site.register(Profile)
admin.site.register(Message, MessageAdmin)
