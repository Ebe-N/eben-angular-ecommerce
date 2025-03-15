import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // An array of cart item objects
  cartItems: CartItem[] = [];

  // Subject is a subclass of an observable. It can be used to publish events in our code. The event will then be sent to all subscribers
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

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

  // This is a method to decrease  the quantity of the cartItem which receives the property 'tempCartItem' and assigns it to a parameter the CartItem of the type CartItem.
  decrementQuantity(theCartItem: CartItem) {
    // So if the tempCartItem had a difinite quantity then decrease it by one. Here there is no need to use this because already the cartCartItem is a parameter that contains the property tempCartItem that we already have access to. So decrementing the parameter already decrements the property of that specific instance of a certain class.
    theCartItem.quantity--;

    // But if the quantity of the item is now zero after performing the decrement then perform the following procedures to totally remove the item from the cartItems array.
    if (theCartItem.quantity === 0) {
      // Since remove is a method in the current class instance that I am working in then this is important while calling this very method and passing this parameter theCartItem to it.
      this.remove(theCartItem);
    }
  }

  // This is a method that performs the total removing of a CartItem totally from the CartItem array and recomputing the cartTotals.
  remove(theCartItem: CartItem) {
    
    // get index of the item in the array by looping through the CartItem array
    // tempCartItem => tempCartItem.id === theCartItem.id: This is a callback function that checks if the id of the current item (tempCartItem) matches the id of the item that was passed in (theCartItem).
    // tempCartItem is just a temporary variable for each item in the array while findIndex() loops through this.cartItems.
    // theCartItem.id is the id property of the item that was passed into the remove() method, which you want to find in the array. 
    // itemIndex will store the index of the item in the array if it is found. If no item is found, findIndex() returns -1.
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id);

    // if (itemIndex > -1): This condition checks if the item was found. If the index is greater than -1, it means the item exists in the array, and you can proceed to remove it.
    // splice() is an array method used to remove elements from the array.
    // itemIndex is the index where the item to be removed is located. 1 means you want to remove just one element at the given index. If you wanted to remove more, you could specify a different number.
    
    if (itemIndex > -1) {
      // this line removes the item from the array at the index found in step 1.   
      this.cartItems.splice(itemIndex, 1);

      // And then the cartTotals are recomputed and the new data is republished that is the totalQuantity and the totalPrice.
      this.computeCartTotals();
    }
  }
}