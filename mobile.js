import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://ecommerce-8d663-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDb = ref(database, "shoppingList")


const inputFieldElement = document.getElementById("input-field")
const addButtonElement = document.getElementById("add-button")
const shoppingListElement = document.getElementById("shopping-list")

addButtonElement.addEventListener('click',function(){
    let inputValue = inputFieldElement.value 

    push(shoppingListInDb, inputValue)

    clearInputFieldElement ()

})

onValue(shoppingListInDb, function(snapshot){
    if(snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())

        clearShoppingListElement()
    
        for (let i=0; i<itemsArray.length; i++){
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
    
            appendItemToShoppingListElement(currentItem)
        }
    }else{
        shoppingListElement.innerHTML = "No Items Here Yet"
    }
})

function clearShoppingListElement(){
    shoppingListElement.innerHTML=""
}

function clearInputFieldElement (){
    inputFieldElement.value = ""
}

function appendItemToShoppingListElement (item){
    let itemID = item[0]
    let itemValue = item[1]
    let newElement = document.createElement("li")
    newElement.textContent = itemValue
    newElement.addEventListener('click',function(){
        let exactLocationOfItemInDb = ref(database,`shoppingList/${itemID}`)

        remove(exactLocationOfItemInDb)
    })
    shoppingListElement.append(newElement)
}