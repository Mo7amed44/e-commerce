import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Icategorise } from '../../shared/interface/icategorise';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, TranslateModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  // Inject CategoriesService to fetch categories data
  private readonly categoriesService = inject(CategoriesService);

  // Categories array to hold categories data
  categories: Icategorise[] = [];

  // To manage subscriptions
  private subscriptions: Subscription = new Subscription();

  /**
   * Fetch specific category by ID
   */
  getSpecificCategory(id: string) {
    const sub = this.categoriesService.getSpecificCategories(id).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Fetch all categories data
   */
  getCategoriesData() {
    const sub = this.categoriesService.getCategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.categories = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * On component initialization, fetch categories and specific category data
   */
  ngOnInit(): void {
    this.getCategoriesData();
    this.getSpecificCategory('some-id'); // Add specific category ID here
  }

  /**
   * On component destroy, unsubscribe all subscriptions
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log('Unsubscribed on destroy');
  }
}
