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

import {Injectable} from "@angular/core";
import { Subject, Observable, Observer } from "rxjs";

@Injectable()
export class ChatRoomService {
  private socket: Subject<MessageEvent>;

  public connect(url, chatRoomKey): Subject<MessageEvent> {
    if(!this.socket) {
      this.socket = this.create(url, chatRoomKey);
    }

    return this.socket;
  }

  private create(url, chatRoomKey): Subject<MessageEvent> {
    let socket = new WebSocket(url);

    let observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        socket.onmessage = obs.next.bind(obs);
        socket.onerror = obs.error.bind(obs);
        socket.onclose = obs.complete.bind(obs);
        socket.onopen = () => {
          socket.send(`{"chatRoomKey": "${chatRoomKey}"}`);
        };

        return socket.close.bind(socket);
      });

    let observer = {
      next: (data: Object) => {
        if(socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }
}