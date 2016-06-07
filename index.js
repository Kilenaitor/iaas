var base65536 = require('base65536');
var lzstring  = require('lz-string');
var request   = require('request');

var bool_array = new Array(32);
var id_array = new Array(32);

// Run everything
run_all();


// All the helpers
function printArray() {
    array_to_int();
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
        var ran_val = Math.random()<.5
        ran_val = ran_val ? "true" : "false";
        request.post({ url: 'https://api.booleans.io', data: { 'val' : ran_val }}, function(err, httpResponse, body) {
            if(err) {
                reject(Error("Unable to get new BaaS"));
            }
            var response = JSON.parse(body);
            bool_array[index] = response.val;
            id_array[index] = response.id;
            resolve(response);
        });
    });
}


function array_to_int() {
    var output = "";
    for(var bool in bool_array) {
        if(!bool) {
            output = "1" + output;
        } else {
            output = "0" + output;
        }
    }
    console.log(output);
}

