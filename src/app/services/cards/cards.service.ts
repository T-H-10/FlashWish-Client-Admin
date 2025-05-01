import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Card } from '../../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private apiUrl: string;
  private cards: Card[] = [];

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + '/api/GreetingCards';
    this.getAllCards().subscribe();
  }
  getAllCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl);
  }

  getCardsByUserId(userID: number): Card[] {
    return this.cards.filter(card => card.userID === userID);
  }

  getCardsByCategoryId(categoryID: number): Card[] {
    return this.cards.filter(card => card.categoryID === categoryID);
  }

  getCardsByTemplateId(templateID: number): Card[] {
    return this.cards.filter(card => card.templateID === templateID);
  }

  getCardsByTextId(textID: number): Card[] {
    return this.cards.filter(card => card.textID === textID);
  }

  countCardsByUserId(userID: number): number {
    return this.getCardsByUserId(userID).length;
  }

  countCardsByCategoryId(categoryID: number): number {
    return this.getCardsByCategoryId(categoryID).length;
  }

  countCardsByTemplateId(templateID: number): number {
    return this.getCardsByTemplateId(templateID).length;
  }

  countCardsByTextId(textID: number): number {
    return this.getCardsByTextId(textID).length;
  }

}
