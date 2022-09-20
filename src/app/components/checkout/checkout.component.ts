import { OrderItem } from './../../common/order-item';
import { Router } from '@angular/router';
import { CheckoutService } from './../../services/checkout.service';
import { CartService } from './../../services/cart.service';
import { FormService } from './../../services/form.service';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CustomValidator } from 'src/app/validators/custom-validator';
import { Order } from 'src/app/common/order';
import { Purchase } from 'src/app/common/purchase';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
    checkoutFormGroup!: FormGroup;

    totalPrice: number = 0;
    totalQuantity: number = 0;

    creditCardYears: number[] = [];
    creditCardMonths: number[] = [];

    countries: Country[] = [];
    shippingAddressStates: State[] = [];
    billingAddressStates: State[] = [];

    private EMAIL_REGEX = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

    storage: Storage = sessionStorage;

    constructor(
        private formBuilder: FormBuilder,
        private formService: FormService,
        private cartService: CartService,
        private checkoutService: CheckoutService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.reviewCartDetails();

        // Read user's email from browser storage
        const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

        // Build the forms
        this.checkoutFormGroup = this.formBuilder.group({
            customer: this.formBuilder.group({
                firstName: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidator.notOnlyWhitespace,
                ]),
                lastName: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidator.notOnlyWhitespace,
                ]),
                email: new FormControl(theEmail, [
                    Validators.required,
                    Validators.pattern(this.EMAIL_REGEX),
                ]),
            }),
            shippingAddress: this.formBuilder.group({
                street: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidator.notOnlyWhitespace,
                ]),
                city: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidator.notOnlyWhitespace,
                ]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidator.notOnlyWhitespace,
                ]),
            }),
            billingAddress: this.formBuilder.group({
                street: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidator.notOnlyWhitespace,
                ]),
                city: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidator.notOnlyWhitespace,
                ]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidator.notOnlyWhitespace,
                ]),
            }),
            creditCard: this.formBuilder.group({
                cardType: new FormControl('', [Validators.required]),
                nameOnCard: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidator.notOnlyWhitespace,
                ]),
                cardNumber: new FormControl('', [
                    Validators.required,
                    Validators.pattern('[0-9]{16}'),
                ]),
                securityCode: new FormControl('', [
                    Validators.required,
                    Validators.pattern('[0-9]{3}'),
                ]),
                expirationMonth: new FormControl('', [Validators.required]),
                expirationYear: new FormControl('', [Validators.required]),
            }),
        });

        // Get months for credit card expiration date
        const startMonth: number = new Date().getMonth() + 1;
        console.log(`startMonth: ${startMonth}`);

        this.formService.getCCMonth(startMonth).subscribe({
            next: (data: number[]) => (this.creditCardMonths = data),
            error: (e: string) => console.log(e),
        });

        // Get years for credit card expiration date
        this.formService.getCCYears().subscribe({
            next: (data: number[]) => (this.creditCardYears = data),
            error: (e: string) => console.log(e),
        });

        // Get countries from backend
        this.formService.getCountries().subscribe({
            next: (data: Country[]) => (this.countries = data),
            error: (e: string) => console.log(e),
        });
    }

    reviewCartDetails(): void {
        // Subscribe to totalQuantity on CartService
        this.cartService.totalQuantity.subscribe({
            next: (quantity: number) => (this.totalQuantity = quantity),
            error: (e: string) => console.log(e),
        });

        // Subscribe to totalPrice on CartService
        this.cartService.totalPrice.subscribe({
            next: (price: number) => (this.totalPrice = price),
            error: (e: string) => console.log(e),
        });
    }

    onSubmit(): void {
        console.log('Handling the submit button');

        if (this.checkoutFormGroup.invalid) {
            this.checkoutFormGroup.markAllAsTouched();
            return;
        }

        // Set up order
        let order = new Order();
        order.totalPrice = this.totalPrice;
        order.totalQuantity = this.totalQuantity;

        // Get cart items
        const cartItems = this.cartService.cartItems;

        // Create orderItems from carItems
        let orderItems: OrderItem[] = cartItems.map(
            (item) => new OrderItem(item)
        );

        // Set up purchase
        let purchase = new Purchase();

        // Populate purchase - customer
        purchase.customer = this.checkoutFormGroup.controls['customer'].value;

        // Populate purchase - shippingAddress
        purchase.shippingAddress =
            this.checkoutFormGroup.controls['shippingAddress'].value;
        const shippingState: State = JSON.parse(
            JSON.stringify(purchase.shippingAddress.state)
        );
        const shippingCountry: Country = JSON.parse(
            JSON.stringify(purchase.shippingAddress.country)
        );
        purchase.shippingAddress.state = shippingState.name;
        purchase.shippingAddress.country = shippingCountry.name;

        // Populate purchase - billingAddress
        purchase.billingAddress =
            this.checkoutFormGroup.controls['billingAddress'].value;
        const billingState: State = JSON.parse(
            JSON.stringify(purchase.billingAddress.state)
        );
        const billingCountry: Country = JSON.parse(
            JSON.stringify(purchase.billingAddress.country)
        );
        purchase.billingAddress.state = billingState.name;
        purchase.billingAddress.country = billingCountry.name;

        // Populate purchase - order and orderItems
        purchase.order = order;
        purchase.orderItems = orderItems;

        // Call REST API via the CheckoutService
        this.checkoutService.placeOrder(purchase).subscribe({
            next: (response) => {
                alert(
                    `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`
                );

                // Reset cart
                this.resetCart();
            },
            error: (err) => {
                alert(`There was an error: ${err.message}`);
            },
        });
    }

    resetCart(): void {
        // Reset cart data
        this.cartService.cartItems = [];
        this.cartService.totalPrice.next(0);
        this.cartService.totalQuantity.next(0);

        // Reset form data
        this.checkoutFormGroup.reset();

        // Navigate back to the products page
        this.router.navigateByUrl('/products');
    }

    copyShippingAddressToBillingAddress(event: any): void {
        if (event.target.checked) {
            this.checkoutFormGroup.controls['billingAddress'].setValue(
                this.checkoutFormGroup.controls['shippingAddress'].value
            );

            this.billingAddressStates = this.shippingAddressStates;
        } else {
            this.checkoutFormGroup.controls['billingAddress'].reset();

            this.billingAddressStates = [];
        }
    }

    handleMonthsAndYears(): void {
        const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

        const currentYear = new Date().getFullYear();
        const selectedYear = Number(creditCardFormGroup?.value.expirationYear);

        // If the current year equals the selected year, then start with the current month
        let startMonth: number;

        if (currentYear === selectedYear) {
            startMonth = new Date().getMonth() + 1;
        } else {
            startMonth = 1;
        }

        this.formService.getCCMonth(startMonth).subscribe({
            next: (data: number[]) => (this.creditCardMonths = data),
            error: (e: string) => console.log(e),
        });
    }

    getStates(formGroupName: string) {
        const formGroup = this.checkoutFormGroup.get(formGroupName);
        const countryCode = formGroup?.value.country.code;
        const countryName = formGroup?.value.country.name;

        console.log(`${formGroupName} country code: ${countryCode}`);
        console.log(`${formGroupName} country name: ${countryName}`);

        this.formService.getStates(countryCode).subscribe({
            next: (data: State[]) => {
                if (formGroupName === 'shippingAddress') {
                    this.shippingAddressStates = data;
                } else {
                    this.billingAddressStates = data;
                }

                // Select first item by default
                formGroup?.get('state')?.setValue(data[0]);
            },
            error: (e: string) => console.log(e),
        });
    }

    get firstName() {
        return this.checkoutFormGroup.get('customer.firstName');
    }

    get lastName() {
        return this.checkoutFormGroup.get('customer.lastName');
    }

    get email() {
        return this.checkoutFormGroup.get('customer.email');
    }

    get shippingStreet() {
        return this.checkoutFormGroup.get('shippingAddress.street');
    }

    get shippingCity() {
        return this.checkoutFormGroup.get('shippingAddress.city');
    }

    get shippingState() {
        return this.checkoutFormGroup.get('shippingAddress.state');
    }

    get shippingCountry() {
        return this.checkoutFormGroup.get('shippingAddress.country');
    }

    get shippingZipCode() {
        return this.checkoutFormGroup.get('shippingAddress.zipCode');
    }

    get billingStreet() {
        return this.checkoutFormGroup.get('billingAddress.street');
    }

    get billingCity() {
        return this.checkoutFormGroup.get('billingAddress.city');
    }

    get billingState() {
        return this.checkoutFormGroup.get('billingAddress.state');
    }

    get billingCountry() {
        return this.checkoutFormGroup.get('billingAddress.country');
    }

    get billingZipCode() {
        return this.checkoutFormGroup.get('billingAddress.zipCode');
    }

    get ccType() {
        return this.checkoutFormGroup.get('creditCard.cardType');
    }

    get ccName() {
        return this.checkoutFormGroup.get('creditCard.nameOnCard');
    }

    get ccNumber() {
        return this.checkoutFormGroup.get('creditCard.cardNumber');
    }

    get ccSecurityCode() {
        return this.checkoutFormGroup.get('creditCard.securityCode');
    }

    get ccExpMonth() {
        return this.checkoutFormGroup.get('creditCard.expirationMonth');
    }

    get ccExpYear() {
        return this.checkoutFormGroup.get('creditCard.expirationYear');
    }
}
