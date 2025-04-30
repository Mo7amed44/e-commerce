import { Component, input, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/myTranslate/my-translate.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  readonly authService = inject(AuthService)
  private readonly cartService = inject(CartService)
  private readonly wishlistService = inject(WishlistService)
  private readonly translationService = inject(TranslationService)
  private readonly translateService = inject(TranslateService)
  isLogin = input<boolean>(true)
  isMenuOpen = false;
  countCart!: number
  countWishlist!: number
  isDropdownOpen = false;
  isOpen: boolean = false;

  ngOnInit(): void {
    this.cartNumber()
    this.wishlistNumber()
  }
  cartNumber() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (req) => {
        this.countCart = req.numOfCartItems
      }
    })

    this.cartService.cartNumber.subscribe({
      next: (data) => {
        this.countCart = data
      }
    })
  }

  wishlistNumber() {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (req) => {
        this.countWishlist = req.data.length
      }
    })

    this.wishlistService.wishlistNumber.subscribe({
      next: (data) => {
        this.countWishlist = data
      }
    })
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('#dropdownButton') && !target.closest('#dropdownMenu')) {
      this.isDropdownOpen = false;
    }
  }

  changeLang(lang: string) {
    this.translationService.changeLang(lang)
  }
  currentLang(lang: string): boolean {
    return this.translateService.currentLang === lang;
  }

  btnNavbar() {
    this.isOpen = true;
  }
  chooseLink() {
    this.isOpen = false;
  }
}




