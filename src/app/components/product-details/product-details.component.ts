import { CartService } from './../../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    // Get the ID parameter
    const theProductId = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe({
      next: (data: Product) => (this.product = data),
      error: (e: string) => console.log(e),
    });
  }

  addToCart(): void {
    console.log(
      `Adding to cart: ${this.product.name}, ${this.product.unitPrice}`
    );

    const theCartItem = new CartItem(this.product);

    this.cartService.addToCart(theCartItem);
  }
}
