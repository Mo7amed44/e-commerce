import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Icategorise } from '../../shared/interface/icategorise';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-subcategories',
  imports: [DatePipe, RouterLink], // Importing DatePipe for date formatting and RouterLink for routing
  templateUrl: './subcategories.component.html',
  styleUrl: './subcategories.component.css'
})
export class SubcategoriesComponent implements OnInit {
  // Injecting ActivatedRoute to get the parameters from the URL
  private readonly activatedRoute = inject(ActivatedRoute);

  // Injecting CategoriesService to fetch category data
  private readonly categoriesService = inject(CategoriesService);

  // Declare categoryId to hold the category ID from the route parameters
  categoryId!: any;

  // Initialize categorydetails with an empty object
  categorydetails: Icategorise = {} as Icategorise;

  /**
   * ngOnInit lifecycle hook is called once the component is initialized
   * Calls the getSubCategory() method to fetch subcategory data
   */
  ngOnInit(): void {
    this.getSubCategory(); // Fetch the subcategory data when component is initialized
  }

  /**
   * Fetches the subcategory details from the CategoriesService based on the categoryId
   * The categoryId is obtained from the route parameters
   */
  getSubCategory() {
    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        // Get the category ID from the route parameters
        this.categoryId = res.get('id');

        // Call the service to get the details for the specific category
        this.categoriesService.getSpecificCategories(this.categoryId).subscribe({
          next: (res) => {
            console.log(res); // Logs the response for debugging
            this.categorydetails = res.data; // Assign the response data to categorydetails
          },
          error: (err) => {
            console.log(err); // Logs any error occurred during the API call
          }
        });
      },
      error: (err) => {
        console.log(err); // Logs any error occurred while fetching route parameters
      }
    });
  }
}
