import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
    providedIn: 'root',
})
export class FormService {
    private countriesUrl = `${environment.apiUrl}/countries`;
    private statesUrl = `${environment.apiUrl}/states`;

    constructor(private httpClient: HttpClient) {}

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

    getCountries(): Observable<Country[]> {
        return this.httpClient
            .get<GetResponseCountries>(this.countriesUrl)
            .pipe(map((response) => response._embedded.countries));
    }

    getStates(countryCode: string): Observable<State[]> {
        const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

        return this.httpClient
            .get<GetResponseStates>(searchStatesUrl)
            .pipe(map((response) => response._embedded.states));
    }
}

interface GetResponseCountries {
    _embedded: {
        countries: Country[];
    };
}

interface GetResponseStates {
    _embedded: {
        states: State[];
    };
}
