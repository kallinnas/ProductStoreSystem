import { Component } from '@angular/core';
import { GeneralModule } from '../../modules/general.module';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {
  products: any[] = [];
  newProductName = '';
  newProductPrice = 0;

  constructor(private productService: ProductService) {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: any) => this.products = data);
  }

  addProduct() {
    const newProduct = { name: this.newProductName, price: this.newProductPrice };
    this.productService.addProduct(newProduct).subscribe(() => this.loadProducts());
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
  }
}
