import stripePackage from 'stripe';

const stripe = stripePackage(Netlify.env.get("STRIPE_SECRET_KEY"));

const calculateOrderAmount = (items) => {
    if (items == "skuebook") {
        return 20000; // Price is $20
    }

    return 20000;
};

export default async (event, context) => {
    try {
        const { items } = JSON.parse(event.body);
        console.log(items)

        const price = calculateOrderAmount(items);

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            }
        });

        console.log(paymentIntent.client_secret)

        return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200
        }
        );
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message, secret: Netlify.env.get("STRIPE_SECRET_KEY") }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 500
        }
        );
    }
};
