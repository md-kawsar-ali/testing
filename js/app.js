console.log('Hello JavaScript!')

fetch('/.netlify/functions/user')
    .then(res => res.json())
    .then(data => {
        data?.user?.map(u => {
            const p = document.createElement('p');
            p.innerText = u.name;

            document.getElementsByTagName('body').appendChild(p);
        })
    })