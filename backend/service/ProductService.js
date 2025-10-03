const productModel = require('../model/Product')

exports.create = async function (product) {
    let checkDuplicate = await module.exports.findByName(product.name);

    if (checkDuplicate != null)
        throw new Error("Other product has the name : " + product.name);

    let newProduct = await productModel.create({
        name: product.name,
        price: product.price,
        quantity: product.quantity
    });

    return newProduct;
}

exports.update = async function (product, id) {
    await module.exports.findById(id);
    let checkDuplicate = await module.exports.findByName(product.name);

    if (checkDuplicate != null && checkDuplicate.id != id)
        throw new Error("Other product has the name : " + product.name);

    let updateProduct = await productModel.update({
        name: product.name,
        price: product.price,
        quantity: product.quantity
    },
        { where: { id: id } });

    product = await module.exports.findById(id);

    return product;
}

exports.findByName = async function (name) {
    if (!name || name.trim().length <= 0)
        throw new Error("Product name can not be empty");

    let product = await productModel.findOne({
        where: {
            name: name
        }
    });

    return product;
}

exports.findAll = async function () {
    let products = await productModel.findAll();

    return products;
}

exports.findById = async function (id) {
    if (isNaN(id))
        throw new Error("The product ID must be a number");
    if (id <= 0)
        throw new Error("The product ID must be greater than zero");

    let product = await productModel.findOne({
        where: {
            id: id
        }
    });

    if (!product)
        throw new Error(`Product with ID ${id} not found`);

    return product;
}

exports.deleteById = async function (id) {
    let product = await module.exports.findById(id);

    console.log(product);

    await productModel.destroy({
        where: { id: product.id }
    });

    return `The product: '${product.name}' was deleted`;
}