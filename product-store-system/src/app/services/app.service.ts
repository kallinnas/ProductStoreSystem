import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  isMobileMode = signal<boolean>(false);

  constructor() { }
}
