export class Order {
    constructor(orderId, createTime, totalAmount, status, purchaseItems) {
        this.orderId = orderId;
        this.createTime = createTime;
        this.totalAmount = totalAmount;
        this.status = status;
        this.purchaseItems = purchaseItems;
    }
}