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
import { LoginService } from "../services/login";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'login',
  providers: [LoginService],
  styleUrls: ['../styles/login.css'],
  templateUrl: '../templates/login.html'
})

export class LoginComponent {
  constructor (
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() { }

  connectToChatRoom(name) {
    console.log('trying to login');
    const socket = this.loginService.connect('ws://localhost:4202/chat', name);
    const subscription = socket.subscribe(event => {
      const response = event.data;
      subscription.unsubscribe();
      socket.unsubscribe();
      if(response === 'Username taken') {
        alert(response);
      } else {
        this.router.navigateByUrl(`/chat/${response}`);
      }
    });
  }
}
