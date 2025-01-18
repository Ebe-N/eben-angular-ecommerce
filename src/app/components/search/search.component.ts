import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  constructor(private router: Router) {

  }

doSearch(value: string) {

  // Route the data to our "search" route. It will be handled by the ProductListComponent. To reuse the logic and view for listing products.
  console.log(`value=${value}`);
  this.router.navigateByUrl(`/search/${value}`);
  
}

}
