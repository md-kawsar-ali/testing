import fetch from 'node-fetch';
import 'dotenv/config';

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
            const dropboxAccessToken = process.env.DROPBOX_ACCESS_TOKEN;

            // Send Dropbox invitation to the user
            const addFileMember = await fetch('https://api.dropboxapi.com/2/sharing/add_file_member', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dropboxAccessToken}`,
                },
                body: JSON.stringify({
                    'file': 'id:i8afkiodygqpsyyo3pggv',
                    'access_level': 'viewer',
                    'add_message_as_comment': false,
                    'members': [
                        {
                            '.tag': 'email',
                            'email': dropboxUserEmail,

                        }
                    ],
                    'quiet': false
                })
            });

            const result = await addFileMember.json();

            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({ message: result, error: result.error })
            })
        } else {
            return callback(null, {
                statusCode: 403,
                body: JSON.stringify({ message: 'Access Forbidden!' })
            })
        }

    } catch (error) {
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        })
    }

};