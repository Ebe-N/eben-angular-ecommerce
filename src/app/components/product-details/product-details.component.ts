// Enhancing ProductDetailsComponent to retreive product from ProductService

import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  // this is a variable of type product. It also creates an instance of the product class which contains the important information about the products.
  // We initialize it instead of using "product: Product to avoid potential runtime errors incase the product is not initialized and its values are called or used"
  product: Product = new Product();

  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {

    // get the "id" param string. Convert string to a number using the "+" symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addToCart() {

    // This line prints a message to the console indicating that an item is being added to the cart.
    // this.product.name and this.product.unitPrice are properties of a Product object.
    // this.product refers to the product that’s currently being worked with in the addToCart function.
    // this.product.name gives the name of the product.
    // this.product.unitPrice gives the price of the product.
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);

    // Here, a new CartItem object is being created by passing the this.product (current product) to its constructor.

    // What is happening:

    // CartItem is another class (likely defined elsewhere in your code) that represents an item in the cart.
    // By passing this.product to the CartItem constructor, you are creating a cart item that will have the properties of the product, such as its name and price.
    const theCartItem = new CartItem(this.product);

    // this.cartService.addToCart(theCartItem): This line is calling a method on the cartService to add the CartItem (theCartItem) to the cart.

    // What is happening:

    // cartService is likely an injected service (probably via Angular’s dependency injection system) that manages the cart's state.
    // The addToCart method on the service is responsible for storing the CartItem in an array or other data structure that represents the cart.
    this.cartService.addToCart(theCartItem);

  }


}
