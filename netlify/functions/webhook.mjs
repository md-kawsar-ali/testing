import fetch from 'node-fetch';

export const handler = async (event, context, callback) => {

    try {
        const { body } = event;
        const stripeEvent = JSON.parse(body);

        // Handle successful checkout session completion
        if (stripeEvent.type === 'checkout.session.completed') {
            const session = stripeEvent.data.object;

            // Retrieve customer details from the checkout session
            const stripeCustomer = session.customer_details;
            const productId = session.metadata.product_id; // Make sure to add metadata in your product in stripe

            if (productId !== "ebook101") {
                return callback(null, {
                    statusCode: 403,
                    body: JSON.stringify({ message: 'Access forbidden!' })
                })
            }

            // Retrieve the Dropbox user's email (replace with your logic)
            const dropboxUserEmail = stripeCustomer.email;

            // Get a Dropbox access token (replace with your Dropbox app credentials)
            const dropboxAccessToken = Netlify.env.get("DROPBOX_ACCESS_TOKEN");

            // Specify the Dropbox file path and settings
            const filePath = '/Paradoxical_Sajid-1.pdf';
            const settings = {
                'access': 'viewer', // Choose the appropriate access level
                'allow_download': true
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
                    'file': dropboxData.id,
                    'access_level': 'viewer',
                    'add_message_as_comment': false,
                    members: [
                        {
                            '.tag': 'email',
                            'email': dropboxUserEmail,

                        }
                    ],
                    'quiet': true
                })
            });

            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({ message: 'Invitation sent' })
            })
        }

        return callback(null, {
            statusCode: 403,
            body: JSON.stringify({ message: 'Access Forbidden!' })
        })
    } catch (error) {
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify(error)
        })
    }

};