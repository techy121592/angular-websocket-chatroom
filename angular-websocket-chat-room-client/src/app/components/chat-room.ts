/**
 * Copyright (C) 2017  David Welch
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 **/

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatRoomService } from '../services/chat-room';

@Component({
  selector: 'chat-room',
  providers: [ChatRoomService],
  styleUrls: ['../styles/chat-room.css'],
  templateUrl: '../templates/chat-room.html'
})

export class ChatRoomComponent {
  messages: Message[];
  socket: any;

  constructor (
    private chatRoomService: ChatRoomService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.messages = [];
  }

  ngOnInit() { this.connectToChatRoom(); }

  messageReceived(event: any) {
    let dataObj = JSON.parse(event.data);
    this.messages.push(new Message(dataObj.author, dataObj.message));
  }

  sendMessage(message: string) {
    let messageObj = {
      chatRoomKey: this.route.snapshot.params['chatRoomKey'],
      message: message
    };
    this.socket.next(messageObj);

  }

  connectToChatRoom() {
    this.socket = this.chatRoomService.connect('ws://localhost:4202/chat', this.route.snapshot.params['chatRoomKey']);
    this.socket.subscribe(event => this.messageReceived(event));
  }
}

export class Message {
  constructor(public author: string, public message: string) { }
}
