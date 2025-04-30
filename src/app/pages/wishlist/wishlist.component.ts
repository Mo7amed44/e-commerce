import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { Iwishlist } from '../../shared/interface/i-wishlist';
import { WishlistService } from './../../core/services/wishlist/wishlist.service';
import { Component, inject, OnInit, OnDestroy, WritableSignal, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  imports: [TranslateModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit, OnDestroy {
  // Inject services to handle wishlist, cart, and toastr notifications
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  // WritableSignal to manage the wishlist data
  wishList: WritableSignal<Iwishlist[]> = signal([]);

  // Success message for adding/removing items
  successMessage: string = '';

  // To manage subscriptions
  private subscriptions: Subscription = new Subscription();

  /**
   * On component initialization, fetch wishlist data and handle actions
   */
  ngOnInit(): void {
    this.getData();
    this.addProductData; // Ensure this method is used with appropriate ID
  }

  /**
   * Add product to cart and remove it from the wishlist
   */
  addToCartAndRemove(productId: string) {
    this.addProductData(productId); // Add to cart
    this.removefromWhishlist(productId); // Remove from wishlist
  }

  /**
   * Fetch logged user wishlist data
   */
  getData(): void {
    const sub = this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (req) => {
        console.log(req);
        this.wishList.set(req.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Add product to cart
   */
  addProductData(id: string) {
    const sub = this.cartService.addToCartProduct(id).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('userId', res.data.cartOwner);
        this.toastrService.success(res.message);
        this.cartService.cartNumber.next(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Get full stars for product rating (used in UI)
   */
  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  /**
   * Get empty stars for product rating (used in UI)
   */
  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  /**
   * Add product to wishlist
   */
  addToWhishlist(id: string) {
    const sub = this.wishlistService.getProductToWishlist(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.message === "Product added successfully to your wishlist") {
          setTimeout(() => {
            this.successMessage = res.message;
          }, 500);
          this.successMessage = '';
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Remove product from wishlist
   */
  removefromWhishlist(id: string) {
    const sub = this.wishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        console.log(res);
        this.getData();
        this.wishlistService.wishlistNumber.next(res.data.length);
        if (res.message === "Product removed successfully from your wishlist") {
          setTimeout(() => {
            this.successMessage = res.message;
          }, 500);
          this.successMessage = '';
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  // Signal for tracking favorite products in localStorage
  favorites = signal<Record<number, boolean>>(
    JSON.parse(localStorage.getItem('favorites') || '{}')
  );

  /**
   * Toggle product favorite status (stored in localStorage)
   */
  toggleFavorite(productId: number) {
    this.favorites.update(current => {
      const newFavorites = {
        ...current,
        [productId]: !current[productId]
      };
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }

  /**
   * On component destroy, unsubscribe all subscriptions to prevent memory leaks
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log('Unsubscribed on destroy');
  }
}
