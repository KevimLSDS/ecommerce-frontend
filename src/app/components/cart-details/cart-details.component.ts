import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // Get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    // Subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe({
      next: (data: number) => (this.totalPrice = data),
      error: (e: string) => console.log(e),
    });

    // Subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe({
      next: (data: number) => (this.totalQuantity = data),
      error: (e: string) => console.log(e),
    });

    //Compute cart total price and quantity
    this.cartService.computeCartTotals();
  }
}
