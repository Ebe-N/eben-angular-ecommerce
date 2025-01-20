import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})

// Angualar is a framework that takes care of creating and managing the instances of my classes.
// So a component is a class and whenever Angular wants to display that component to the browser, it creates an instance of it.
// Therefore "this" keyword is usually used to refer to a specific instance of that specific class. So this keyword is used to call methods or access properties of a specific class instance. Which is to say without this there would be no clarification to what instance of the class is the method referred to or what propereties are tried to be accessed.
export class CartDetailsComponent implements OnInit{

  cartItems: CartItem[] = []; // This is the property cartItem for storing the cartItems from the cartService after the user selects some products from the product details or list
  totalPrice: number = 0; // The current value of the price item from the CartService array cartItem subscribed by this component
  totalQuantity: number = 0; // The current value of the quantity of the item from the CartService array cartItem subscribed by this component

  // When we are injecting a service to the constructor is like we are initializing an object or creating an instance of the class that is the main service that we have defined somewhere in our code.
  // So here we have initialised an object cartService that is an instance of the class CartService.
  constructor(private cartService: CartService) {

  }

  // When this component is initialiased this method is called and executed to provide the important information
  ngOnInit(): void {
    // So here "this" keyword referes to the method of the class instance of the class CartDetails which is our component, which is created by angular when it seeks to display this component to the web browser.
    this.listCartDetails();
  }

// This is the method that subscribes to the events events totalPrice and totalQuantity which updates the UI with their current values
  listCartDetails() {
  
    // This statement references or points to the cartItems array that is in the cartService. Therefore the array cartItems in this compoenent refers to the same elements that are in the array cartItems that is in the cartService.
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // compute the cart total price and quantity
    this.cartService.computeCartTotals();
  }

  // This method takes in the parameter theCartItem which is the tempCartItem that is to be added to the cart and updates the totalQuantity and the totaPrice of the item which is sent back and subcribed by the HTML code and displayed at the frontend.
  incrementQuantity(theCartItem: CartItem) {
      // Here we are referring to the cartService object that belongs to this this specific class instance. The cartService here is an instance of the CartService that allows me to call methods from it.
      // So here I am telling the cartService to perform some action i.e addToCart when I pass in the parameter 'theCartItem'.
      this.cartService.addToCart(theCartItem);
    }

  // This method takes in the parameter which is the tempCartItem that is to be removed from the cartItem and update the totalPrice and the totalQuantity values of it.  
    decrementQuantity(theCartItem: CartItem) {
      // By using this I am referring to the object cartService which is a specific instance of the CartService class and tell it to perform the operation of decrementing a the item totalPrice and totalQuantity when the parameter theCartItem that is the tempCartItem is passed to it.
      this.cartService.decrementQuantity(theCartItem);
    }

  // This method is for removing the cartItem
    remove(theCartItem: CartItem) {
      this.cartService.remove(theCartItem);
    }  

}


