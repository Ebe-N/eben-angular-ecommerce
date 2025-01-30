import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'] // Fixed typo
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = []; 

  countries: Country[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService
  ) {}

  ngOnInit(): void {
    // Initialize the form group
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    // populate countries

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrireved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  copyShippingAddressToBillingAddress(event: Event) {
    // Cast event.target to HTMLInputElement to access 'checked'
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      // Copy shipping address to billing address
      this.checkoutFormGroup.get('billingAddress')?.setValue(
        this.checkoutFormGroup.get('shippingAddress')?.value
      );
    } else {
      // Reset billing address
      this.checkoutFormGroup.get('billingAddress')?.reset();
    }
  }

  onSubmit(): void {
    // Log the form values when the form is submitted
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log('The email address is ' + this.checkoutFormGroup.get('customer')?.value.email);
  }

  handleMonthsAndYears() {
  
    // This retrieves the credit card section of the form (checkoutFormGroup), which contains fields like expirationYear and expirationMonth.
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    // Retrieves the current year (e.g., 2025).
    const currentYear: number = new Date().getFullYear();

    // Gets the year the user selected for their card's expiration date and converts it to a number.
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) { 
      // if the current year equals the selected year, then start with the current month
      startMonth = new Date().getMonth() + 1;
    } else {
      // Otherwise, if the selected year is in the future: All months (January to December) are valid, so startMonth is set to 1
      startMonth = 1;
    }

    // It calls a service (luv2ShopFormService) to fetch valid months, starting from startMonth
    // The service method (getCreditCardMonths) likely returns an observable (asynchronous data stream) of month values.
    // 
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        // The method subscribes to the observable, retrieves the data (data), and logs it to the console.
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        // Finally, it assigns the data to a local property (creditCardMonths), likely bound to a dropdown in the form.
        this.creditCardMonths = data;
      }
    )
  }
}
