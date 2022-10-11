import { Product } from "./DataClass/Product"
import { Category } from "./DataClass/Category"
import { Order } from "./DataClass/Order"

var app = angular.module('AdminPortal', []);
var productFormResetBtn = document.getElementById('productFormResetBtn')
var categoryFormResetBtn = document.getElementById('categoryFormResetBtn')
var productCntrl = document.getElementById('EditProductController')
var categoryCntrl = document.getElementById('EditCategoryController')
var orderCntrl = document.getElementById('OrdersController')

function resetFormClick(btn, times, $scope) {
    for (var i = 0; i < times; i++) {
        btn.click()
    }

    $scope.response = undefined
    $scope.categoryName = undefined
    $scope.categoryId = undefined
    $scope.productName = undefined
    $scope.productId = undefined
    $scope.price = undefined
    $scope.quantity = undefined
    $scope.description = undefined
}

function idGenerator() {
    return Date.now().toString(16).toUpperCase()
}

app.controller('AdminPortalController', function ($scope, $http) {
    $scope.test = 6
    $scope.isEditProduct = true
    $scope.selectEditTarget = function (target) {
        var EditProductController = angular.element(productCntrl)
        var EditCategoryController = angular.element(categoryCntrl)

        resetFormClick(productFormResetBtn, 1, EditProductController.scope())
        resetFormClick(categoryFormResetBtn, 1, EditCategoryController.scope())

        EditProductController.scope().response = ""
        EditCategoryController.scope().response = ""

        $scope.isEditProduct = (target == "Product")

        if ($scope.isEditProduct) {
            EditProductController.scope().getCategories()
        }
    }

    $scope.testFn = function () {
        var EditProductController = angular.element(productCntrl)
        var scope = EditProductController.scope()

        console.log(scope.products)
    }

})

app.controller('EditCategoryController', function ($scope, $http) {
    $scope.test = "Hello World in EditCategoryController"

    $scope.init = function () {
        $scope.getCategories()
    }

    $scope.getCategories = function () {
        var method = 'GET'
        var endPoint = "https://localhost:3000/getCategories"

        $http({
            method: method,
            url: endPoint,
        }).then(function successCallback(response) {
            // console.log(response.data)
            $scope.categories = response.data
            $scope.isEditing = Array($scope.categories.length).fill(false)
        }, function errorCallback(response) {
            console.log(response)
        });
    }

    $scope.createCategory = function () {
        var category = new Category(
            idGenerator(),
            Date().toLocaleString(),
            $scope.categoryName
        )

        console.log(`Category: ${angular.toJson(category)}`)

        var method = 'POST'
        var endPoint = "https://localhost:3000/createCategory"
        var data = angular.toJson(category)


        $http({
            method: method,
            url: endPoint,
            data: data
        }).then(function successCallback(response) {
            $scope.response = `${response.status} => Success: ${response.data}`
            resetFormClick(categoryFormResetBtn, 2, $scope)
            $scope.getCategories()

        }, function errorCallback(response) {
            $scope.response = `${response.status} => \nCall API Fail`
        });
    }

    $scope.enableEdit = function (categoryName, index) {
        console.log(`enableEdit: ${index}`)
        $scope.isEditing.fill(false, 0, $scope.isEditing.length)
        $scope.isEditing[index] = !$scope.isEditing[index]
        $scope.tmpCategoryName = categoryName
    }

    $scope.editCategory = function (category, index) {
        // console.log(`categoryId: ${category}, index: ${index}`)
        // console.log(`tmpCategoryName: ${$scope.tmpCategoryName}`)
        var modifiedCategory = new Category(
            category.categoryId,
            Date().toLocaleString(),
            category.name
        )
        if (category.name != $scope.tmpCategoryName) {
            var method = 'POST'
            var endPoint = "https://localhost:3000/editCategory"
            var data = angular.toJson(modifiedCategory)

            $http({
                method: method,
                url: endPoint,
                data: data
            }).then(function successCallback(response) {
                $scope.response = `${response.status} => Success: ${response.data}`
                console.log(`success`)
                $scope.isEditing[index] = false

            }, function errorCallback(response) {
                $scope.response = `${response.status} => \nCall API Fail`
            });
        } else {
            $scope.isEditing[index] = false
        }
    }

    $scope.deleteCategory = function (categoryId) {
        // console.log(`categoryId: ${categoryId}`)

        var method = 'GET'
        var endPoint = "https://localhost:3000/deleteCategory"
        var data = { categoryId: categoryId }

        $http({
            method: method,
            url: endPoint,
            params: data
        }).then(function successCallback(response) {
            console.log(response.data)
            // console.log("Success")
            $scope.categories.forEach(it => {
                if (it.categoryId == categoryId) {
                    var index = $scope.categories.indexOf(it)
                    $scope.categories.splice(index, 1)
                }
            })
        }, function errorCallback(response) {
            console.log(response)
            // console.log("Fail")
        });
    }
}).directive('formReset', function () {
    return {
        // Make this component restrict to attribute alone
        restrict: 'A',
        // Get the form object inside this directive
        require: '^form',
        // link a callback function to the directive
        link: function (scope, elem, attrs, formCtrl) {
            // Capture the click event of reset button
            elem.bind('click', function () {
                // Reset the form validation parameters
                formCtrl.$setPristine();
                formCtrl.$setUntouched();

                // Loop through all the ng-model bindings
                angular.forEach(formCtrl, function (value, key) {
                    if (typeof value === 'object' && value.hasOwnProperty('$modelValue')) {
                        // Clear the modal data bindings
                        value.$setViewValue(undefined);
                    }
                });
            });
        }
    };
})

app.controller('EditProductController', function ($scope, $http) {
    $scope.test = "Hello World in EditProductController"

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
            $scope.categories = response.data

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
            $scope.products = []
            response.data.forEach(it => {
                var tmpProduct = new Product(
                    it.productId,
                    it.createTime,
                    it.name,
                    it.price,
                    it.quantity,
                    it.description,
                    it.categoryName,
                    it.categoryId
                )
                $scope.products.push(tmpProduct)
            })
            // console.log($scope.products)
            $scope.isEditing = Array($scope.products.length).fill(false)
        }, function errorCallback(response) {
            console.log(response)
        });
    }

    $scope.getCategoryNameById = function (categoryId) {
        var categoryName = ""
        $scope.categories.forEach(category => {
            if (category.categoryId == categoryId) {
                categoryName = category.name
            }
        })
        return categoryName
    }


    $scope.createProduct = function () {
        console.log(`Create Product: ${$scope.quantity}`)
        var product = new Product(
            idGenerator(),
            Date().toLocaleString(),
            $scope.productName,
            $scope.price,
            $scope.quantity,
            $scope.description,
            $scope.categoryId != undefined ? $scope.getCategoryNameById($scope.categoryId) : undefined,
            $scope.categoryId
        )
        console.log(`product: ${angular.toJson(product)}`)

        var method = 'POST'
        var endPoint = "https://localhost:3000/createProduct"
        var data = angular.toJson(product)

        $http({
            method: method,
            url: endPoint,
            data: data
        }).then(function successCallback(response) {
            $scope.response = `${response.status} => Success: ${response.data}`
            resetFormClick(productFormResetBtn, 2, $scope)
            $scope.getProducts()

        }, function errorCallback(response) {
            $scope.response = `${response.status} => \nCall API Fail`
        });
    }

    $scope.enableEdit = function (product, index) {
        console.log(`enableEdit: ${index}`)
        $scope.isEditing.fill(false, 0, $scope.isEditing.length)
        $scope.isEditing[index] = !$scope.isEditing[index]
        $scope.tmpProduct = new Product(
            product.productId,
            product.createTime,
            product.name,
            product.price,
            product.quantity,
            product.description,
            product.categoryName,
            product.categoryId
        )
        // console.log(`tmpProduct: ${angular.toJson($scope.tmpProduct)}`)
    }

    $scope.editProduct = function (product, index) {
        var editProduct = new Product(
            product.productId,
            product.createTime,
            product.name,
            product.price != null ? parseInt(product.price) : $scope.tmpProduct.price,
            product.quantity != null ? parseInt(product.quantity) : $scope.tmpProduct.quantity,
            product.description,
            $scope.getCategoryNameById(product.categoryId),
            product.categoryId
        )
        // console.log(`product: ${angular.toJson(editProduct)}`)
        // console.log(`tmpProduct: ${angular.toJson($scope.tmpProduct)}`)
        if (angular.toJson(editProduct) == angular.toJson($scope.tmpProduct)) {
            // console.log(`No change detected`)
            $scope.isEditing[index] = false
            $scope.getProducts()
        } else {
            // console.log(`Change(s) detected`)
            editProduct.createTime = Date().toLocaleString()
            var method = 'POST'
            var endPoint = "https://localhost:3000/editProduct"
            var data = angular.toJson(editProduct)
            console.log(`data: ${data}`)
            $http({
                method: method,
                url: endPoint,
                data: data
            }).then(function successCallback(response) {
                $scope.response = `${response.status} => Success: ${response.data}`
                $scope.isEditing[index] = false
                $scope.getProducts()

            }, function errorCallback(response) {
                $scope.response = `${response.status} => \nCall API Fail`
            });
        }
    }

    $scope.deleteProduct = function (productId) {
        console.log(`productId: ${productId}`)

        var method = 'GET'
        var endPoint = "https://localhost:3000/deleteProduct"
        var data = { productId: productId }

        $http({
            method: method,
            url: endPoint,
            params: data
        }).then(function successCallback(response) {
            console.log(response.data)
            // console.log("Success")
            $scope.products.forEach(it => {
                if (it.productId == productId) {
                    var index = $scope.products.indexOf(it)
                    $scope.products.splice(index, 1)
                }
            })
        }, function errorCallback(response) {
            console.log(response)
            // console.log("Fail")
        });
    }

}).directive('formReset', function () {
    return {
        // Make this component restrict to attribute alone
        restrict: 'A',
        // Get the form object inside this directive
        require: '^form',
        // link a callback function to the directive
        link: function (scope, elem, attrs, formCtrl) {
            // Capture the click event of reset button
            elem.bind('click', function () {
                // Reset the form validation parameters
                formCtrl.$setPristine();
                formCtrl.$setUntouched();

                // Loop through all the ng-model bindings
                angular.forEach(formCtrl, function (value, key) {
                    if (typeof value === 'object' && value.hasOwnProperty('$modelValue')) {
                        // Clear the modal data bindings
                        value.$setViewValue(undefined);
                    }
                });
            });
        }
    };
})

app.controller('OrdersController', function ($scope, $http) {
    $scope.test = "Hello World in OrdersController"

    $scope.init = function () {
        $scope.getOrders()
    }

    $scope.getOrders = function () {
        var method = 'GET'
        var endPoint = "https://localhost:3000/getOrders"

        $http({
            method: method,
            url: endPoint,
        }).then(function successCallback(response) {
            // console.log(response.data)
            var orders = []
            response.data.forEach(it => {
                var order = new Order(
                    it.orderId,
                    it.createTime,
                    it.totalAmount,
                    it.status,
                    JSON.parse(it.purchaseItems),
                )
                // console.log(order)
                orders.push(order)
            })
            $scope.orders = orders
        }, function errorCallback(response) {
            console.log(response)
        });
    }

    $scope.confirmOrder = function (orderId) {
        // console.log(orderId)

        var method = 'GET'
        var endPoint = "https://localhost:3000/confirmOrder"
        var data = { orderId: orderId }

        $http({
            method: method,
            url: endPoint,
            params: data
        }).then(function successCallback(response) {
            console.log(response.data)
            // console.log("Success")
            $scope.orders.forEach(it => {
                if (it.orderId == orderId) {
                    it.status = "confirm"
                }
            })
        }, function errorCallback(response) {
            console.log(response)
            // console.log("Fail")
        });
    }
})