import { Routes } from "@angular/router"
import { AdminDashboardComponent } from "./layouts/admin-dashboard/admin-dashboard.component"
import { ProductAdminComponent } from "./pages/product-admin/product-admin.component"
import { ProductsAdminComponent } from "./pages/products-admin/products-admin.component"
import { IsAdminGuard } from "./guards/admin.guard"

export const adminRoutes:Routes = [
    {
        path:'',
        component:AdminDashboardComponent,
        canMatch:[IsAdminGuard],
        children: [
            {
                path:'products',
                component:ProductsAdminComponent
            },
            {
                path:'product/:id',
                component:ProductAdminComponent
            },
            {
                path:'**',
                redirectTo:'products'
            },
        ]
    }
]

export default adminRoutes