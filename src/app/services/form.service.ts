import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

  // Get "Month" for the Credit Card Expiration
  getCCMonth(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    // Build an array for "Month" dropdown list
    // Start at current month and loop until
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  // Get "Year" for the Credit Card Expiration
  getCCYears(): Observable<number[]> {
    let data: number[] = [];

    // Build an array for "Year" dropdown list
    // Start at current year and loop for next 20 years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 20;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}
