import { OktaAuth } from '@okta/okta-auth-js';
import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';

@Component({
    selector: 'app-login-status',
    templateUrl: './login-status.component.html',
    styleUrls: ['./login-status.component.css'],
})
export class LoginStatusComponent implements OnInit {
    isAuthenticated: boolean = true;
    userFullName: string = '';

    storage: Storage = sessionStorage;

    constructor(
        private oktaAuthService: OktaAuthStateService,
        @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
    ) {}

    ngOnInit(): void {
        // Subscribe to authentication state changes
        this.oktaAuthService.authState$.subscribe({
            next: (result) => {
                this.isAuthenticated = result.isAuthenticated!;
                this.getUserDetails();
            },
        });
    }

    getUserDetails() {
        if (this.isAuthenticated) {
            // Fetch the logged in user details (user's claims)
            // User Full Name is exposed as a property name
            this.oktaAuth.getUser().then((resp) => {
                this.userFullName = resp.name as string;

                // Retrieve the user's email from authentication response
                const email = resp.email;

                // Now store the email in the browser storage
                this.storage.setItem('userEmail', JSON.stringify(email));
            });
        }
    }

    logout() {
        // Terminates the session with Okta and removes current tokens
        this.oktaAuth.signOut();
    }
}
