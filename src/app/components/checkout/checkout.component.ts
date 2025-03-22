import { Component, OnInit, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'] // Fixed typo
})
export class CheckoutComponent implements OnInit {

  // The checkoutFormGroup property is a FormGroup instance that holds the form model.
  checkoutFormGroup: FormGroup;

  // The totalPrice and totalQuantity properties are used to display the cart total price and quantity in the checkout form.
  totalPrice: number = 0;
  totalQuantity: number = 0;

  // The creditCartYears and creditCardMonths properties handle the arrays of month and years that are retrieved from the Da
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkOutService: CheckoutService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    // Initialize the form group
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]), // added this validator to check if the user entered only white space
        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]), //
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAdress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate credit card months
    // Inititates the starting month. Since the months API offers months starting from zero(0) then it is usually regarded to add 1 so bring the respective order we know of months. 
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth); // console logging for debugging processes.

    // populate credit cardCardMonths
    // Here we are subscribing to the getCreditMonths method in the luv2Shop service which offers a stream of months to us that can be displayed to the user.
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate creditCardYears
    // Here we are subscribing to the getCredit card years method in the Luv2ShopFormService that provides us with a stream/array of years which can be displayed to the user. 
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    // The method getCountries in the instance luv2ShopFormService is called here and a subscription is added to listen to the data returned as an Observable which is an array of countries.
    this.luv2ShopFormService.getCountries().subscribe(
      // After the data is acquired it is assigned to the countries varible so now it holds an array of countries of the type Country[]
      data => {
        console.log("Retrireved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  // This method consists of access controls which are essntial: To read user input, To update values dynamically, To validate form fields, To send data to the backend
  reviewCartDetails() {
  
    // This enables us to get the latest value of the total price of all items added to the cart from the CartService.
  this.cartService.totalPrice.subscribe(
    totalPrice => this.totalPrice = totalPrice
  );

  //  This enables us to get the latest amount of added items to the cart array that is in the CartService.
  this.cartService.totalQuantity.subscribe(
    totalQuantity => this.totalQuantity = totalQuantity
  );

  }

  // These are the getter values that are used to get values from the form for the purpose of form validation
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAdressStreet() { return this.checkoutFormGroup.get('shippingAdress.street'); }
  get shippingAdressCity() { return this.checkoutFormGroup.get('shippingAdress.city'); }
  get shippingAdressState() { return this.checkoutFormGroup.get('shippingAdress.state'); }
  get shippingAdressZipCode() { return this.checkoutFormGroup.get('shippingAdress.ZipCode'); }
  get shippingAdressCountry() { return this.checkoutFormGroup.get('shippingAdress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.ZipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAddressToBillingAddress(event: Event) {
    // Cast event.target to HTMLInputElement to access 'checked'
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      // Copy shipping address to billing address
      this.checkoutFormGroup.get('billingAddress')?.setValue(
        this.checkoutFormGroup.get('shippingAddress')?.value
      );

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      // Reset billing address
      this.checkoutFormGroup.get('billingAddress')?.reset();

      // bug fix for states
      this.billingAddressStates = [];
    }
  }

  onSubmit(): void {
    // Log the form values when the form is submitted
    console.log('Handling the submit button');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();

      // We need also to do a return statement so that nothing is executed in this method and we are done processing.
      return;
    }

    // set up order
    // To set up and order we'll need to create a new instance
    let order  =  new Order();
    // update the values of the order total price and quantity based on the values of the price and qunatity we have in our checkout compoenent
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items from the cart service
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems by converting the cartItems into orderItems.

   /* // - long way: Create an empty array and then simply loop through to create new objects based on the other objects
    let orderItems: OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    // Then we go to the loop and say orders substracted by i equals new order items pass in the cart item using that constructor we created earlier
   */

    // - short way of doing the same thing
    // This one functions by looping over the array and return a new array by applying a function to each element in that array 
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));


    // set up purchase by creating its new instance 
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase by pulling information for the purchase shipping address - shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value; // This access the form data for us.
    // Make a fresh copy of the country and the state objects so that if anything occurs that tends to change their values before the post request is completed shall not alter their values 
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress['state']));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress['country']));
    // We then grab the name data from the country and state object and assign them to the purchase country and state fields
    purchase.shippingAddress['state'] = shippingState.name;
    purchase.shippingAddress['country'] = shippingCountry.name;

    // populate purchase by pulling information for the purchase shipping address - billingAddress
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value; // This access the form data for us.
    // We then grab the objects 
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress['state']));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress['country']));
    // We then grab the data in the objects accordingly
    purchase.billingAddress['state'] = billingState.name;
    purchase.billingAddress['country'] = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    // The placeOrder method is called from the checkoutService and the purchase object is passed to it
    this.checkOutService.placeOrder(purchase).subscribe(
      {
        // Write code for calling REST API and having the results come back and also setup error handling
        next: response => {
          alert(`Your order has been received .\nOrder tracking number: ${response.orderTrackingNumber}`)
        
          // reset cart
          this.resetCart();

        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );
  }

  resetCart() {
    // reset the cart data
    this.cartService.cartItems = [];
    // We make use of the subjects of the totalPrice and totalQuantity using .next(0) meaning send 0 to all subscribers out there so that they reset themselves like the status component and so on.
    this.cartService.totalPrice.next(0); 
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page by the router injected earlier in our constructor.
    this.router.navigateByUrl("/products");

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

  // A method to get the states due to the choice of the country. States that corresponds to the country code chosen in the form group
  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(

      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    )
  }
}

// Verify the validation rules for the form


/*
[Frontend]   User Input (Form)
     │
     ▼
[Frontend]   CheckoutComponent → Calls `onSubmit()`
[Frontend]   Checkout Form (User Input)
     │
     ▼
[Frontend]   CheckoutService → Calls `placeOrder()` via HTTP POST
     │
     ▼
[Backend]    CheckoutController → Calls `checkoutService.placeOrder()`
     │
     ▼
[Backend]    CheckoutServiceImpl → Processes Order and Saves Data
     │
     ▼
[Database]   Customer, Order, OrderItems, Address → Data Stored
     │
     ▼
[Backend]    Returns `PurchaseResponse` with Tracking Number
     │
     ▼
[Frontend]   Shows Alert, Resets Cart, Navigates to Products Page

*/
