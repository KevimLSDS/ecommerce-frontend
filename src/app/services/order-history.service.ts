import { OrderHistory } from './../common/order-history';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class OrderHistoryService {
    private orderUrl = `http://localhost:8080/api/orders`;

    constructor(private httpClient: HttpClient) {}

    getOrderHistory(userEmail: string): Observable<GetResponseOrderHistory> {
        const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${userEmail}`;

        return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
    }
}

interface GetResponseOrderHistory {
    _embedded: {
        orders: OrderHistory[];
    };
}
