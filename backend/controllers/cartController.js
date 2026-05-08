import asyncHandler from 'express-async-handler'
import { CartItems } from '../modals/cartModal.js'

// GET CART
// export const getCart = asyncHandler(async (req, res) => {
//     // const items = await CartItems.find({ user: req.user._id }).populate('item');
//     await CartItems.find({ user: req.user._id }).populate('item', 'name description price imageUrl');

//     const formatted = items.map(cartEntry => ({
//         _id: cartEntry.id.toString(),
//         item: cartEntry.item,
//         quantity: cartEntry.quantity
//     }))
//     res.json(formatted)
// })


export const getCart = asyncHandler(async (req, res) => {
    const items = await CartItems.find({ user: req.user._id })
        .populate('item', 'name description price imageUrl'); // populate price too

    const formatted = items.map(cartEntry => ({
        _id: cartEntry._id.toString(),
        item: cartEntry.item,
        quantity: cartEntry.quantity
    }))

    res.json(formatted)
})







// ADD TO CART FUNCTION TO ADD ITEMS TO CART
export const addToCart = asyncHandler(async (req, res) => {
    console.log("REQ.BODY:", req.body);
    console.log("TYPE OF quantity:", typeof req.body.quantity);
    console.log("REQ.USER:", req.user);

    const { itemId, quantity } = req.body;

    const nextQuantity = Number(quantity);

    if (!itemId || !Number.isFinite(nextQuantity)) {
        res.status(400);
        throw new Error('itemId and quantity are required')
    }

    let cartItem = await CartItems.findOne({ user: req.user._id, item: itemId });
    
    if (cartItem) {
        cartItem.quantity = Math.max(1, cartItem.quantity + nextQuantity)

        if (cartItem.quantity < 1) {
            await cartItem.remove();
            return res.json({ _id: cartItem._id.toString(), item: cartItem.item, quantity: 0 })
        }
        await cartItem.save();
        await cartItem.populate('item');
        return res.status(200).json({
            _id: cartItem._id.toString(),
            item: cartItem.item,
            quantity: cartItem.quantity,
        })
    }

    cartItem = await CartItems.create({
        user: req.user._id,
        item: itemId,
        quantity: Math.max(1, nextQuantity)
    });
        await cartItem.populate('item');

    res.status(201).json({
        _id: cartItem._id.toString(), // <-- cart entry ID
        item: cartItem.item,
        quantity: cartItem.quantity,
    });
})

// A METHOD TO UPDATE CART AND ITEMS QUANTITY
// export const updateCartItem = asyncHandler(async (req, res) => {
//     const {quantity} = req.body

//     const cartItem = await CartItems.findOne({ _id: req.params.id, user: req.user._id })
//     if (!cartItem) {
//         res.status(404);
//         throw new Error('Cart item not found')
//     }
//     cartItem.quantity = Math.max(1, quantity)
//     await cartItem.save();
//     await cartItem.populate('item')
//      res.json({
//         _id: cartItem._id.toString(),
//         item: cartItem.item,
//         quantity: cartItem.quantity,
//     })
// })





// export const updateCartItem = asyncHandler(async (req, res) => {
//     const { quantity } = req.body;
//     const { id } = req.params;

//     if (!id) {
//         res.status(400);
//         throw new Error("Cart item _id is required");
//     }

//     const cartItem = await CartItems.findOne({ _id: id, user: req.user._id });
//     if (!cartItem) {
//         res.status(404);
//         throw new Error("Cart item not found");
//     }

//     cartItem.quantity = Math.max(1, quantity);
//     await cartItem.save();
//     await cartItem.populate("item");

//     res.json({
//         _id: cartItem._id.toString(),
//         item: cartItem.item,
//         quantity: cartItem.quantity,
//     });
// });






export const updateCartItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!id) {
        res.status(400);
        throw new Error("Cart item _id is required");
    }

    const cartItem = await CartItems.findOne({ _id: id, user: req.user._id });
    if (!cartItem) {
        res.status(404);
        throw new Error("Cart item not found");
    }

    const nextQuantity = Number(quantity);
    if (!Number.isFinite(nextQuantity)) {
        res.status(400);
        throw new Error("Quantity must be a number");
    }

    cartItem.quantity = Math.max(1, nextQuantity);
    await cartItem.save();
    await cartItem.populate("item");

    res.json({
        _id: cartItem._id.toString(),
        item: cartItem.item,
        quantity: cartItem.quantity,
    });
});













// DELETE FUNCTION
// export const deleteCartItem = asyncHandler(async (req, res) => {
//     const cartItem = await CartItems.findOne({ _id: req.params.id, user: req.user._id })
//     // if (!cartItem) {
//     //     res.status(404);
//     //     throw new Error('Cart item not found')
//     // }
//     if (!req.params.id) {
//         res.status(400);
//         throw new Error("Cart item _id is required");
//     }
//     await cartItem.deleteOne();
//     res.json({ _id: req.params.id })
// })


export const deleteCartItem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400);
        throw new Error("Cart item _id is required");
    }

    const cartItem = await CartItems.findOne({ _id: id, user: req.user._id });
    if (!cartItem) {
        res.status(404);
        throw new Error("Cart item not found");
    }

    await cartItem.deleteOne();
    res.json({ _id: id });
});










// CLEAR CART FUNCTION TO EMPTY THE CART
export const clearCart = asyncHandler(async (req, res) => {
    await CartItems.deleteMany({ user: req.user._id });
    res.json({ message: 'Cart Cleared' })
})
