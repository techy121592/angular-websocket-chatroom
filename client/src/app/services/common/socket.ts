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

import { Subject, Observable, Observer } from "rxjs";

export function createSocket(url, key, value): Subject<MessageEvent> {
  let socket = new WebSocket(url);

  let observable = Observable.create(
    (obs: Observer<MessageEvent>) => {
      socket.onmessage = obs.next.bind(obs);
      socket.onerror = obs.error.bind(obs);
      socket.onclose = obs.complete.bind(obs);
      socket.onopen = () => {
        socket.send(`{"${key}": "${value}"}`);
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
