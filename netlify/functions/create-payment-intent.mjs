import stripePackage from 'stripe';

const stripe = stripePackage(Netlify.env.get("STRIPE_SECRET_KEY"));

export default async (event, context) => {
    try {
        const body = JSON.parse(event.body);
        const item = body.items;

        let price = 0;

        if (item === 'skuebook') {
            price += 999
        } else {
            throw error;
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            }
        });

        const clientSecret = paymentIntent?.client_secret;

        if (clientSecret) {
            return new Response(JSON.stringify({ clientSecret }), {
                headers: {
                    'Content-Type': 'application/json'
                },
                status: 200
            }
            );
        }

        throw new Error("Unable to genarate Client Secret Key!");

    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 500
        }
        );
    }
};
