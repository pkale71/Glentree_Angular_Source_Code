// angular import
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent {
  // public props
  @Input() friends;
  @Output() onChatOn = new EventEmitter();

  // public method
  public innerChatToggle(id) {
    this.onChatOn.emit();
  }
}
