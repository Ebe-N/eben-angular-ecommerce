import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

// Routes are always listed from the specific to the most generic ones because when angular executes it scans for the routes from up top to the bottom and if it matches any generic route before the very specific one then the specific will not be displayed.
// eg if /category comes before /category/:id then if a URL with /category/:id is requested it will return the component reflected by /category 
const routes: Routes = [
{path: 'checkout', component:CheckoutComponent},  
{path: 'cart-details', component: CartDetailsComponent},
{path: 'products/:id', component: ProductDetailsComponent},
{path: 'search/:keyword', component: ProductListComponent},
{path: "category/:id", component: ProductListComponent},
{path: "category", component: ProductListComponent},
{path: "products", component: ProductListComponent},
{path: "", redirectTo: '/products', pathMatch: 'full'},
{path: "**", redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductDetailsComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
