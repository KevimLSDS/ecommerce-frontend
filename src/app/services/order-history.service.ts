import { OrderHistory } from './../common/order-history';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OrderHistoryService {
    private orderUrl = `${environment.apiUrl}/orders`;

    constructor(private httpClient: HttpClient) {}

    getOrderHistory(userEmail: string): Observable<GetResponseOrderHistory> {
        const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${userEmail}`;

        return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
    }
}

interface GetResponseOrderHistory {
    _embedded: {
        orders: OrderHistory[];
    };
}
