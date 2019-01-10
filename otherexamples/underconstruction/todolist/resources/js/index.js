
var toDoList = $('#toDo');
var doneList = $('#done');
var inputElem = $('#inputItem');
var removeIcon = '<img src="https://iconsplace.com/wp-content/uploads/_icons/ffffff/256/png/minus-2-icon-18-256.png" class="remove" alt="Remove">';
var doneIcon = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/White_check.svg/1024px-White_check.svg.png" class="done" alt="DONE!">';
var highlightedList = $('.listItem')
var counter= 0;

$('#addInput').on('click', function(e) {
    e.stopPropagation();
    var inputValue = inputElem.val();
    if (inputValue) {
        addItemToDoList(inputValue);

    }
})

$(document).on('keypress', function(e) {
    var inputValue = inputElem.val();
    if (inputValue) {
        if (e.which == 13) {
            addItemToDoList(inputValue);
        }
    }
})

// function getItems() {
//     for (i = 1; i < localStorage.getItem('doIt${i}').length; i++) {
//         console.log(localStorage.getItem(`doIt${i}`));
//         console.log(localStorage.getItem(`doIt${i}`));
//         addItemToDoList(localStorage.getItem(`doIt${i}`));
//     }
// }
//
// getItems();

function addItemToDoList(inputValue) {
    console.log(inputValue);
    counter ++;
    localStorage.setItem(`doIt${counter}`, JSON.stringify(inputValue));
    inputElem.val(null);
    var str = `<li class="listItem">${inputValue}           ${removeIcon} ${doneIcon}</li>`;
    toDoList.append(str);
    $('.remove').one('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        console.log('REMOVE');
        var parentOfHighlightedItem = $(e.target).parent();
        completelyRemoveItem(parentOfHighlightedItem);
    });
    $('.done').one('click.removeAfterFirstClick', function(e) {
        $(e.target).off('.removeAfterFirstClick');
        e.stopPropagation();
        e.preventDefault();
        var parentOfHighlightedItem = $(e.target).parent();
        console.log('done!::' + parentOfHighlightedItem);
        completelyRemoveItem(parentOfHighlightedItem);
        addItemToDoneList(parentOfHighlightedItem);
    });
}



function completelyRemoveItem(listItem) {
    listItem.remove();
    console.log(localStorage.removeItem('doIt'));
    localStorage.removeItem('doIt');
}

function addItemToDoneList(doneItem) {
    console.log('doneItem ::' + doneItem);
    var str = `<li class="listItem">${doneItem.text()}</li>`;
    doneList.append(str);
    alert('wohooo!');
}


function addItemToRemoveList() {

}
