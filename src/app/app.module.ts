import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import {
    OktaAuthGuard,
    OktaAuthModule,
    OktaCallbackComponent,
    OKTA_CONFIG,
} from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { MembersPageComponent } from './components/members-page/members-page.component';

const oktaConfig = myAppConfig.oidc;

const oktaAuth = new OktaAuth(oktaConfig);

function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
    // Use injector to access any service available within your app
    const router = injector.get(Router);

    // Redirect the user to your custom login page
    router.navigate(['/login']);
}

const routes: Routes = [
    {
        path: 'members',
        component: MembersPageComponent,
        canActivate: [OktaAuthGuard],
        data: { onAuthRequired: sendToLoginPage },
    },
    { path: 'login', component: LoginComponent },
    { path: 'login/callback', component: OktaCallbackComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'cart-details', component: CartDetailsComponent },
    { path: 'products/:id', component: ProductDetailsComponent },
    { path: 'search/:keyword', component: ProductListComponent },
    { path: 'category/:id/:name', component: ProductListComponent },
    { path: 'category', component: ProductListComponent },
    { path: 'products', component: ProductListComponent },
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: '**', redirectTo: '/products', pathMatch: 'full' },
];

@NgModule({
    declarations: [
        AppComponent,
        ProductListComponent,
        ProductCategoryMenuComponent,
        SearchComponent,
        ProductDetailsComponent,
        CartStatusComponent,
        CartDetailsComponent,
        CheckoutComponent,
        LoginComponent,
        LoginStatusComponent,
        MembersPageComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        NgbModule,
        ReactiveFormsModule,
        OktaAuthModule,
    ],
    providers: [
        ProductService,
        { provide: OKTA_CONFIG, useValue: { oktaAuth } },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
