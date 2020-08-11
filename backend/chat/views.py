from django.shortcuts import render


def chat(request, chat_id):
    return render(request, 'chat/room.html', {
        'chat_id': chat_id,
        'user': request.user.username
    })
