import { Component, inject, OnInit, OnDestroy, signal, WritableSignal } from '@angular/core';
import { ProductsService } from './../../core/services/products/products.service';
import { IProduct } from '../../shared/interface/iproduct';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Icategorise } from '../../shared/interface/icategorise';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { routes } from '../../app.routes';
import { Iwishlist } from '../../shared/interface/i-wishlist';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CarouselModule, RouterLink, SearchPipe, FormsModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  // Inject services
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);

  // To manage all subscriptions
  private subscriptions: Subscription = new Subscription();

  // Signal to hold wishlist data
  wishList: WritableSignal<Iwishlist[]> = signal([]);

  // Products array
  products: IProduct[] = [];

  // Categories array
  categories: Icategorise[] = [];

  // Success message for UI
  successMessage: string = '';

  // Wishlist products array
  wishlist: IProduct[] = [];

  // Search text
  text: string = "";

  // Demo product (optional)
  demoProduct = this.products[0]; // أو أي منتج عندك

  // Signal to track favorites
  favorites = signal<Record<number, boolean>>(
    JSON.parse(localStorage.getItem('favorites') || '{}')
  );

  /**
   * On component init: fetch products and categories
   */
  ngOnInit(): void {
    this.getCategoriesData();
    this.getProductsData();
  }

  /**
   * On component destroy: unsubscribe all subscriptions
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log('Unsubscribed on destroy');
  }

  /**
   * Fetch categories data
   */
  getCategoriesData() {
    const sub = this.categoriesService.getCategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.categories = res.data;
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Fetch products data
   */
  getProductsData(): void {
    const sub = this.productsService.getProduct().subscribe({
      next: (res) => {
        console.log(res.data);
        this.products = res.data;
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Get specific category by ID
   */
  getSpecificCategory(id: string) {
    const sub = this.categoriesService.getSpecificCategories(id).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
    this.subscriptions.add(sub);
  }

  /**
   * Add product to cart by ID
   */
  addProductData(id: string) {
    const sub = this.cartService.addToCartProduct(id).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('userId', res.data.cartOwner);
        this.toastrService.success(res.message);
        this.cartService.cartNumber.next(res.numOfCartItems);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Navigate to all categories page
   */
  navigateToAllCategories() {
    this.router.navigate(['/categories']);
  }

  /**
   * Toggle product in wishlist (remove if exists)
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
   * Add product to wishlist by ID
   */
  addTowhishlist(id: string) {
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
      },
    });
    this.subscriptions.add(sub);
  }

  /**
   * Fetch logged user's wishlist
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
   * Remove product from wishlist by ID
   */
  removefromWhishlist(id: string) {
    const sub = this.wishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        console.log(res);
        this.getData();
        this.wishlistService.wishlistNumber.next(res.data.length);
        if (res.message == "Product added successfully to your wishlist") {
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
   * Toggle favorite status for product (save in localStorage)
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
   * Check if product is in wishlist
   */
  isProductInWishlist(productId: string): boolean {
    return this.wishlist.some(product => product._id === productId);
  }

  /**
   * Get array of full stars based on rating
   */
  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  /**
   * Get array of empty stars based on rating
   */
  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  /**
   * Main slider settings
   */
  customMainSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    rtl: true,
    pullDrag: false,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplaySpeed: 1500,
    autoplayHoverPause: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false
  }

  /**
   * Product carousel slider settings
   */
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    rtl: true,
    pullDrag: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplaySpeed: 1500,
    autoplayHoverPause: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 6
      }
    },
    nav: false
  }

}
