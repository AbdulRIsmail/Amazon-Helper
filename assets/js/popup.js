populateElement = (id, src, title, price, div) => {
    // Collection Variables
    var productInfo;
    var productImg;
    var productTitle;
    var productPrice;
    var removeBtnImg;
    var containerInfo;
    var containerImg;

    // creating the elements for each product
    productInfo = document.createElement('div');
    productImg = document.createElement('img');
    productTitle = document.createElement('p');
    productPrice = document.createElement('p');
    removeBtnImg = document.createElement('img');
    containerInfo = document.createElement('div');
    containerImg = document.createElement('div');


    // setting the class names
    productInfo.className = 'productInfo';
    productImg.className = 'productImg';
    productTitle.className = 'productTitle';
    productPrice.className = 'productPrice';
    removeBtnImg.className = 'removeImg';
    containerInfo.className = 'containerInfo';
    containerImg.className = 'containerImg';

    // used to remove element if needed
    productInfo.id = id;

    // appending all product info inside the productInfo div
    containerImg.appendChild(productImg);
    containerInfo.appendChild(productTitle);
    containerInfo.appendChild(productPrice);
    containerInfo.appendChild(removeBtnImg);
    productInfo.appendChild(containerImg);
    productInfo.appendChild(containerInfo);

    // only use first 20 words of the title
    var res = title.split(/\s+/).slice(0,10).join(" ");

    // set the information for the product
    productImg.src = src;
    productTitle.innerText = res;
    productPrice.innerText = price;
    removeBtnImg.src = '../images/delete.svg';
    removeBtnImg.style.width = '20px';

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

        removeItem();
    });
});

// removes item from the collection
removeItem = () => {
    var len = document.getElementsByClassName('removeImg');

    // loops through to check what element i clicked on
    for(var i = 0; i < len.length; i++) {
        ((i) => {
        len[i].addEventListener("click", () => {
            console.log("Clicked index: " + i);
            })
        })(i);
    }
}