import { Product } from "./DataClass/Product"
import { Cart } from "./DataClass/Cart"
import { Order } from "./DataClass/Order"
import { Category } from "./DataClass/Category"


var app = angular.module('Shop', []);

function idGenerator() {
    return Date.now().toString(16).toUpperCase()
}


app.controller('ShopController', function ($scope, $http) {
    $scope.testParam = "testing"
    $scope.totalAmount = 0
    $scope.selectedCategoryValue = function (categoryName) {
        if (categoryName != "All") {
            return categoryName
        } else {
            return ""
        }
    }
    $scope.init = function () {
        $scope.getCategories()
        $scope.getProducts()
    }

    $scope.getCategories = function () {
        var method = 'GET'
        var endPoint = "https://localhost:3000/getCategories"

        $http({
            method: method,
            url: endPoint,
        }).then(function successCallback(response) {
            // console.log(response.data)
            $scope.categories = [
                new Category(
                    "",
                    "",
                    "All"
                )
            ]
            $scope.categories.push.apply($scope.categories, response.data)

        }, function errorCallback(response) {
            console.log(response)
        });
    }

    $scope.getProducts = function () {
        var method = 'GET'
        var endPoint = "https://localhost:3000/getProducts"

        $http({
            method: method,
            url: endPoint,
        }).then(function successCallback(response) {
            // console.log(response.data)
            $scope.stock = response.data

        }, function errorCallback(response) {
            console.log(response)
        });
    }

    $scope.availableStock = function (productId) {
        var availableStock = 0
        $scope.stock.forEach(item => {
            if (item.productId == productId) {
                availableStock = item.quantity
            }
        })
        return availableStock
    }

    $scope.cart = new Cart()

    $scope.quantityFilter = function (location) {
        return location.quantity > 0;
    }

    $scope.placeOrder = function () {
        console.log(`Create Order:`)

        var order = new Order(
            idGenerator(),
            Date().toLocaleString(),
            $scope.cart.totalAmount,
            "processing",
            $scope.cart.purchaseItems,
        )
        console.log(`Order: ${angular.toJson(order)}`)

        var method = 'POST'
        var endPoint = "https://localhost:3000/createOrder"
        var data = angular.toJson(order)


        $http({
            method: method,
            url: endPoint,
            data: data
        }).then(function successCallback(response) {
            $scope.response = `${response.status} => Success: ${response.data}`
            $scope.clearCart()

        }, function errorCallback(response) {
            $scope.response = `${response.status} => \nCall API Fail`
        });
    }

    $scope.isValidAmount = function () {
        return $scope.cart.totalAmount > 0
    }

    $scope.addItemBtn = function (productId) {
        // console.log("addItemBtn clicked")
        // console.log(`productId: ${productId}`)
        var notInCart = true
        $scope.cart.purchaseItems.forEach(item => {
            if (item.productId == productId) {
                notInCart = false
                if (item.quantity < $scope.availableStock(productId)) {
                    item.quantity++
                    $scope.cart.updateTotalAmount()
                }
            }
        })

        if (notInCart) {
            $scope.stock.forEach(item => {
                if (item.productId == productId) {
                    if (item.quantity > 0) {
                        var newItem = {
                            productId: item.productId,
                            name: item.name,
                            price: item.price,
                            quantity: 1,
                        }
                        $scope.cart.purchaseItems.push(newItem)
                    }
                }

            })
            $scope.cart.updateTotalAmount()
        }
    }

    $scope.deleteItemBtn = function (productId) {
        // console.log("deleteItemBtn clicked")
        // console.log(`productId: ${productId}`)
        $scope.cart.purchaseItems.forEach(item => {
            if (item.productId == productId) {
                item.quantity--
                $scope.cart.updateTotalAmount()
            }
            if (item.quantity == 0) {
                var deleteItemIndex = 0
                $scope.cart.purchaseItems.forEach(deleteItem => {
                    if (deleteItem.productId == productId) {
                        deleteItemIndex = $scope.cart.purchaseItems.indexOf(deleteItem)
                    }
                })
                $scope.cart.purchaseItems.splice(deleteItemIndex, 1)
            }
        })
    }

    $scope.clearItemBtn = function (productId) {
        // console.log("clearItemBtn clicked")
        // console.log(`productId: ${productId}`)
        $scope.cart.purchaseItems.forEach(item => {
            if (item.productId == productId) {
                item.quantity = 0
                $scope.cart.updateTotalAmount()

                var deleteItemIndex = 0
                $scope.cart.purchaseItems.forEach(deleteItem => {
                    if (deleteItem.productId == productId) {
                        deleteItemIndex = $scope.cart.purchaseItems.indexOf(deleteItem)
                    }
                })
                $scope.cart.purchaseItems.splice(deleteItemIndex, 1)
            }
        })
    }

    $scope.clearCart = function () {
        $scope.cart = new Cart()
        $scope.cart.updateTotalAmount()
    }
});

