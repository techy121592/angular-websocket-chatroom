import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, chatRoomRoutingProviders } from './chat-room.routing'
import { ChatRoomComponent } from './components/chat-room';
import { LoginComponent } from './components/login';
import { PageNotFoundComponent } from './components/page-not-found';
import { ChatRoomAppComponent } from "./components/chat-room-app";
import {ChatRoomService} from "./services/chat-room";

@NgModule({
  declarations: [
    ChatRoomAppComponent,
    ChatRoomComponent,
    LoginComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    routing
  ],
  providers: [
    chatRoomRoutingProviders
  ],
  bootstrap: [ ChatRoomAppComponent ]
})

export class ChatRoomModule { }
