// angular import
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss']
})
export class ChatUserListComponent {
  // public props
  @Output() onChatCollapse = new EventEmitter();
  @Output() onChatToggle = new EventEmitter();
  friendsList: any;
  searchFriends: string;

  // constructor
  constructor() {
    //this.friendsList = FriendsList.friends;
  }

  // public method
  onChatOn(friend_id) {
    this.onChatToggle.emit(friend_id);
  }
}
