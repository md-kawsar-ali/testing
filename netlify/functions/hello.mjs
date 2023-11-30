export const handler: Handler = async (event, context) => {
    return {
        body: JSON.stringify({ message: "Hello World" }),
        statusCode: 200
    };
};
