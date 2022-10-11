export class Cart {
    constructor() {
        this.purchaseItems = [];
        this.totalAmount = 0
    }

    updateTotalAmount = function () {
        this.totalAmount = 0
        this.purchaseItems.forEach(item => {
            this.totalAmount += item.price * item.quantity
        })
    }
}