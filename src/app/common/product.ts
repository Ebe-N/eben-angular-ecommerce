export class Product {
  constructor(
    public id: string = '',
    public sku: string = '',
    public name: string = '',
    public description: string = '',
    public unitPrice: number = 0,
    public imageUrl: string = '',
    public active: boolean = false,
    public unitsInStock: number = 0,
    public dateCreated: Date = new Date(),
    public lastUpdated: Date = new Date()
  ) {}
}
