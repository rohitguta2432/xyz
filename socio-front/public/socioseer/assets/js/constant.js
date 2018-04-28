var BASE_URL = 'http://192.168.1.12:9000/';

var API_URL = BASE_URL + 'api';
var API_PATH = 'api_admin_';
var requiredMsg = 'This field is required';
var alphabetOnlyMsg = 'Please input alphabet characters only';
var LOADER_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

var ALL_FREQUENCY = [
    {
        "id": 9,
        "frequency": "Custom"
    }, {
        "id": 20,
        "frequency": "Every twelve hour"
    }, {
        "id": 21,
        "frequency": "Every day"
    }

    /* {
        "id": 10,
        "frequency": "One per hour"
    },
    {
        "id": 11,
        "frequency": "Two per hour"
    },
    {
        "id": 12,
        "frequency": "Three per hour"
    },
    {
        "id": 13,
        "frequency": "Four per hour"
    }*/
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
    smartButtonMaxItems: 1,
    searchField: 'label'
};

var MULTIPLE_DROPDOWN_SETTING = {
    showCheckAll: false,
    showUncheckAll: false,
    keyboardControls: true,
    enableSearch: true,
    displayProp: 'label',
    checkBoxes: true,
    smartButtonMaxItems: 3,
    searchField: 'label'
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
var CLIENT_ID = '1820739561569507';
var CLIENT_SECRET = '7f892d2fbdaf6d1208f5dca3bf08a59f';