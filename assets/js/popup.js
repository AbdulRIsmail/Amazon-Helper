populateElement = (id, src, title, price, div) => {
    // Collection Variables
    var productInfo;
    var productImg;
    var productTitle;
    var productPrice;

    // creating the elements for each product
    productInfo = document.createElement('div');
    productImg = document.createElement('img');
    productTitle = document.createElement('p');
    productPrice = document.createElement('p');

    // setting the class names
    productInfo.className = 'productInfo';
    productImg.className = 'productImg';
    productTitle.className = 'productTitle';
    productPrice.className = 'productPrice';

    // used to remove element if needed
    productInfo.id = id;

    // appending all product info inside the productInfo div
    productInfo.appendChild(productImg);
    productInfo.appendChild(productTitle);
    productInfo.appendChild(productPrice);

    // set the information for the product
    productImg.src = src;
    productTitle.innerText = title;
    productPrice.innerText = price;

    div.appendChild(productInfo);
}

document.addEventListener('DOMContentLoaded', () => {
    // the collection div - contains all products added by user
    const collectionDiv = document.getElementById('collection');

    // getting the information from chrome storage
    chrome.storage.sync.get({'Products': []}, (items) => {
        // length of how many products i have
        var productLen = items.Products.length;

        // add an id to each product object
        for (let i = 0; i < productLen; i++) {
                items.Products[i].id = i;
        }

        // populates the products
        for (let i = 0; i < productLen; i++) {
            populateElement(
                items.Products[i].id, 
                items.Products[i].productImg,
                items.Products[i].productTitle,
                items.Products[i].productPrice,
                collectionDiv);
        }
    });
});
