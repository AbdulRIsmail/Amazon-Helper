populateElement = (id, src, title, ukPrice, usaPrice, eurPrice, host, link, div, basket) => {
    
    var list;

    // div to hold all the items
    if (basket === 'friends') {

        list = document.getElementById('friendsList');

        if (document.getElementById('friendsList') === null) {   
            list = document.createElement('div');
            list.id = 'friendsList';
        }

    } else {
        list = document.getElementById('list');

        if (document.getElementById('list') === null) {   
            list = document.createElement('div');
            list.id = 'list';
        }
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
    if (basket !== 'friends') {
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
        removeBtnImg.src = '../images/delete.svg';
        removeBtnImg.style.width = '23px';
    }

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
            collectionDiv,
            'basket');
    }
    });
});

var collection = document.getElementById('collection');
var shortcuts = document.getElementById('shortcuts');
var friends = document.getElementById('friends');

// switch between different tabs
document.addEventListener('DOMContentLoaded', () => {
    var shortcutBtn = document.getElementById('shortcutsBtn');
    var basketBtn = document.getElementById('basketBtn');
    var friendshipBtn = document.getElementById('friendshipBtn');
    var friendsBasket = document.getElementById('friendsBasket');

    let tab = 'shortcut';

    basketBtn.addEventListener('click', () => {
        showHideTab(collection, shortcuts, friends);
        tab = 'basket';
        chrome.storage.sync.set({'tab': tab});
    });

    shortcutBtn.addEventListener('click', () => {
        showHideTab(shortcuts, collection, friends);
        tab = 'shortcut';
        chrome.storage.sync.set({'tab': tab});
    });

    friendshipBtn.addEventListener('click', () => {
        showHideTab(friends, collection, shortcuts);
        tab = 'friendship';
        chrome.storage.sync.set({'tab': tab});
    });
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('tab', (items) => { 
        if (items.tab === 'basket') {
            showHideTab(collection, shortcuts, friends);
        } else if (items.tab === 'shortcut') {
            showHideTab(shortcuts, collection, friends);
        } else {
            showHideTab(friends, collection, shortcuts);
        }
    });
});

// function to hide or show tab
showHideTab = (show, hide1, hide2) => {
    show.style.display = 'block';
    hide1.style.display = 'none';
    hide2.style.display = 'none';
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

// used to listen to share button clicked
document.addEventListener('DOMContentLoaded', () => {
    // get the share button
    var shareBtn = document.getElementById('share');

    // listens to if the share button is clicked
    shareBtn.addEventListener('click', () => {
        // get items from local storage
        chrome.storage.sync.get({'Products': []}, (items) => {

            // checks if the basket is empty
            if (items.Products.length === 0) {
                alert('Basket Is Empty!')
                return;
            }

            // setting the url
            let code = '';

            // used for abbreivation
            let a = items.Products;

            // putting each item into one stirng
            for (let i = 0; i < a.length; i++) {
                code += a[i].eurPrice + '---' + a[i].ukPrice + '---' + a[i].usaPrice + '---' + a[i].host + '---' + a[i].link + '---' + a[i].productImg + '---' + a[i].productTitle + '---'
            }

            // function to copy the url to clipboard automaticaly
            copyStringToClipboard = (str) => {
                // Create new element
                var el = document.createElement('textarea');

                // Set value (string to be copied)
                el.value = str;

                // Set non-editable to avoid focus and move outside of view
                el.setAttribute('readonly', '');
                el.style = {position: 'absolute', left: '-9999px'};
                document.body.appendChild(el);

                // Select text inside element
                el.select();

                // Copy text to clipboard
                document.execCommand('copy');

                // Remove temporary element
                document.body.removeChild(el);
             }

            copyStringToClipboard(code);

            // alert the user
            var el = document.createElement("div");
            el.setAttribute("style","position:absolute; top:27%; left:5%; background-color:lightgreen; padding: 5px; font-size: 13px; text-align: center; border-radius: 3px; box-shadow: 0px 0px 17px 42px rgba(0,0,0,0.75);");
            el.innerHTML = 'Copied URL To Clipboard - Send This URL To Your Friend';
            document.body.appendChild(el);

             setTimeout(() => {
                 el.remove();
             }, 2000);

            // alert('Copied URL To Clipboard - Send This URL To Your Friend');
        });
    });
});

// used to decode the url to open friends basket
document.addEventListener('DOMContentLoaded', () => {
    var url = document.getElementById("url");
    var friendsSubmit = document.getElementById("friendsSubmit");

    // if the submit button is clicked
    friendsSubmit.addEventListener("click", () => {
        // i get the url and pass it to a function to decode the url
        decodeURL(url.value);
    });
});

decodeURL = (url) => {
    // splits the string when it sees '---'
    var newUrl = url.split('---')    

    // make a new object for the items
    var itemObj = [];

    // index to keep track
    let i = 0;

    // constructs the new item object
    while (i < newUrl.length - 7) {
        itemObj.push({
            eurPrice: newUrl[i],
            ukPrice: newUrl[i+1],
            usaPrice: newUrl[i+2],
            host: newUrl[i+3],
            url: newUrl[i+4],
            src: newUrl[i+5],
            title: newUrl[i+6],
        })
        
        i+=7;
    }

    // creates friends basket
    createFriendsBasket(itemObj);
}

createFriendsBasket = (obj) => {
    // used to check if friends basket already exist then remove before populating new one
    if (document.getElementById('friendsList')) {
        document.getElementById('friendsList').remove();
    }

    // make a copy of the items object
    var items = obj;

    // the collection div - contains all products added by user
    const friendsDiv = document.getElementById('friends');
    
    // get total price of the items
    let ukPrice = 0;
    let eurPrice = 0;
    let usaPrice = 0;

    // populates the friends products
    for (let i = 0; i < items.length; i++) {
        ukPrice += Number(items[i].ukPrice); 
        eurPrice += Number(items[i].eurPrice); 
        usaPrice += Number(items[i].usaPrice);        

        populateElement(
            Math.random().toString(36).substr(2, 20), 
            items[i].src,
            items[i].title,
            items[i].ukPrice,
            items[i].usaPrice,
            items[i].eurPrice,
            items[i].host,
            items[i].url,
            friendsDiv,
            'friends');
    }


    // update the total price for friends basket
    document.getElementById('usaPriceFriends').innerText = '$' + usaPrice.toFixed(2);
    document.getElementById('ukPriceFriends').innerText = '£' + ukPrice.toFixed(2);
    document.getElementById('eurPriceFriends').innerText = '€' + eurPrice.toFixed(2);    
}