const collectionDiv = document.getElementById('collection');

createCollectionClass = () => {
    var collectionInfo = document.createElement('div');
    collectionInfo.className = 'info';

    var infoTitle = document.createElement('p');
    infoTitle.className = 'title';
    infoTitle.innerText = 'hello';

    var infoUkPrice = document.createElement('p');
    infoUkPrice.className = 'ukPrice';
    infoTitle.innerText = 'hello';
    
    var infoEURPrice = document.createElement('p');
    infoEURPrice.className = 'eurPrice';
    infoTitle.innerText = 'hello';

    document.getElementsByClassName(collectionInfo.className).appendChild(infoTitle);
    document.getElementsByClassName(collectionInfo.className).appendChild(infoUkPrice);
    document.getElementsByClassName(collectionInfo.className).appendChild(infoEURPrice);
    document.getElementById('collection').appendChild(collectionInfo);
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button').addEventListener('click', () => {
        createCollectionClass();
    });      
});