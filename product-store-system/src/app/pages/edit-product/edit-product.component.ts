import { Component } from '@angular/core';
import { GeneralModule } from '../../modules/general.module';
import { ProductService } from '../../services/product.service';
import { ProductDto } from '../../models/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {

  productForm!: FormGroup;
  products: any[] = [];
  newProductName = '';
  newProductDesc = '';
  newProductPrice = 0;

  constructor(
    private productService: ProductService, 
    public appService: AppService,
    private fb: FormBuilder
  ) {
    this.loadProducts();
    this.initialForm();
  }

  initialForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: any) => this.products = data);
  }

  addProduct() {
    const newProduct = new ProductDto(this.productForm.value.name, this.productForm.value.description, this.productForm.value.price);
    this.productService.addProduct(newProduct).subscribe(() => this.loadProducts());
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
  }
}
