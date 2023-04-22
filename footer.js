const createFooter =()=>{
    let footer = document.querySelector('footer');

    footer.innerHTML = `
    <div class="footer">
        <div class="container">
            <div class="row">
                <div class="footer-col-1">
                    <h3>Download Our App</h3>
                    <p>Download app for Android and ios mobile phone.</p>
                    <div class="app-logo">
                        <img src="../get-it-on-google-play.png">
                        <img src="../apple-app-store.png">
                    </div>
                </div>
                <div class="footer-col-2">
                    <img src="../chrisma.jpg">
                    <p>Lorem ipsum dolor sit amet repellendus, 
                    voluptates praesentium nesciunt tempora! Amet maxime magni eos voluptates neque.</p>
                </div>
                <div class="footer-col-3">
                    <h3>Useful Links</h3>
                    <ul>
                        <li>Coupons</li>
                        <li>Blog Post</li>
                        <li>Return Policy</li>
                        <li>Join Affiliate</li>
                    </ul>
                </div>
                <div class="footer-col-4">
                    <h3>Follow Us</h3>
                    <ul>
                        <li>Facebook</li>
                        <li>Twitter</li>
                        <li>Instagram</li>
                        <li>YouTube</li>
                    </ul>
                </div>
            </div>
            <hr>
            <p class="Copyright">Copyright 2020 - Easy Tutorials</p>
        </div>
    </div> `;
}

createFooter();