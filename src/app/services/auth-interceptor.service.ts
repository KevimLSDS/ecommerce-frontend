import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return from(this.handleAccess(req, next));
    }

    private async handleAccess(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Promise<HttpEvent<any>> {
        const endpoint = `${environment.apiUrl}/orders`;

        // Only add an access token for secured endpoints
        const securedEnpoints = [endpoint];

        if (
            securedEnpoints.some((url) => request.urlWithParams.includes(url))
        ) {
            // Get access token
            const accessToken = await this.oktaAuth.getAccessToken();

            // Clone the request and add new header with acces token
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + accessToken,
                },
            });
        }

        return lastValueFrom(next.handle(request));
    }
}
