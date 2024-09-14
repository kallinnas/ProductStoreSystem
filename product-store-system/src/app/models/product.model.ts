export interface Product {
    id: number;
    name: string;
    desc: string;
    price: number;
}

export class ProductDto {
    constructor(
        public name: string,
        public desc: string,
        public price: number,
    ) { }

}