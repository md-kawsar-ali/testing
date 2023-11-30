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
    const jsonUser = JSON.stringify(user);

    return new Response({ jsonUser });
}
