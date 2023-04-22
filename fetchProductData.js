//fetch data
function fetchProductData() {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ email: user.email, id: productId })
    })
        .then((res) => res.json())
        .then(data => {
            setFormsData(data);
        })
        .catch(err => {
            console.log(err);
        });
}
