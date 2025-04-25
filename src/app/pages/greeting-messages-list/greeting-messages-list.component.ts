import { Component, OnInit } from '@angular/core';
import { GreetingMessage, GreetingMessageService } from '../../services/greeting-message.service';

@Component({
  selector: 'app-greeting-messages-list',
  standalone: true,
  imports: [],
  templateUrl: './greeting-messages-list.component.html',
  styleUrl: './greeting-messages-list.component.scss'
})
export class GreetingMessagesListComponent implements OnInit{
  messages: GreetingMessage[]=[];
  loading = true;
  error='';

  constructor(private messagesService: GreetingMessageService){}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.messagesService.getMessages().subscribe(
      (data: GreetingMessage[]) => {
        this.messages = data;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error loading messages:', error);
        this.error = 'Failed to load messages';
        this.loading = false;
      }
    );
  }

  deleteMessage(messageID: number): void {
    if(confirm('האם אתה בטוחה שברצונך למחוק את ההודעה הזו?')){
      this.messagesService.deleteMessage(messageID).subscribe(() => {
        this.messages = this.messages.filter(message => message.textID !== messageID);
      }, (error: any) => {
        console.error('Error deleting message:', error);
        this.error = 'Failed to delete message';
      });
    }
  }
}
