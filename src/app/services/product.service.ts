// Service interacts with the backend to fetch data and make it available for use in the components.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { map, Observable } from 'rxjs';
import { ProductCategory } from '../common/product-category';

// This decorator tells the angular app that this service is injectable into any component, and it will be available app-wide
@Injectable({
  providedIn: 'root'
})

// The product service makes an HTTP request to fetch data from the backend and transforms the response data, and provides a method getProductList that other compoenents can call to retreive this data.
export class ProductService {

  // This is the link for the backend which points the endpoint that provides the list of products.
  private baseUrl = 'http://localhost:8080/api/products'; // "?size=indicates the size of products the webpage can display"

  private categoryUrl = 'http://localhost:8080/api/product-category';
  // This constructor injects the HttpClient service which is an angular service that is used to send HTTP requests to the backend. 
  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> { 
  
    // need to build a URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    
    return this.httpClient.get<Product>(productUrl);
  }

  // The getProductList() fetches the data from the backend. It dynamically builds a URL based on the category id and sends a get request to the backend.
  // It transforms the responses into a list of products using Rjxs (Map)
  // a method that returns an observable of the products array.
  // Maps the JSON data from Spring Data REST to Product array.
  // An Observable is a stream of data that can be subscribed to. It allows the Angular component (that calls this service) to receive the list of products asynchronously.
  getProductList(theCategoryId: number): Observable<Product[]> {

    // Build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    // This sends an HTTP GET request to the backend API (at http://localhost:8080/api/products), asking for the list of products.
    // The response from the backend is expected to follow a certain structure, defined by the GetResponse interface.
    // Pipe: This is an RxJS operator that allows you to chain multiple operations on the data stream (in this case, the HTTP response).

    return this.getProducts(searchUrl);
  }

  
  searchProducts(theKeyword: string): Observable<Product[]> {

        // Build URL based on the keyword
        const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

        // This sends an HTTP GET request to the backend API (at http://localhost:8080/api/products), asking for the list of products.
        // The response from the backend is expected to follow a certain structure, defined by the GetResponse interface.
        // Pipe: This is an RxJS operator that allows you to chain multiple operations on the data stream (in this case, the HTTP response).
        return this.getProducts(searchUrl);

  }

  // map(response => response._embedded.products): The backend response is expected to have an _embedded object that contains a products array. This line extracts just the products array from the response and returns it to the subscriber.
      // This map operation helps transform the data into the format that your app expects (a plain list of products).
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {

    // categoryUrl calls the REST API 
    // Then an observable is returned and the JSON data from the Spring Data REST is mapped to ProductCategory array.
    // An RxJS operator used to chain additional operators to process the data stream.
    // Transforms the raw HTTP response. The backend response contains a nested structure with _embedded.productCategory. This map operation extracts just the productCategory array and returns it.
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

}

// The GetResponse interface is a TypeScript structure that defines the shape of the API response.
// Unwraps the JSON from the Spring Data REST _embedded entry
// The GetResponse interface ensures that the response object has an _embedded property, which itself contains a products array. This array is what you want to work with in your app.
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

// Unwraps the JSON from the Spring Data REST _embedded entry.
// The _embedded property is an object containing the productCategory array.
// productCategory[] is an array of ProductCategory objects.
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}








/*
QUESTIONS AND ANSWERS
1)How is the product list displayed on your screen?
The Spring Boot backend will expose a RESTful API that returns a list of products. The Angular frontend
will make request to the RESTful API and receive the list of products as JSON data. The Angular frontend
will then use the JSON data to render the product list in the UI.
*/