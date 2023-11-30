const user = [
    {
        'id': '1',
        'name': 'Alex'
    },
    {
        'id': '2',
        'name': 'Jordan'
    },
    {
        'id': '3',
        'name': 'Jhon'
    }
]

export default async (request, context) => {

    return new Response(JSON.stringify(user), {
        headers: {
            'Content-Type': 'application/json'
        },
        status: 200
    }
    );
}
