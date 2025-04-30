import { Subscription } from 'rxjs';
import { IProduct } from '../../shared/interface/iproduct';
import { ProductsService } from '../../core/services/products/products.service';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { Iwishlist } from '../../shared/interface/i-wishlist';

@Component({
  selector: 'app-products',
  imports: [RouterLink, FormsModule, SearchPipe, TranslateModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {

  // Inject services
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);

  // To manage all subscriptions and unsubscribe on destroy
  private subscriptions: Subscription = new Subscription();

  // Search text for filtering products
  text: string = '';

  // Signal to hold the wishlist data (Iwishlist[])
  wishList: WritableSignal<Iwishlist[]> = signal([]);

  // Array to store fetched products
  products: IProduct[] = [];

  // Holds success messages for UI notifications
  successMessage: string = '';

  // Array to store wishlist products
  wishlist: IProduct[] = [];

  // Signal to track favorite products (by productId)
  favorites = signal<Record<number, boolean>>(
    JSON.parse(localStorage.getItem('favorites') || '{}')
  );

  /**
   * Lifecycle hook: runs on component init
   * Calls product and wishlist data fetch
   */
  ngOnInit(): void {
    this.getProductsDAta();
    this.getData();
  }

  /**
   * Lifecycle hook: runs when component is destroyed
   * Unsubscribes from all active subscriptions
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log('Unsubscribed on destroy');
  }

  /**
   * Fetch products data from the backend
   */
  getProductsDAta(): void {
    const sub = this.productsService.getProduct().subscribe({
      next: (res) => {
        console.log(res.data);
        this.products = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Returns an array to represent full stars based on rating
   */
  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  /**
   * Returns an array to represent empty stars based on rating
   */
  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  /**
   * Adds a product to cart by ID
   */
  addProductData(id: string): void {
    const sub = this.cartService.addToCartProduct(id).subscribe({
      next: (res) => {
        console.log(res, "nnn");
        localStorage.setItem('userId', res.data.cartOwner);
        this.toastrService.success(res.message);
        this.cartService.cartNumber.next(res.numOfCartItems);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Toggles a product in the wishlist (remove if exists)
   */
  toggleWishlist(product: IProduct): void {
    const productInWishlist = this.isProductInWishlist(product._id);

    if (productInWishlist) {
      const sub = this.wishlistService.removeProductFromWishlist(product._id).subscribe({
        next: (res) => {
          console.log(res);
          this.toastrService.success('Product removed from wishlist');
          this.wishlist = this.wishlist.filter(p => p._id !== product._id);
        },
        error: (err) => this.toastrService.error('Error removing product from wishlist')
      });
      this.subscriptions.add(sub);
    }
  }

  /**
   * Fetch logged-in user's wishlist data
   */
  getData(): void {
    const sub = this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (req) => {
        console.log(req);
        this.wishList.set(req.data);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Adds a product to the wishlist by ID
   */
  addTowhishlist(id: string): void {
    const sub = this.wishlistService.getProductToWishlist(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.message == "Product added successfully to your wishlist") {
          setTimeout(() => {
            this.successMessage = res.message;
          }, 500);
          this.successMessage = '';
          this.toastrService.success(res.message);
          this.wishlistService.wishlistNumber.next(res.data.length);
        }
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Removes a product from wishlist by ID
   */
  removefromwhishlist(id: string): void {
    const sub = this.wishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        console.log(res);
        this.getData();
        this.wishlistService.wishlistNumber.next(res.data.length);
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Toggles product favorite status (saves in localStorage)
   */
  toggleFavorite(productId: number): void {
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
   * Checks if a product is in the wishlist
   */
  isProductInWishlist(productId: string): boolean {
    return this.wishlist.some(product => product._id === productId);
  }

}
