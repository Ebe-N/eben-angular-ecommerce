import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  // Holds the list of the products fetched from the server
  products: Product[] = [];

  // 
  currentCategoryId: number = 1;

  searchMode: boolean = false;

  // This is a class constructor where the product service is injected. The product service is used to fetch data from the backend.
  // Activated route is useful for accessing route parameters of the current route id.
  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {

  }

  // Calls the listProduct method to fetch the product information when the component is created
  // Subscribes to root parameter changes. When a new product is selected (The route changes) it triggers listProduct() to fetch and display the relevant products.
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }


  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // now search for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )

  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. Convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    // Now get the products for the current category id 
    // This likely returns an observable that performs an HTTP request to a backend API and retrieves the product data (could be an array of Product objects).
    // Since the getProductList() returns an observable, we need to subscribe to it to obtain the actual data.
    // Subscribe provides the callback function which is called when the data is succesfully retrieved from the API.
    // The data is then assigned to the products array, whic makes it available for use in the template.
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;

      }
    );
  }

  // when the user wants to add product to the cart this method responds to the button click
  addToCart(theProduct: Product) {

    // this line logs a message of the name and the product price to the browser console for debugging purposes
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`)

    // This creates a new CartItem object, which represents a single item in the shopping cart.
    // The CartItem is a class or interface designed to structure the data for items added to cart.
    // The constructor of CartItem takes a Product object as an input and initializes its fields like id, name, unitPrice, and quantity.
    const theCartItem = new CartItem(theProduct);

    // this.cartService is an instance of the CartService class, which manages all the logic related to the shopping cart.
    // The addToCart(theCartItem) method in the CartService is responsible for: Adding the new cart item (theCartItem) to the cart, Checking if the item already exists in the cart (to update the quantity instead of duplicating), Recomputing the total price and quantity of the cart.
    this.cartService.addToCart(theCartItem);

  }
}


/*
HOW THIS OPERATES
1)A user navigates to a route like /products/2
2)The route change triggers the paramMap subscription
3)listProducts() retreives the id parameter (e.g 2) and fetches products for that category using the Products Service
4)The fetched products are assigned to this.products and displayed in the template.
*/