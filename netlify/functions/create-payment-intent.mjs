import stripePackage from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
    if (items === "sku-ebook-1") {
        return (20 * 100); // Price is $20
    }

    return 20000;
};

export default async (event, context) => {
    try {
        const { items } = JSON.parse(event.body);

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
