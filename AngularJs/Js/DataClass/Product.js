export class Product {
    constructor(productId, createTime, name, price, quantity, description, categoryName, categoryId) {
        this.productId = productId;
        this.createTime = createTime;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.categoryName = categoryName;
        this.categoryId = categoryId
    }
}
