populateElement = (id, src, title, price, div) => {
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
    var removeBtnImg = document.createElement('img');
    var containerInfo = document.createElement('div');
    var containerImg = document.createElement('div');


    // setting the class names
    productInfo.className = 'productInfo';
    productImg.className = 'productImg';
    productTitle.className = 'productTitle';
    productPrice.className = 'productPrice';
    removeBtnImg.className = 'removeImg';
    containerInfo.className = 'containerInfo';
    containerImg.className = 'containerImg';

    // event listener for when i want to remove a product from the basket
    removeBtnImg.addEventListener('click', function(){
        chrome.storage.sync.get({'Products': []}, (items) => {
            // make a temporary array of the items.Products
            var tempArr = items.Products;            
            
            // remove the product using the id
            let newArray = tempArr.filter(element => element.id !== id);

            // set the new chrome storage with the tempArr
            chrome.storage.sync.set({'Products': newArray});

            // remove the element using the id
            document.getElementById(id).remove();          
        });
    })

    // setting id of the div
    productInfo.id = id;

    // appending all product info inside the productInfo div
    containerImg.appendChild(productImg);
    containerInfo.appendChild(productTitle);
    containerInfo.appendChild(productPrice);
    containerInfo.appendChild(removeBtnImg);
    productInfo.appendChild(containerImg);
    productInfo.appendChild(containerInfo);
    list.appendChild(productInfo);

    // only use first 10 words of the title
    var res = title.split(/\s+/).slice(0,10).join(" ");

    // set the information for the product
    productImg.src = src;
    productTitle.innerText = res;
    productPrice.innerText = price;
    removeBtnImg.src = '../images/delete.svg';
    removeBtnImg.style.width = '23px';

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
            items.Products[i].productPrice,
            collectionDiv);
    }
    });
});

// switch between different tabs
document.addEventListener('DOMContentLoaded', () => {
    var shortcutBtn = document.getElementById('shortcutsBtn');
    var basketBtn = document.getElementById('basketBtn');
    var collection = document.getElementById('collection');
    var shortcuts = document.getElementById('shortcuts');

    basketBtn.addEventListener('click', () => {
        collection.style.display = 'block';
        shortcuts.style.display = 'none';
    });

    shortcutBtn.addEventListener('click', () => {
        collection.style.display = 'none';
        shortcuts.style.display = 'block';
    });
});


// clear basket
document.addEventListener('DOMContentLoaded', () => {
    var clearBtn = document.getElementById('clear');    

    clearBtn.addEventListener('click', () => {
        var list = document.getElementById('list');

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

