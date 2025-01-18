import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit{

  cartItems: CartItem[] = []; // This is the property cartItem for storing the cartItems from the cartService after the user selects some products from the product details or list
  totalPrice: number = 0; // The current value of the price item from the CartService array cartItem subscribed by this component
  totalQuantity: number = 0; // The current value of the quantity of the item from the CartService array cartItem subscribed by this component

  constructor(private cartService: CartService) {

  }

  ngOnInit(): void {
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

  incrementQuantity(theCartItem: CartItem) {
      this.cartService.addToCart(theCartItem);
    }

}


