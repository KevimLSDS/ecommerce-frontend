import { FormService } from './../../services/form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

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

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
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

  onSubmit(): void {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')?.value);

    console.log(
      'The shipping address country is ' +
        this.checkoutFormGroup.get('shippingAddress')?.value.country.name
    );
    console.log(
      'The shipping address state is ' +
        this.checkoutFormGroup.get('shippingAddress')?.value.state.name
    );
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

    // If the current year qeuals the selected year, then start with the current month
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
}
