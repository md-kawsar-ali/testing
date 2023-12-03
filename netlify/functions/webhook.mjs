import fetch from 'node-fetch';
import stripePackage from 'stripe';

const stripe = stripePackage(Netlify.env.get("STRIPE_SECRET_KEY"));

export default async (event, context) => {
    try {
        const { body } = event;
        const stripeEvent = JSON.parse(body);

        // Handle successful checkout session completion
        if (stripeEvent.type === 'checkout.session.completed') {
            const session = stripeEvent.data.object;

            // Retrieve customer details from the checkout session
            const stripeCustomerId = session.customer;
            const stripeCustomer = await stripe.customers.retrieve(stripeCustomerId);

            // Retrieve the Dropbox user's email (replace with your logic)
            const dropboxUserEmail = stripeCustomer.email;

            // Get a Dropbox access token (replace with your Dropbox app credentials)
            const dropboxAccessToken = Netlify.env.get("DROPBOX_ACCESS_TOKEN");

            // Specify the Dropbox file path and settings
            const filePath = '/Apps/Premium-Book/Paradoxical_Sajid-1.pdf';
            const settings = {
                access_level: 'viewer', // Choose the appropriate access level
            };

            // Create a shared link with specified access settings
            const dropboxResponse = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dropboxAccessToken}`,
                },
                body: JSON.stringify({
                    path: filePath,
                    settings: settings,
                }),
            });

            const dropboxData = await dropboxResponse.json();

            // Send Dropbox invitation to the user
            await fetch('https://api.dropboxapi.com/2/sharing/add_file_member', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dropboxAccessToken}`,
                },
                body: JSON.stringify({
                    file: dropboxData.id,
                    members: [
                        {
                            member: dropboxUserEmail,
                            access_level: settings.access_level,
                        },
                    ],
                }),
            });

            // The user will be notified by Dropbox about the shared file.
        }

        return new Response(JSON.stringify({ message: 'Webhook processed successfully' }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200
        }
        );
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Internal Server Error!' }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 500
        }
        );
    }

};