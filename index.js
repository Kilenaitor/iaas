var base65536 = require('base65536');
var lzma = require('lzma');
var requestify = require('requestify');

var bool_array = new Array(32);
var id_array = new Array(32);
var raw_binary = "";
var int_val;

// Run everything
run_all();


// All the helpers
function printArray() {
    array_to_int();
    int_val = parseInt(raw_binary, 2);
    console.log("Integer value: " + int_val);
    process_ids();
}

function process_ids() {
    var raw_id_string = id_array.join('');
    console.log(raw_id_string);
    raw_id_string = raw_id_string.replace(/-/g, "");
    var compressed = lzma.compress(raw_id_string);
    console.log(compressed.join(''));
    compressed = compressed.replace(" ", "");
    console.log("Compressed ID: " + compressed);
}

var count = 0;
function run_all() {
    for(var i = 0; i < 32; ++i) {
        request_bool(i).then(function(response) {
            count++;
            if(count === 32) {
                printArray();
            }
        }, function(error) {
            console.error(error);
        });
    }
}

function request_bool(index) {
    return new Promise(function(resolve, reject) {
        var ran_val = Math.random()<.5;
        requestify.request('https://api.booleans.io', {
            method: 'POST',
            body: {
                val: ran_val
            },
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        })
        .then(function(response) {
            var body = response.getBody();
            bool_array[index] = body.val;
            id_array[index] = body.id;
            resolve("Success!");
        })
        .fail(function(error) {
            reject("Error getting boolean. " + error);
        });
    });
}


function array_to_int() {
    var output = "";
    for(var index in bool_array) {
        if(bool_array[index]) {
            output = "1" + output;
        } else {
            output = "0" + output;
        }
    }
    raw_binary = output;
    console.log("Assembled binary val: " + output);
}

