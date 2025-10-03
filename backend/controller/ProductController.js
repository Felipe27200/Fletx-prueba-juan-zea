const productService = require('../service/ProductService');
const responseUtils = require('../utils/responseUtils');

exports.create = async function (req, res) {
    try {
        let product = validateProduct(req);

        let newProduct = await productService.create(product);

        res.json(responseUtils.responseObject('Product was created', newProduct));
    }
    catch (error) {
        res.status(400);
        res.json(responseUtils.responseObject(error.message, error, 'unsuccessful'));
    }
}

exports.update = async function (req, res) {
    try {
        let id = req.params.id;

        if (isNaN(id))
            throw new Error("The product ID must be a number");
        if (id <= 0)
            throw new Error("The product ID must be greater than zero");

        let product = validateProduct(req);

        let updateProduct = await productService.update(product, id);

        res.json(responseUtils.responseObject('Product was created', updateProduct));
    }
    catch (error) {
        res.status(400);
        res.json(responseUtils.responseObject(error.message, error, 'unsuccessful'));
    }
}

exports.findById = async function (req, res) {
    try {
        let id = req.params.id;

        if (isNaN(id))
            throw new Error("The product ID must be a number");
        if (id <= 0)
            throw new Error("The product ID must be greater than zero");

        let product = await productService.findById(id);

        res.json(responseUtils.responseObject('Product Found', product));
    }
    catch (error) {
        res.status(400);
        res.json(responseUtils.responseObject(error.message, error, 'unsuccessful'));
    }
}

function validateProduct(req) {
    let product = {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity
    }

    if (!product.name || product.name.trim().length <= 0)
        throw new Error("Name is required");

    if (!product.price)
        throw new Error("Price is required");
    if (isNaN(product.price))
        throw new Error("Price must be a number");
    if (product.price <= 0)
        throw new Error("Price must be greater than zero");

    if (!product.quantity)
        throw new Error("Quantity is required");
    if (isNaN(product.quantity))
        throw new Error("Quantity must be a number");
    if (product.quantity <= 0)
        throw new Error("Quantity must be greater than zero");

    return product;
}