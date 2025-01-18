import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // An array of cart item objects
  cartItems: CartItem[] = [];

  // Subject is a subclass of an observable. It can be used to publish events in our code. The event will then be sent to all subscribers
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  // This is a method used to add items to the cart or updating the quantity of the item if it already exists in cart. It ensures also the cart total price and qunatity is recalcutlated
  addToCart(theCartItem: CartItem) {
  // theCartItem is the item that is to be added to the cart. It is an object of CartItem.  

    // check if we already have the item in our cart using alreadyExists in cart. existingCartItem will store the reference of the item if it is found in cart.
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined; // This means the existingCartItem can hold either an object of type CartItem or undefined and it is initialized to undefined.
    
    // checks if the cart has any item. If there is no one we skip the search.
    if (this.cartItems.length > 0) {

    //  // find if the item is in the cart based on the item id by looping through each item and checking whether its id is equal to the id of the cartItems.
    
    //  for (let tempCartItem of this.cartItems) {
    //   // if the id matches then it means this item is already present in the cart and store the matching item into the variable existingCartItem. Use break to leave the loop earlier since we have already found the item.
    //   if (tempCartItem.id === theCartItem.id) {
    //     existingCartItem = tempCartItem;
    //     break;
    //   }
    
    // alternative

    // find returns the first element that passes else returns undefined
    // "tempCartItem.id === theCartItem.id" executes test for each element in the array until the test passes
    // "tempCartItem" is the current array element that is looped to see if it is already present
    existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id);

     

     // check if we found the item. If the existingCartItem is undefined then set the alreadyExistsInCart to true.
     alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      // performs the important checks to ensure that the existingCartItem is not empty to avoid any runtime errors incase it is undefined
      if (existingCartItem) {
        // increment the quantity of the item if the item already exists in the cart.
        existingCartItem.quantity++;
      }
    }
    else {
      // just add item to the array if it is not found existing in the cart.
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data. ".next(...) publishes/sends the event"
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('---');
  }
}
