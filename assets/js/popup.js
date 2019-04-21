populateElement = (id, src, title, ukPrice, usaPrice, eurPrice, host, link, div) => {
    // div to hold all the items
    var list = document.getElementById('list');

    if (document.getElementById('list') === null) {   
        list = document.createElement('div');
        list.id = 'list';
    }

    // creating the elements for each product
    var productInfo = document.createElement('div');
    var productImg = document.createElement('img');
    var productTitle = document.createElement('p');
    var productPrice = document.createElement('p');
    var usaProductPrice = document.createElement('p');
    var eurProductPrice = document.createElement('p');
    var removeBtnImg = document.createElement('img');
    var containerInfo = document.createElement('div');
    var containerImg = document.createElement('div');
    var linkImg = document.createElement('img');

    // setting the class names
    productInfo.className = 'productInfo';
    productImg.className = 'productImg';
    productTitle.className = 'productTitle';
    productPrice.className = 'productPrice';
    usaProductPrice.className = 'usaProductPrice';
    eurProductPrice.className = 'eurProductPrice';
    removeBtnImg.className = 'removeImg';
    containerInfo.className = 'containerInfo';
    containerImg.className = 'containerImg';
    linkImg.className =  'linkImg';

    // event listener for when i want to remove a product from the basket
    removeBtnImg.addEventListener('click', function(){
        chrome.storage.sync.get({'Products': []}, (items) => {
            // make a temporary array of the items.Products
            var tempArr = items.Products;            
            
            // remove the product using the id
            let newArray = tempArr.filter(element => element.id !== id);

            // set the new chrome storage with the tempArr
            chrome.storage.sync.set({'Products': newArray});

            // get prices of total items
            var oldUkPrice = ukPriceTag.innerText;
            var oldUsaPrice = usaPriceTag.innerText;
            var oldEurPrice = eurPriceTag.innerText;            

            // get prices of the item
            var ukPriceItem = this.parentElement.childNodes[1].innerText;
            var usaPriceItem = this.parentElement.childNodes[3].innerText;
            var eurPriceItem = this.parentElement.childNodes[4].innerText;

            // format the price to remove the sign
            ukPriceItem = ukPriceItem.slice(1);
            usaPriceItem = usaPriceItem.slice(1);
            eurPriceItem = eurPriceItem.slice(1);
            oldUkPrice = oldUkPrice.slice(1);
            oldUsaPrice = oldUsaPrice.slice(1);
            oldEurPrice = oldEurPrice.slice(1);

            // take away the money from the main divs
            oldUkPrice -= ukPriceItem;
            oldUsaPrice -= usaPriceItem;
            oldEurPrice -= eurPriceItem;

            ukPriceTag.innerText = '£' + oldUkPrice.toFixed(2);
            usaPriceTag.innerText = '$' + oldUsaPrice.toFixed(2);
            eurPriceTag.innerText = '€' + oldEurPrice.toFixed(2);

            // remove the element using the id
            productInfo.className += ' deleteProduct'
            setTimeout(() => {
                document.getElementById(id).remove();
            }, 300)          
        });
    });

    // setting id of the div
    productInfo.id = id;

    // create link tag
    var linkTag = document.createElement('a');
    linkTag.href = link;    
    linkTag.target = '_blank';

    // appending all product info inside the productInfo div
    containerImg.appendChild(productImg);
    containerInfo.appendChild(productTitle);
    containerInfo.appendChild(productPrice);
    containerInfo.appendChild(removeBtnImg);
    containerInfo.appendChild(linkImg);
    containerInfo.appendChild(usaProductPrice);
    containerInfo.appendChild(eurProductPrice);
    linkTag.appendChild(linkImg);
    containerInfo.appendChild(linkTag);
    productInfo.appendChild(containerImg);
    productInfo.appendChild(containerInfo);
    list.appendChild(productInfo);

    // only use first 10 words of the title
    var res = title.split(/\s+/).slice(0,10).join(" ");    

    // set the information for the product
    productImg.src = src;
    productTitle.innerText = res;
    productPrice.innerText = '£' + ukPrice;
    usaProductPrice.innerText = '$' + usaPrice;
    eurProductPrice.innerText = '€' + eurPrice;
    removeBtnImg.src = '../images/delete.svg';
    removeBtnImg.style.width = '23px';
    linkImg.style.width = '24px';
    
    if (host === 'us') {
        linkImg.src = '../images/united-states.svg';
    } else {
        linkImg.src = '../images/united-kingdom.svg';
    }

    div.appendChild(list);
}

document.addEventListener('DOMContentLoaded', () => {
    // the collection div - contains all products added by user
    const collectionDiv = document.getElementById('collection');

    // getting the information from chrome storage
    chrome.storage.sync.get({'Products': []}, (items) => { 
                
    // length of how many products i have
    var productLen = items.Products.length;

    // populates the products
    for (let i = 0; i < productLen; i++) {
        populateElement(
            items.Products[i].id, 
            items.Products[i].productImg,
            items.Products[i].productTitle,
            items.Products[i].ukPrice,
            items.Products[i].usaPrice,
            items.Products[i].eurPrice,
            items.Products[i].host,
            items.Products[i].link,
            collectionDiv);
    }
    });
});

var collection = document.getElementById('collection');
var shortcuts = document.getElementById('shortcuts');

// switch between different tabs
document.addEventListener('DOMContentLoaded', () => {
    var shortcutBtn = document.getElementById('shortcutsBtn');
    var basketBtn = document.getElementById('basketBtn');

    let tab = 'shortcut';

    basketBtn.addEventListener('click', () => {
        showHideTab(collection, shortcuts);
        tab = 'basket';
        chrome.storage.sync.set({'tab': tab});
    });

    shortcutBtn.addEventListener('click', () => {
        showHideTab(shortcuts, collection);
        tab = 'shortcut';
        chrome.storage.sync.set({'tab': tab});
    });
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('tab', (items) => { 
        if (items.tab === 'basket') {
            showHideTab(collection, shortcuts);
        } else {
            showHideTab(shortcuts, collection);
        }
    });
});

// function to hide or show tab
showHideTab = (show, hide) => {
    show.style.display = 'block';
    hide.style.display = 'none';
}


// clear basket
document.addEventListener('DOMContentLoaded', () => {
    var clearBtn = document.getElementById('clear');    

    clearBtn.addEventListener('click', () => {
        var list = document.getElementById('list');

        ukPriceTag.innerText = '£0.00';
        usaPriceTag.innerText = '$0.00';
        eurPriceTag.innerText = '€0.00';

        // remove the div list 
        list.remove();

        // remove all products from chrome storage
        chrome.storage.sync.get({'Products': []}, (items) => {
            
            // new empty array
            var tempArr = [];

            // set the chrome storage to remove all previous data
            chrome.storage.sync.set({'Products': tempArr});
        });
    });
});

// divs of all the prices displayed
var usaPriceTag = document.getElementById('usaPrice');
var ukPriceTag = document.getElementById('ukPrice');
var eurPriceTag = document.getElementById('eurPrice');

// calculate and display price
document.addEventListener('DOMContentLoaded', () => {
    // stores total price for each currency
    let uk = 0;
    let usa = 0;
    let eur = 0;

    chrome.storage.sync.get({'Products': []}, (items) => {
        if (items.Products.length >= 1) {
            for (let i = 0; i < items.Products.length; i++) {
                uk += Number(items.Products[i].ukPrice);
                usa += Number(items.Products[i].usaPrice);
                eur += Number(items.Products[i].eurPrice);
            }

            // display the values 
            usaPriceTag.innerText = '$' + usa.toFixed(2);
            ukPriceTag.innerText = '£' + uk.toFixed(2);
            eurPriceTag.innerText = '€' + eur.toFixed(2); 
        }
    });
});