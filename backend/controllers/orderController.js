import Order from '../modals/orderModal.js';
import 'dotenv/config'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE ORDER FUNCTION
export const createOrder = async (req, res) => {
    try {
        const {
            firstName, lastName, phone, email, address, city, zipCode, paymentMethod, subtotal, tax, total, items
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty items array' })
        }

        const orderItems = items.map(({ item, name, price, imageUrl, quantity }) => {
            // Use the request body directly if no nested 'item'
            const product = item || {};
            return {
                item: {
                    name: product.name || name || 'Unknown',       // ensures name is present
                    price: isNaN(Number(product.price ?? price)) ? 0 : Number(product.price ?? price), // FIXED here
                    imageUrl: product.imageUrl || imageUrl || ''   // ensures imageUrl is present
                },
                quantity: Math.max(Number(quantity) || 1, 1)       // ensures quantity >= 1
            }
        });

        // DEFAULT SHIPPING COST
        const shippingCost = 0;
        let newOrder;

        if (paymentMethod === 'online') {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',

                line_items: orderItems.map(order => ({
                    price_data: {
                        currency: 'usd',
                        product_data: {name: order.item.name},
                        unit_amount: Math.round(order.item.price * 100)
                    },
                    quantity: order.quantity
                })),
                customer_email: email,
                success_url: `${process.env.FRONTEND_URL}/myorder/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
                metadata: { firstName, lastName, email, phone }
            });

            newOrder = new Order({
                user: req.user._id,
                firstName, lastName, phone, email, address, city, zipCode, paymentMethod, subtotal,
                tax, total, shipping: shippingCost, items: orderItems,
                paymentIntentId: session.payment_intent,
                sessionId: session.id,
                paymentStatus: 'pending'
            })

            await newOrder.save();
            return res.status(201).json({ order: newOrder, checkoutUrl: session.url })
        }

        //  IF PAYMENT IS DONE COD (CASH ON DELIVERY)
        newOrder = new Order({
            user: req.user._id,
            firstName, lastName, phone, email, address, city, zipCode, paymentMethod, subtotal,
            tax, total, 
            shipping: shippingCost, 
            items: orderItems,
            paymentStatus: 'succeeded'
        });

        await newOrder.save();
        return res.status(201).json({ order: newOrder, checkoutUrl: null })
    }
    catch (error) {
        console.error('CreateOrder Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
};

// CONFIRM PAYMENT
export const confirmPayment = async (req, res) => {
    try {
        const { session_id } = req.query;
        if (!session_id) {
            return res.status(400).json({ message: 'session_id required' });
        }
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'paid') {
            const order = await Order.findOneAndUpdate(
                { sessionId: session_id }, // matches how you saved it
                { paymentStatus: 'succeeded' },
                { new: true }
            );

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            return res.json(order);
        }
        return res.status(400).json({ message: 'Payment not completed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

// GET ORDER
export const getOrders = async (req, res) => {
    try {
        const filter = { user: req.user._id } // order belongs to a particular user
        const rawOrders = await Order.find(filter).sort({ createdAt: -1}).lean()

        // FORMAT
        const formatted = rawOrders.map(orderData => ({
            ...orderData,
            items: orderData.items.map(orderItem  => ({
                _id: orderItem._id,
                item: orderItem.item,
                quantity: orderItem .quantity
            })),
            createdAt: orderData.createdAt,
            paymentStatus: orderData.paymentStatus
        }));
        res.json(formatted)
    }
    catch (error) {
        console.error('getOrders Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

// ADMIN ROUTE TO GET ALL ORDERS
export const getAllOrders = async (req, res) => {
    try {
        const raw = await Order
            .find({})
            .sort({ createdAt: -1 })
            .lean()

        const formatted = raw.map(orderData => ({
            _id: orderData._id,
            user: orderData.user,
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address ?? orderData.shippingAddress?.address ?? '',
            city: orderData.city ?? orderData.shippingAddress?.city ?? '',
            zipCode: orderData.zipCode ?? orderData.shippingAddress?.zipCode ?? '',

            paymentMethod: orderData.paymentMethod,
            paymentStatus: orderData.paymentStatus,
            status: orderData.status,
            createdAt: orderData.createdAt,

            items: orderData.items.map(orderItem => ({
                _id: orderItem._id,
                item: orderItem.item,
                quantity: orderItem.quantity
            }))
        }));

        res.json(formatted)
    }
    catch (error) {
        console.error('getAllOrders Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

// UPDATE ORDER WITHOUT TOKEN FOR ADMIN
export const updateAnyOrder = async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.json(updated)
    }
    catch (error) {
        console.error('updateAnyOrder Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

// GET ORDER BY ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        if (!order.user.equals(req.user._id)) {
            return res.status(403).json({ message: 'Access Denied' })
        }
        if (req.query.email && order.email !== req.query.email) {
            return res.status(403).json({ message: 'Access Denied' })
        }
        res.json(order)
    }
    catch (error) {
        console.error('getOrderById Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

// UPDATE BY ID
export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        if (!order.user.equals(req.user._id)) {
            return res.status(403).json({ message: 'Access Denied' })
        }
        if (req.body.email && order.email !== req.body.email) {
            return res.status(403).json({ message: 'Access Denied' })
        }

        const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated)
    }
    catch (error) {
        console.error('getOrderById Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}