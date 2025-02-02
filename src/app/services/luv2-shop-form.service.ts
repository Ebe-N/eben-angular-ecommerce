import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  // These are Urls that contain the data from the backend
  private countriesUrl = 'http://localhost:8080/api/countries'
  private statesUrl = 'http://localhost:8080/api/states'

  constructor(private httpClient: HttpClient) {}

  // This method performs a getRequest to the backend URL's containing the needed data and returns the data in the interface format provided which is an _embedded object that contains only the array of countries neglecting all the other data this embedded object has.
  getCountries(): Observable<Country[]> {
    // This is the get request perfomed to the API endpoint that is the URL.
    // GetResponseCountries is the interface that defines how Anguar should expect the data from the API response should look like.
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      // The map transforms this whole API response which returns the _embedded object to a pure countries array before the subscriber gets this data. It ensures only the country array is extracted from the _embedded object.
      map(response => response._embedded.countries)
    )
  } 

  // This is the method to get states according to the parameter of the country's "let's assume id passed to it". It returns an observable of the states array of the type State[]. 
  getStates(theCountryCode: string): Observable<State[]> {

    // The URL is redefined to bring responses according to the country's code. This will be the API Url that will provide us data of this sense.
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    // Here the GetResponseStates gives typescript the type of data it should expect when the API response is returned.
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
    // This extracts the states from the API response and publishes it to the subscribers who are listening to it. It returns only an array of states.
      map(response => response._embedded.states)
    )
  } 

  // This method generates a list of credit card months starting from the provided startMonth and ending at December (12).
  getCreditCardMonths(startMonth: number):  Observable<number[]> {
  
    // Creates an empty array data to hold the month numbers.
    let data: number[] = [];

    // Build an array for the month dropdown list
    // The for loop starts at the startMonth (provided as an argument) and loops until 12 (which represents December).
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      // The current month (theMonth) is added to the data array on each iteration of the loop.
      data.push(theMonth);
    }
    // The of(data) part creates an Observable that immediately emits the data array. This is a simple way of returning the list of months as an Observable.
    // The of() function from RxJS is used to wrap the data array in an Observable so that the caller can subscribe to it.
    return of(data);
  }

  // This method generates a list of credit card years starting from the current year and going up to the next 10 years
  getCreditCardYears(): Observable<number[]> {
    
    // Creates an empty array data to hold the year numbers.
    let data: number[] = [];
 
    // build an array for "Year" downlist list
    // This line gets the current year using JavaScript’s Date object. The new Date().getFullYear() function returns the current year (e.g., 2025).
    const startYear: number = new Date().getFullYear();
    // The end year is set to the current year + 10. For example, if the current year is 2025, endYear will be 2035.
    const endYear: number = startYear + 10;

    // The for loop starts at the current year (startYear) and loops until endYear (10 years ahead).
    for(let theYear = startYear; theYear <= endYear; theYear++) {
      // Each year (theYear) is added to the data array during the loop.
      data.push(theYear);
    }
    // The of(data) part creates an Observable that immediately emits the data array. This is wrapped inside an Observable so that the caller can subscribe to it and receive the array of years.
    return of(data);
  }

}


// These are the definitions of how the API response should look like when returned from the backend to the frontend. If anything is missing or exceeding typescript is going to throw an error.
interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}

/*
Observable
An Observable is a special type of object in RxJS (Reactive Extensions for JavaScript), and it's a way of dealing with asynchronous data. Essentially, it's like a stream of data that you can listen to over time.

Imagine you're waiting for a response from a server (like getting a list of countries from your API). Since it takes time for the server to respond, you don’t want to wait around doing nothing in your app.
An Observable allows your app to subscribe to this "stream" of data, and then react to it when the data is ready.
<Country[]>
This part is the type of data the Observable will emit. Specifically:

Country[] means an array of Country objects.
So, Observable<Country[]> is an Observable that, when it resolves, will give you an array of Country objects.
*/

/*
The Role of the Country Class:
In your code, the Country class defines the structure and types of data for a single country object. This class is like a blueprint for how each individual country should look.

Example of a Country class (hypothetical):
typescript
Copy
Edit
export class Country {
  id: number;
  code: string;
  name: string;
  _links: any; // Could be more specific, depending on the structure of _links
}
How the Country Class Works with Observable<Country[]>:
In your getCountries() method, you're working with an Observable that will eventually emit an array of Country objects:

getCountries(): Observable<Country[]> {
  return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
    map(response => response._embedded.countries)
  );
}

response._embedded.countries is expected to be an array of country data coming from your API.
The Country[] in Observable<Country[]> tells TypeScript that the data returned from the Observable is an array of Country objects.

How Country Class and Observable<Country[]> Are Related:
The API response gives back raw data (typically in JSON format), and that data should match the structure defined by your Country class. So each object in the countries array should have properties like id, code, name, and _links (according to the Country class).

When TypeScript sees Observable<Country[]>, it knows that the array should follow the structure defined in the Country class. So, when the response data is mapped in the map() operator, TypeScript will automatically check that the data matches the Country class.

If the data coming from the API doesn't match the Country class (i.e., if it’s missing required properties or has extra ones), TypeScript will show an error. This helps you make sure that the data is structured correctly before using it in your app.

To Clarify:
The Country class is used to define the structure of each item inside the Country[] array.
The Observable<Country[]> indicates that your Observable will return an array of Country objects (i.e., each item in the array follows the structure defined by the Country class).
 
Summary:
Yes, the Country class is the blueprint for each country object in the Country[] array that will be emitted by the Observable.
Your Observable<Country[]> expects an array of objects, and each object should follow the structure defined in the Country class.
*/