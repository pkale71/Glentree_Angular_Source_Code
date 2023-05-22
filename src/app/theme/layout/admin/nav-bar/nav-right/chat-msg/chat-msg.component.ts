// angular import
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat-msg',
  templateUrl: './chat-msg.component.html',
  styleUrls: ['./chat-msg.component.scss']
})
export class ChatMsgComponent implements OnInit {
  // public props
  @Input() friendId;
  @Output() onChatToggle = new EventEmitter();
  @ViewChild('newChat', { read: ElementRef, static: false }) public newChat: ElementRef;
  friendsList: any;
  userChat: any;
  chatMessage: any;
  message: string;
  message_error: boolean;
  friendWriting: boolean;
  newReplay: any;

  // constructor
  constructor(private rend: Renderer2) {
    this.newReplay = '';
  }

  // life cycle event
  ngOnInit() {
    this.friendsList = [];
    this.userChat = [];
    this.chatMessage = findObjectByKeyValue(this.friendsList, 'id', this.friendId);
    if (this.chatMessage) {
      const message = findObjectByKeyValue(this.userChat, 'friend_id', this.friendId);
      if (message) {
        this.chatMessage['chat'] = message['messages'];
      }
    }
  }

  // public method
  sentMsg(flag) {
    if (this.message === '' || this.message === undefined) {
      this.message_error = true;
    } else {
      if (flag === 1) {
        this.message_error = false;
      } else {
        this.message_error = false;
        const temp_replay = this.message;
        let html_send;
        html_send =
          '<div class="media chat-messages">' +
          '<div class="media-body chat-menu-reply">' +
          '<div class="">' +
          '<p class="chat-cont">' +
          this.message +
          '</p>' +
          '</div>' +
          '<p class="chat-time">now</p>' +
          '</div>' +
          '</div>';

        this.newReplay = this.newReplay + html_send;
        this.message = '';

        setTimeout(() => {
          // this.componentRef.directiveRef.scrollToBottom();
        }, 100);
        this.friendWriting = true;
        setTimeout(() => {
          this.friendWriting = false;

          let html_replay;
          html_replay =
            '<div class="media chat-messages">' +
            '<a class="media-left photo-table" href="javascript:">' +
            '<img class="media-object img-radius img-radius m-t-5" src="' +
            this.chatMessage.photo +
            '" alt="' +
            this.chatMessage.name +
            '">' +
            '</a>' +
            '<div class="media-body chat-menu-content">' +
            '<div class="">' +
            '<p class="chat-cont">hello superior personality you write</p>' +
            '<p class="chat-cont">' +
            temp_replay +
            '</p>' +
            '</div>' +
            '<p class="chat-time">now</p>' +
            '</div>' +
            '</div>';
          this.newReplay = this.newReplay + html_replay;
          setTimeout(() => {
            // this.componentRef.directiveRef.scrollToBottom();
          }, 100);
        }, 3000);
      }
    }
  }
}

function findObjectByKeyValue(array, key, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return false;
}
