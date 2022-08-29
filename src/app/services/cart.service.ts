import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  addToCart(cartItem: CartItem) {
    // Check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem!: CartItem;

    if (this.cartItems.length > 0) {
      // Find the item in the cart based on the id

      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id == cartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
    }

    // Check if we found it
    alreadyExistsInCart = existingCartItem != undefined;

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    // Compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals(): void {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    this.cartItems.forEach((item) => {
      totalPriceValue += item.quantity * item.unitPrice;
      totalQuantityValue += item.quantity;
    });

    // Publish the new values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // Log cart data just fot debug
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart:`);
    this.cartItems.forEach((item) => {
      const subTotalPrice = item.quantity * item.unitPrice;
      console.log(
        `name: ${item.name}, quantity: ${item.quantity}, unitPrice: ${item.unitPrice}, subtotal: ${subTotalPrice}`
      );
    });

    console.log(
      `totalPrice: ${totalPriceValue.toFixed(
        2
      )}, totalQuantity: ${totalQuantityValue}`
    );
    console.log('------');
  }
}
