const Cart = require('../models/Cart')

module.exports.getUserCart = (req, res) =>{
    return Cart.find({userId: req.user.id})
    .then((result)=>{
        console.log(result);
        if(!result || result.length === 0){

            res.status(404).send({message: 'Empty Cart'})
        } else {
            res.status(200).send({message: result})
        }
    })
    .catch((error) => {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error.' });
      });
}

module.exports.addToCart = (req, res) => {
    return Cart.findOne({userId: req.user.id})
    .then((result)=>{
        console.log(result)
        if(!result){
            let newCart = new Cart({
                userId: req.user.id,
                cartItems: req.body.cartItems,
                totalPrice: req.body.totalPrice
            })
            return newCart.save()
            .then((savedCart, err)=>{
                if(err){
                    return res.status(400).send({message: 'Cart not saved'})
                } else {
                    return res.status(200).send({message: savedCart})
                }
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).send({ message: 'Internal server error.' });
              });
        } else {
            result.cartItems.push(req.body.cartItems);
            result.totalPrice += req.body.cartItems.subtotal;
            return result.save()
            .then((updatedCart, err) => {
                if (err) {
                    return res.status(400).send({ message: 'Failed to update cart' });
                } else {
                    return res.status(200).send({ message: updatedCart });
                }
            })
        }
    })
    .catch((error) => {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error.' });
      });
}

module.exports.changeCartQuantity = (req, res) => {
    Cart.findOneAndUpdate(
        { userId: req.user.id, 'cartItems.productId': req.body.productId },
        { $set: { 'cartItems.$.quantity': req.body.quantity } },
        { new: true }
    )
    .then((result) => {
        if (!result) {
            return res.status(404).send({ message: "The product you're trying to change quantity with is not within the cart." });
        } else {
            return res.status(200).send({ message: 'Successfully changed quantity to ' + req.body.quantity });
        }
    })
    .catch((error) => {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error.' + error });
    });
};

module.exports.removeProduct = (req, res) => {
    Cart.findOneAndUpdate(
        { userId: req.user.id },
        { $pull: { 'cartItems': { productId: req.body.productId } } },
        { new: true }
    )
    .then((result) => {
        if (!result) {
            return res.status(404).send({ message: 'No cart found.' });
        } else {
            return res.status(200).send({ message: 'Successfully removed product with productId ' + req.body.productId });
        }
    })
    .catch((error) => {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error.' + error });
    });
};

module.exports.clearProducts = (req, res) => {

    Cart.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { 'cartItems': [] } },
        { new: true }
    )
    .then((result) => {
        if (!result) {
            return res.status(404).send({ message: 'No cart found.' });
        } else {
            return res.status(200).send({ message: 'Successfully cleared all products from the cart.' });
        }
    })
    .catch((error) => {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error.' + error });
    });
};

