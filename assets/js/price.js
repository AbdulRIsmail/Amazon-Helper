var itemPrice; // uk price of the item
var ukToEuroConverted; // euro price of the item
var ukToUsaConverted; // dollar price of the item
var dollarToUkConverted;
var dollarToEurConverted;
var euroToDollarConverted;
var euroToUkConverted;


var price; // formats the original price - removes the £ sign
var priceDiv; // div container for the price tag
var convertedPrice; // euro price
const poundToEuroRate = 1.1548; // the rate for 1 pound to euro
const poundToDollarRate = 1.2991; // the rate for 1 pound to dollar
const dollarToEuroRate = 0.88890;
const dollarToPoundRate = 0.76976;
const euroToDollarRate = 1.12585;
const euroToPoundRate = 0.867303;

// amazon have two ways of displaying their price
var tagsName = ['priceblock_dealprice', 'priceblock_ourprice'];

// formats the price
formatPrice = (tag, host) => {
    // create a temporary price variable and copy the price into it
    price = document.getElementById(tag).innerHTML;

    if (host === 'international') {
        // formats amazons international websites
        price = price.split('EUR ');
        price = price.join("");
        price = price.split('');

        for (let i = 0; i < price.length; i++) {
            if (price[i] === ',') {                
                price[i] = '.';
            }        
        }

        price = price.join("");
        
        itemPrice = price;
    } else {
        console.log(price);
        
        // split each character and convert into array
        price = price.split('');

        // remove the first element (£ or $)
        price.shift();

        // join the array back together to form a string
        price = price.join("");
        console.log(price);
        itemPrice = price;
    }
}

convertPrices = () => {
    // convert prices
    var tempPrice = poundToDollarRate * price;
    ukToUsaConverted = tempPrice.toFixed(2);

    var tempPrice = poundToEuroRate * price;
    ukToEuroConverted = tempPrice.toFixed(2);

    var tempPrice = dollarToPoundRate * price;
    dollarToUkConverted = tempPrice.toFixed(2);

    var tempPrice = dollarToEuroRate * price;
    dollarToEurConverted = tempPrice.toFixed(2);

    var tempPrice = euroToDollarRate * price;
    euroToDollarConverted = tempPrice.toFixed(2);
    
    var tempPrice = euroToPoundRate * price;
    euroToUkConverted = tempPrice.toFixed(2);
}

// displays the euro price underneath the uk price
createPriceTag = (tag, hostname) => {
    convertPrices();

    // create div
    priceDiv = document.createElement('div');

    // set the id for the div
    priceDiv.id = 'priceInEuro';

    // create a paragraph tag
    convertedPrice = document.createElement('p');

    // set the text of the paragraph 
    if (hostname === 'uk') {
        convertedPrice.innerHTML = "€" + ukToEuroConverted + '<br>' +  '$' + ukToUsaConverted;
    } 
    
    if (hostname === 'us') {
        convertedPrice.innerHTML = "£" + dollarToUkConverted + '<br>' +  '€' + dollarToEurConverted;
    }

    if (hostname === 'international') {
        convertedPrice.innerHTML = "$" + euroToDollarConverted + '<br>' +  '£' + euroToUkConverted;
    }

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
    collectionBtn.innerHTML = 'Add To Basket';

    // append the collectionDiv underneath the amazon price
    document.getElementById(tag).appendChild(collectionDiv);

    // append the button to the div
    document.getElementById(collectionDiv.id).appendChild(collectionBtn);
}


tagsName.forEach((tag) => {
    if (document.getElementById(tag)) {
        if (window.location.hostname === 'www.amazon.co.uk') {
            formatPrice(tag, 'uk');
            createPriceTag(tag, 'uk');   
        } else if (window.location.hostname === 'www.amazon.com') {
            formatPrice(tag, 'us');
            createPriceTag(tag, 'us');
        } else {
            formatPrice(tag, 'international');
            createPriceTag(tag, 'international');
        }

        createCollectionBtn(tag);
    }
});

// used to add product to the collection list
createProduct = (hostname) => {    
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

    // get link of the website
    var origin = window.location.origin;
    var pathname = window.location.pathname;


    // object of the product information
    const productData = {
        'id': Math.random().toString(36).substr(2, 20),
        'productImg':  productImg.src, 
        'productTitle': productTitle.innerText, 
        'ukPrice': '',
        'eurPrice': '',
        'usaPrice': '',
        'link': origin + '' + pathname,
        'host': hostname
    };


    // set the prices of the product data according to the 
    if (hostname === 'uk') {
        productData.ukPrice = itemPrice;
        productData.eurPrice = ukToEuroConverted;
        productData.usaPrice = ukToUsaConverted;
    } else if (hostname === 'usa') {
        productData.ukPrice = dollarToUkConverted;
        productData.eurPrice = dollarToEurConverted;
        productData.usaPrice = itemPrice;
    } else {
        productData.ukPrice = euroToUkConverted;
        productData.eurPrice = itemPrice;
        productData.usaPrice = euroToDollarConverted;
    }

    // when user clicks add to collection
    // this saves to chromes local storage
    chrome.storage.sync.get({'Products': []}, (items) => {
        var tempArray = items.Products;
        tempArray.push(productData);
        chrome.storage.sync.set({'Products': tempArray});
    })
}

// listens to if the collection button is clicked then add button to basket
if (document.getElementById("collection-amazonHelper-button")) {
    document.getElementById("collection-amazonHelper-button").addEventListener("click", () => {
        // animation to show product was added
        var slideDown = document.createElement('h4');
        var collectionBtn = document.getElementById('collection-amazonHelper');
        collectionBtn.appendChild(slideDown);
    
        slideDown.id = 'slideDown';
        slideDown.innerText = 'Added To Basket!';
    
        setInterval(() => {
            slideDown.remove();
        }, 800);

        if (window.location.hostname === 'www.amazon.com') {
            createProduct('us');   
        } else if (window.location.hostname === 'www.amazon.co.uk') {
            createProduct('uk');   
        } else if (window.location.hostname === 'www.amazon.it') {
            createProduct('it');
        } else if (window.location.hostname === 'www.amazon.fr') {
            createProduct('fr');
        } else if (window.location.hostname === 'www.amazon.de') {
            createProduct('de');
        }
    });
}