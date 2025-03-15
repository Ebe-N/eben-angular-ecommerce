import { CartItem } from "./cart-item";

export class OrderItem {
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    productId: string;

    // Build a constuctor which accepts a CartItem that constructs an order item based off of cart item data 
    // This code will be used later on in the checkout form when we are buliding up the purchase the we'll send over to the backend.
    constructor(cartItem: CartItem) {
        // We make assignments to this constructor which reads the appropiate fields from the cart item and assigning them to this order item.
        this.imageUrl = cartItem.imageUrl;
        this.quantity = cartItem.quantity;
        this.unitPrice = cartItem.unitPrice;
        this.productId = cartItem.id;
    }
}
