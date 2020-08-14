from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def chat(request, chat_id):
    return render(request, 'chat/room.html', {
        'chat_id': chat_id,
        'user': request.user.username
    })
