import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { GeneralModule } from '../../modules/general.module';

@Component({
  selector: 'app-display-product',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './display-product.component.html',
  styleUrl: './display-product.component.scss'
})
export class DisplayProductComponent {

  products: any[] = [];
  filteredProducts: any[] = [];
  filter = '';

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
      this.filteredProducts = data;
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(p => {
      const lowerCaseFilter = this.filter.toLowerCase();
      return (
        p.name.toLowerCase().includes(lowerCaseFilter) ||
        p.desc.toLowerCase().includes(lowerCaseFilter) ||
        p.price.toString().includes(lowerCaseFilter)
      );
    });
  }

}
