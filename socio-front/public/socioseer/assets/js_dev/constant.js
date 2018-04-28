var BASE_URL = 'http://192.168.1.35:9000/';
var API_URL = BASE_URL + 'api';
var API_PATH = 'api_admin_';
var requiredMsg = 'This field is required';
var alphabetOnlyMsg = 'Please input alphabet characters only';
var LOADER_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
var ALL_FREQUENCY = [{
        "id": 9,
        "frequency": "Custom"
    }, {
        "id": 20,
        "frequency": "Every twelve hour"
    }, {
        "id": 21,
        "frequency": "Every day"
    }

];



var SINGLE_CLIENT_DROPDOWN = {
    showCheckAll: false,
    showUncheckAll: false,
    selectionLimit: 1,
    keyboardControls: true,
    enableSearch: true,
    displayProp: 'label',
    checkBoxes: false,
    closeOnSelect: true,
    smartButtonMaxItems: 1
};

var MULTIPLE_DROPDOWN_SETTING = {
    showCheckAll: false,
    showUncheckAll: false,
    keyboardControls: true,
    enableSearch: true,
    displayProp: 'label',
    checkBoxes: true,
    smartButtonMaxItems: 3
};

var SCROLL_CONFIG = {
    autoHideScrollbar: true,
    theme: 'minimal-dark',
    axis: 'y',
};
var BODY_SCROLL_CONFIG = {
    autoHideScrollbar: true,
    theme: 'minimal-dark',
    axis: 'y',
    scrollInertia: 50,
};



/**facebook credentials*/
/*var CLIENT_ID = '1820739561569507';
var CLIENT_SECRET = '7f892d2fbdaf6d1208f5dca3bf08a59f';*/

/* var CLIENT_ID = '2002018840017864';
var CLIENT_SECRET = '665ddc7dd94dfa86a2485ebb2af87bd9'; */


var CLIENT_ID = '308523929619013';
var CLIENT_SECRET = 'ad4e5d72f1dc7106b2e8e5ad045b4fd8';