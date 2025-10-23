import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export type TicketType = 'SP' | 'SG' | 'SE';

export interface Ticket {
  id: number;
  code: string;
  type: TicketType;
  issued_at: string;
  status: 'queued' | 'called' | 'served' | 'discarded';
  called_at?: string | null;
  served_at?: string | null;
  counter?: number | null;
}

export interface CallRow {
  ticket_id: number;
  code: string;
  type: TicketType;
  counter: number;
  called_at: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBase || 'http://localhost:3333';

  constructor(private http: HttpClient) {}

  // Totem
  emitTicket(type: TicketType): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.base}/tickets/emit`, { type });
  }

  // Painel
  lastCalls(): Observable<CallRow[]> {
    return this.http.get<CallRow[]>(`${this.base}/panel/last`);
  }

  // Atendente
  callNext(counter: number): Observable<Ticket | null> {
    return this.http.post<Ticket | null>(`${this.base}/attendant/call`, { counter });
  }
  finish(ticketId: number): Observable<{ ok: true }> {
    return this.http.post<{ ok: true }>(`${this.base}/attendant/finish`, { ticketId });
  }

  // Relatórios
  daily(date: string) {
    return this.http.get<any>(`${this.base}/reports/daily`, { params: { date } });
  }
  monthly(year: string, month: string) {
    return this.http.get<any>(`${this.base}/reports/monthly`, { params: { year, month } });
  }
}
