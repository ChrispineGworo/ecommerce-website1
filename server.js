// Importing packages
const express = require('express');
const admin =require('firebase-admin');
const bcrypt =require('bcrypt');
const path = require('path');
const functions =require('firebase-functions');
const {Storage} = require('@google-cloud/storage');
const UUID =require('uuid-v4');
const formidable = require('formidable-serverless');

//dependencies for uploading file to our firestore
const storage =new Storage({
    keyFilename: "ecommerce-8d663-firebase-adminsdk-r6f0w-3b5f4f6e24.json",
})

//firebase admin setup
let serviceAccount = require("./ecommerce-8d663-firebase-adminsdk-r6f0w-3b5f4f6e24.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

//user referrence
const userRef =admin.firestore().collection("users");

//declare static path
let staticPath = path.join(__dirname,"public");

// initialize express.js
const app = express();

//activating upload
app.use(express.json({limit:"50mb",extended:true}));
app.use(express.urlencoded({extended:false,limit:"50mb"}));

//middlewares
app.use(express.static(staticPath));
app.use(express.json());

//home route
app.get("/",(req,res)=>{
    res.sendFile(path.join(staticPath,"index.html"));
})

//signup route
app.get("/signup",(req,res)=>{
    res.sendFile(path.join(staticPath,"signup.html"));
})

app.post('/signup',(req,res)=>{
    let {name, email, password, number, tac, notification}=req.body;

    //form validation
    if(name.length<3){
        return res.json({'alert':'name must have minimum of 3 letters'});
    }else if(!email.length){
        return res.json({'alert':'enter your email'});
    }else if(password.length<8){
        return res.json({'alert':'password must have atleast 8 characters'});
    }else if(!number.length){
        return res.json({'alert':'enter your phone number'});
    }else if(Number(number.value).value || number.length<10){
        return res.json({'alert':'please enter valid number'});
    }else if(!tac){
        return res.json({'alert':'you must agree to our terms and conditions'});
    }else{
        //store user in db
        db.collection('users').doc(email).get()
        .then(user=>{
            if(user.exists){
                return res.json({'alert':'email already exists'});
            }else{
                //encrypt the password before storing it
                bcrypt.genSalt(10, (err,salt)=>{
                    bcrypt.hash(password,salt, (err,hash)=>{
                        req.body.password = hash;
                        db.collection('users').doc(email).set(req.body)
                        .then(data=>{
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                                seller: req.body.seller,
                            })
                        })
                    })
                })
            }
        })
    }
})

//login route
app.get("/login",(req,res)=>{
    res.sendFile(path.join(staticPath,"login.html"));
})

app.post('/login',(req,res)=>{
    let { email, password} = req.body;

    if(!email.length || !password.length){
        return res.json({'alert':'fill all the inputs'})
    } 

    db.collection('users').doc(email).get()
    .then(user =>{
        if(!user.exists){
            return res.json({'alert':'email does not exists'});
        }else{
            bcrypt.compare(password, user.data().password,(_err,result)=>{
                if(result){
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller,
                    })
                }else{
                    return res.json({'alert':'invalid password'});
                }
            })
        }
    })

})

// seller route
app.get("/seller",(req,res)=>{
    res.sendFile(path.join(staticPath,"seller.html"));
})

app.post('/seller',(req,res)=>{
    let {name, about, address, number, tac, legitInfo, email} = req.body;
    if(!name.length || !address.length || !about.length || number.length<10 || !Number(number)){
        return res.json({'alert':'Some informations are invalid'});
    }else if(!tac || !legitInfo){
        return res.json({'alert':'you must agree with our terms and conditions'})
    }else{
        // update users seller status here
        db.collection('sellers').doc(email).set(req.body)
        .then(data =>{
            db.collection('users').doc(email).update({
                seller: true
            }).then(data =>{
                res.json(true);
            })
        })
    }
})

//add product route and photo upload
app.get('/addProduct',(req,res)=>{
    res.sendFile(path.join(staticPath,"addProduct.html"));
})

app.post('/addProduct', async (req,res)=>{
    const form = new formidable.IncomingForm({multiple:true});

    try{
        form.parse(req,async(err,fields,files)=>{
            let uuid = UUID();
            var downloadPath = "https://console.firebase.google.com/project/ecommerce-8d663/storage/ecommerce-8d663.appspot.com/files"

            const profileImage = files.profileImage;

            //upload url images
            let imageUrl;

            const docID = userRef.doc().id;

            if(err){
                return res.status(400).json({
                    message: "There is an error parsing the files",
                    data:{},
                    error: err,
                })
            }
            const bucket = storage.bucket("gs://ecommerce-8d663.appspot.com");

            if(profileImage.size == 0){
                //do nothing
            }else{
                const imageResponse = await bucket.upload(profileImage.path,{
                    destination: `users/${profileImage.name}`,
                    resumable: true,
                    metadata:{
                        metadata:{
                            firebaseStorageDownloadToken: uuid,
                        },
                    },
                });
                //profile image url
                imageUrl = downloadPath+encodeURIComponent(imageResponse[0],name)+"?alt=media&token="+uuid;
            }
            //object to send to database
            const userModel ={
                id: docID,
                name: fields.name,
                email: fields.email,
                password: fields.password,
                profileImage: profileImage.size == 0?"": imageUrl,
            };

            await userRef
            .doc(docID)
            .set(userModel,{merge:true})
            .then((value)=>{
                //return response to users
                res.status(200).send({
                    message: "user created successfully",
                    data: userModel,
                    error: {},
                });
            });
        });
    } catch(err){
        res.send({
            message: "something went wrong",
            data: {},
            error: err,
        });
    }
});

exports.api = functions.https.onRequest(app);

//add product
app.post('/add-product',(req,res)=>{
    let {productName,shortLine,des,sizes,actualPrices,discount,sellPrice,stock,tags,tac,email}=req.body;

    //validation
    if(!productName.length){
        return res.json({'alart':'enter product name!'})
    }else if(shortLine.length > 100 || shortLine.length < 10){
        return res.json({'alart':'short description must be between 10 to 100 letters long!'});
    }else if(!des.length){
        return res.json({'alart':'enter detail description about the product!'});
    }else if(!sizes.length){ // sizes array
        return res.json({'alart':'select atleat one program!'});
    }else if(!actualPrices.length || !discount.length || !sellPrice.length){
        return res.json({'alart':'you must add pricings!'});
    }else if(stock < 20){
        return res.json({'alart':'you should have atleast 20 items in stock!'});
    }else if(!tags.length){
        return res.json({'alart':'enter few tags to help ranking your product in search'});
    }else if(!tac){
        return res.json({'alart':'you must agree to our terms and conditions!'});
    }
    
    //add product
    let docName = `${productName.toLowerCase()}-${Math.floor(Math.random()*5000)}`;
    db.collection('products').doc(docName).set(req.body)
    .then(data=>{
        res.json({'product':productName});
    })
    .catch(err=>{
        return res.json({'alert':'some errors occurred. Tyr again'});
    })
})

//get products
app.post('/get-products',(req,res)=>{
    let {email}=req.body;
    let docRef = db.collection('products').where('email','==',email);

    docRef.get()
    .then(products=>{
        if(products.empty){
            return res.json('no products');
        }
        let productArr = [];
        products.forEach(item=>{
            let data = item.data();
            data.id =item.id;
            productArr.push(data);
        })
        res.json(productArr)
    })
})

app.post('/delete-product',(req,res)=>{
    let {id}=req.body;

    db.collection('products').doc(id).delete()
    .then(data =>{
        res.json('success');
    }).catch(err=>{
        res.json('err');
    })
})

//upload file
app.get("/uploadFile",(req,res)=>{
    res.sendFile(path.join(staticPath,"uploadFile.html"));
})

//mobile
app.get("/mobile",(req,res)=>{
    res.sendFile(path.join(staticPath,"mobile.html"));
})

//products servers
app.get("/product",(req,res)=>{
    res.sendFile(path.join(staticPath,"product.html"));
})

//cart server
app.get("/cart",(req,res)=>{
    res.sendFile(path.join(staticPath,"cart.html"));
})


//404 route
app.get("/404",(req,res)=>{
    res.sendFile(path.join(staticPath,"404.html"));
})

app.use((req,res)=>{
    res.redirect('/404');
})


app.listen(3000,()=>{
    console.log('listening on port 3000');
})