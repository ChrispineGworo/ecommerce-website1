let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');

//checking user is logged in or not
window.onload=()=>{
    if(user){
        if(!compareToken(user.authToken, user.email)){
            
        }
    }else{
        location.replace('/login');
    }
}

//price input
const actualPrices = document.querySelector('#actual-price');
const discountPercentage = document.querySelector('#discount');
const sellingPrice= document.querySelector('#sell-price');

discountPercentage.addEventListener('input',()=>{
    if(discountPercentage.value > 100){
        discountPercentage.value = 90;
    }else{
        let discount = actualPrices.value * discountPercentage.value/100;
        sellingPrice.value = actualPrices.value - discount;
    }
})

sellingPrice.addEventListener('input',()=>{
    let discount = (sellingPrice.value / actualPrices.value) * 100;
    discountPercentage.value = discount;
})

//form submision
const productName= document.querySelector('#product-name');
const shortLine= document.querySelector('#short-des');
const des= document.querySelector('#des');

let sizes = []; // will store all the sizes

const stock = document.querySelector('#stock');
const tags= document.querySelector('#tags');
const tac= document.querySelector('#tac');

//buttons
const addProductBtn= document.querySelector('#add-btn');
const saveDraft= document.querySelector('#save-btn');

//store size function
const storeSizes = ()=>{
    sizes=[];
    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item=>{
        if(item.checked){
            sizes.push(item.value);
        }
    })
}

const validateForm = () =>{
    if(!productName.value.length){
        return showAlert('enter product name!')
    }else if(shortLine.value.length > 100 || shortLine.value.length < 10){
        return showAlert('short description must be between 10 to 100 letters long!');
    }else if(!des.value.length){
        return showAlert('enter detail description about the product!');
    }else if(!sizes.length){ // sizes array
        return showAlert('select atleat one program!');
    }else if(!actualPrices.value.length || !discount.value.length || !sellingPrice.value.length){
        return showAlert('you must add pricings!');
    }else if(stock.value < 20){
        return showAlert('you should have atleast 20 items in stock!');
    }else if(!tags.value.length){
        return showAlert('enter few tags to help ranking your product in search');
    }else if(!tac.checked){
        return showAlert('you must agree to our terms and conditions!');
    }
    return true;
}

const productData =()=>{
    return data ={
        productName: productName.value,
        shortLine : shortLine.value,
        des : des.value,
        sizes: sizes,
        actualPrices: actualPrices.value,
        discount: discountPercentage.value,
        sellPrice: sellingPrice.value,
        stock: stock.value,
        tags: tags.value,
        tac: tac.checked,
        email: user.email
    }
}

addProductBtn.addEventListener('click',()=>{
    storeSizes();
    //validate  form
    if(validateForm()){ //validateForm return true or false while doing validation
        loader.style.display = 'block';
        let data = productData();
        sendData('/add-product',data);
    }
})

