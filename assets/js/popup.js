// global variables
var price;
var priceDiv;
var convertedPrice;
var poundToEuroRate = 1.15674;

// amazon have two ways of displaying their price
var tagsName = ['priceblock_dealprice', 'priceblock_ourprice'];

// displays the euro price underneath the uk price
createEuroTag = (tag) => {
    // create div
    priceDiv = document.createElement('div');

    // set the id for the div
    priceDiv.id = 'priceInEuro';

    // create a paragraph tag
    convertedPrice = document.createElement('p');

    // set the text of the paragraph 
    convertedPrice.innerHTML = "Price In Euros: " + price;
    
    // append the div (price) underneath the actual price from amazon
    document.getElementById(tag).appendChild(priceDiv);

    // append the paragraph (convertedPrice) inside the div (price)
    document.getElementById(priceDiv.id).appendChild(convertedPrice);
}

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
}

// converts the price
poundToEuro = () => {
    var tempPrice = poundToEuroRate * price;
    price = tempPrice.toFixed(2);
}

tagsName.forEach((tag) => {
    if (document.getElementById(tag)) {
        formatPrice(tag);
        poundToEuro();
        createEuroTag(tag);
    }
});