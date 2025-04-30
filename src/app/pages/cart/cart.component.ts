import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interface/i-cart';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, TranslateModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  standalone: true
})
export class CartComponent implements OnInit, OnDestroy {
  // Inject the cart service to handle cart data
  private readonly cartService = inject(CartService);

  // Variable to store the cart data
  cartProduct: ICart = {} as ICart;

  // Subscription management to handle unsubscriptions
  private subscriptions: Subscription = new Subscription();

  /**
   * On component initialization, get the cart data
   */
  ngOnInit(): void {
    this.getData();
    this.removeItem; // Ensure removeItem is used appropriately with an ID
  }

  /**
   * Fetch logged user's cart data
   */
  getData(): void {
    const sub = this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartProduct = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Remove a specific item from the cart after confirmation
   */
  removeItem(id: string) {
    const sub = this.cartService.removeSpecificCartItem(id).subscribe({
      next: (res) => {
        console.log(res);
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            this.cartProduct = res.data;
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            this.cartService.cartNumber.next(res.numOfCartItems);
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Update the quantity of a product in the cart
   */
  updateCartProduct(id: string, count: number): void {
    const sub = this.cartService.updateCartProductQuantity(id, count).subscribe({
      next: (res) => {
        console.log(res);
        this.cartProduct = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Clear all items from the cart after confirmation
   */
  clearAll(): void {
    const sub = this.cartService.clearUserCart().subscribe({
      next: (res) => {
        console.log(res);
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            this.cartProduct = {} as ICart;
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            this.cartService.cartNumber.next(0);
          } else {
            this.cartProduct = res.data;
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * On component destroy, unsubscribe from all subscriptions to avoid memory leaks
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log('Unsubscribed on destroy');
  }
}
