var ukPrice; // uk price of the item
var eurPrice; // euro price of the item
var usaPrice; // dollar price of the item

var price; // formats the original price - removes the £ sign
var priceDiv; // div container for the price tag
var convertedPrice; // euro price
var poundToEuroRate = 1.1548; // the rate for 1 pound to euro
var poundToDollarRate = 1.2991; // the rate for 1 pound to dollar

// amazon have two ways of displaying their price
var tagsName = ['priceblock_dealprice', 'priceblock_ourprice'];

// formats the price
formatPrice = (tag) => {
    // create a temporary price variable and copy the price into it
    price = document.getElementById(tag).innerHTML;

    // split each character and convert into array
    price = price.split('');

    // remove the first element (£)
    price.shift();

    // join the array back together to form a string
    price = price.join("");
    ukPrice = price;
}

// converts the price
poundToEuro = () => {
    var tempPrice = poundToEuroRate * price;
    eurPrice = tempPrice.toFixed(2);

    var tempPrice = poundToDollarRate * price;
    usaPrice = tempPrice.toFixed(2);
}

// displays the euro price underneath the uk price
createEuroTag = (tag) => {
    // create div
    priceDiv = document.createElement('div');

    // set the id for the div
    priceDiv.id = 'priceInEuro';

    // create a paragraph tag
    convertedPrice = document.createElement('p');

    // set the text of the paragraph 
    convertedPrice.innerHTML = "Price In Euros: €" + eurPrice;

    // append the div (price) underneath the actual price from amazon
    document.getElementById(tag).appendChild(priceDiv);

    // append the paragraph (convertedPrice) inside the div (price)
    document.getElementById(priceDiv.id).appendChild(convertedPrice);
}

createCollectionBtn = (tag) => {
    // creates div 
    collectionDiv = document.createElement('div');

    // set the id for collectionDiv
    collectionDiv.id = 'collection-amazonHelper';

    // creates button
    collectionBtn = document.createElement('button');

    // set the id of the button
    collectionBtn.id = 'collection-amazonHelper-button';

    // change the text of the button
    collectionBtn.innerHTML = 'Add To Collection';

    // append the collectionDiv underneath the amazon price
    document.getElementById(tag).appendChild(collectionDiv);

    // append the button to the div
    document.getElementById(collectionDiv.id).appendChild(collectionBtn);
}

tagsName.forEach((tag) => {
    if (document.getElementById(tag)) {
        formatPrice(tag);
        poundToEuro();
        createEuroTag(tag);
        createCollectionBtn(tag);
    }
});

// used to add product to the collection list
createProduct = () => {    
    // creating the elements for each product
    var productInfo = document.createElement('div');
    var productImg = document.createElement('img');
    var productTitle = document.createElement('p');
    var productPrice = document.createElement('p');

    // setting the class names
    productInfo.className = 'productInfo';
    productImg.className = 'productImg';
    productTitle.className = 'productTitle';
    productPrice.className = 'productPrice';

    // appending all product info inside the productInfo div
    productInfo.appendChild(productImg);
    productInfo.appendChild(productTitle);
    productInfo.appendChild(productPrice);

    // set the information for the product
    productImg.src = document.querySelector('#landingImage').src;
    productTitle.innerText = document.querySelector('#productTitle').innerText;
    productPrice.innerText = '£' + ukPrice;

    // object of the product information
    const productData = {
        'id': Math.random().toString(36).substr(2, 20),
        'productImg':  productImg.src, 
        'productTitle': productTitle.innerText, 
        'ukPrice': ukPrice,
        'eurPrice': eurPrice,
        'usaPrice': usaPrice
    };

    // when user clicks add to collection
    // this saves to chromes local storage
    chrome.storage.sync.get({'Products': []}, (items) => {
        var tempArray = items.Products;
        tempArray.push(productData);
        chrome.storage.sync.set({'Products': tempArray});
    })
}

// listens to if the collection button is clicked then add button to basket
document.getElementById("collection-amazonHelper-button").addEventListener("click", () => {
    createProduct();
});
