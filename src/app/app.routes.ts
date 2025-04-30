import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layout/blank-layout/blank-layout.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: 'full' },
    {
        path: '', component: AuthLayoutComponent, children: [
            {
                path: "login",
                loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
                title: "Login"
            },
            {
                path: "register",
                loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
                title: "Register"
            },
            {
                path: "forgot-password",
                loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
                title: "forgot-password"
            },
        ]
    },
    {
        path: "", component: BlankLayoutComponent, canActivate: [authGuard], children: [
            {
                path: "home",
                loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
                title: "Home"
            },
            {
                path: "cart",
                loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
                title: "Cart"
            },
            {
                path: "brands",
                loadComponent: () => import('./pages/brands/brands.component').then(m => m.BrandsComponent),
                title: "Brands"
            },
            {
                path: "categories",
                loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent),
                title: "Categories"
            },
            {
                path: "products",
                loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
                title: "Products"
            },
            {
                path: "checkout/:id",
                loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
                title: "Checkout"
            },
            {
                path: "details/:id",
                loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent),
                title: "details"
            },
            {
                path: "subcategories/:id",
                loadComponent: () => import('./pages/subcategories/subcategories.component').then(m => m.SubcategoriesComponent),
                title: "subcategories"

            },
            {
                path: "wishlist",
                loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
                title: "wishlist"
            },
            { path: "allorders", loadComponent: () => import('./pages/allorder/allorder.component').then(m => m.AllorderComponent), title: "Your Orders" },

            { path: "", component: NotfoundComponent }
        ]
    }
];
