import { TranslateModule } from '@ngx-translate/core';
import { Brands } from '../../shared/interface/brands';
import { BrandsService } from './../../core/services/brands/brands.service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-brands',
  imports: [TranslateModule], // Importing TranslateModule for translations
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit {
  // Inject BrandsService to fetch brand data
  private readonly brandsService = inject(BrandsService);

  // Initialize brands variable with an empty object
  brands: Brands = {} as Brands;

  /**
   * Angular lifecycle hook for initialization
   * Calls the getData() method when the component is initialized
   */
  ngOnInit(): void {
    this.getData();
  }

  /**
   * Fetches all the brands from the BrandsService
   */
  getData(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (req) => {
        console.log(req);  // Logs the response
        this.brands = req; // Assigns the response to the brands property
      },
      error: (err) => {
        console.log(err); // Logs any error if occurred during the API call
      }
    });
  }
}
