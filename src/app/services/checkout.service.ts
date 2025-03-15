import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  // Setting up the purchase URL basically the URL to the spring boot backend REST endpoint.
  private purchaseUrl = 'http://localhost:8080/api/checkout/purchase';


  // Our class have to make use of the HttpClient that has to be injected into the constructor.
  constructor(private httpClient: HttpClient) { }

  // By declaring an observable amidst the method we are making it an observable with a certain return type in our case "any"
  placeOrder(purchase: Purchase): Observable<any>{
    // We are posting to the REST endpoint to which then this post request would be sent to the purchase URL where now we are also passing the purchase object.
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
