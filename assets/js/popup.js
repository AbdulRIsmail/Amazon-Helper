var tagsName = ['priceblock_dealprice', 'priceblock_ourprice'];

tagsName.forEach((tag) => {
    if (document.getElementById(tag)) {
        var price = document.createElement('div');
        var convertedPrice = document.createElement('p');
        convertedPrice.innerHTML = 'Price In Euro: €269.99';
    
        price.id = 'priceInEuro';
        document.getElementById(tag).appendChild(price);
        document.getElementById('priceInEuro').appendChild(convertedPrice);
    }
});