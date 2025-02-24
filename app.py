from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, join_room, leave_room, emit
import random
import string

app = Flask(__name__)
app.secret_key = 'GFVZDKJSVDHJ'
socketio = SocketIO(app)

rooms = {}

def generate_room_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create_room', methods=['POST'])
def create_room():
    room_code = generate_room_code()
    rooms[room_code] = []
    return redirect(url_for('room', room_code=room_code))

@app.route('/room/<room_code>', methods=['GET', 'POST'])
def room(room_code):
    if request.method == 'POST':
        username = request.form['username']
        if username:
            rooms[room_code].append(username)
    return render_template('room.html', room_code=room_code)

@socketio.on('join')
def on_join(data):
    room_code = data['room_code']
    username = data['username']
    join_room(room_code)
    emit('message', {'username': 'Server', 'message': f'{username} has entered the room.'}, room=room_code)

@socketio.on('leave')
def on_leave(data):
    room_code = data['room_code']
    username = data['username']
    leave_room(room_code)
    emit('message', {'username': 'Server', 'message': f'{username} has left the room.'}, room=room_code)

@socketio.on('send_message')
def handle_message(data):
    room_code = data['room_code']
    username = data['username']
    message = data['message']
    emit('message', {'username': username, 'message': message}, room=room_code)

if __name__ == '__main__':
    socketio.run(app, debug=True,port=1000)
