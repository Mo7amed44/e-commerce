import { Component, inject, OnInit, Pipe } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../shared/interface/iproduct';
import { CartService } from '../../core/services/cart/cart.service';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-details',
  imports: [TranslateModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly productsService = inject(ProductsService)
  private readonly cartService = inject(CartService)
  private readonly toastrService = inject(ToastrService)


  detailsProduct: IProduct | null = null

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        let idProduct = p.get('id')

        this.productsService.getSpecificProducts(idProduct).subscribe({
          next: (res) => {
            this.detailsProduct = res.data
            console.log(res.data);

          },
          error: (err) => {
            console.log(err);
          }
        })
      }


    })
    this.getCartData

  }

  getCartData(id: string): void {
    this.cartService.addToCartProduct(id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success(res.message);
        this.cartService.cartNumber.next(res.numOfCartItems)
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  changeMainImage(imageUrl: string) {
    if (this.detailsProduct) {
      this.detailsProduct.imageCover = imageUrl;
    }


  }
}
