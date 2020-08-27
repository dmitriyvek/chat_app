from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def chat(request, chat_id):
    '''Some test view'''
    return render(request, 'chat/room.html', {
        'chat_id': chat_id,
        'user_id': request.user.id,
        'user': request.user.username
    })
