const createNav = () =>{
    let nav = document.querySelector('.navbar');

    nav.innerHTML = `
     <div class="nav">
            <img src="../coding-icon.png"  class="brand-logo" width="125px" height="90px">
            <div class="nav-items">
                <div class="search">
                    <input type="text" class="search-box" placeholder="search brand, book">
                    <button class="search-btn" onclick = "window.location.href='filter.html'">search</button>
                </div>
                <a>
                    <img src="../avatar-login.png" id="user-img" width="50px">
                    <div class="login-logout-popup hide">
                        <p class="account-info">Log in as, name</p>
                        <button class="btn" id="user-btn">Log out </button>
                    </div>
                </a>
                <a href="cart.html"><img src="../cart-supertransparent.png" width="70px"></a>
            </div>
        </div>
        <ul class="links-container">
            <li class="link-item"><a href="index.html" class="link">Home</a></li>
            <li class="link-item"><a href="seller.html" class="link">seller</a></li>
            <li class="link-item"><a href="mobile.html" class="link">Mobile App</a></li>
            <li class="link-item"><a href="uploadFile.html" class="link">Upload Files</a></li>
            <li class="link-item"><a href="product.html" class="link">Product</a></li>
        </ul>
    `;
}

createNav();

//nav popup
const userImageButton = document.querySelector('#user-img');
const userPopUp = document.querySelector('.login-logout-popup');
const popuptext = document.querySelector('.account-info');
const actionBtn = document.querySelector('#user-btn');

userImageButton.addEventListener('click',()=>{
    userPopUp.classList.toggle('hide');
})

window.onload=()=>{
    let user = JSON.parse(sessionStorage.user || null);
    if(user != null){
        //means user is logged in
        popuptext.innerHTML=`logged in as, ${user.name}`;
        actionBtn.innerHTML='log out';
        actionBtn.addEventListener('click',()=>{
            sessionStorage.clear();
            location.reload();
        })
    }else{
        //user is logged out
        popuptext.innerHTML='log in to place order';
        actionBtn.innerHTML='log in';
        actionBtn.addEventListener('click',()=>{
            location.href='/login';
        })
    }
}