const apickli = require("apickli");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const config = require("../../../test-controller/testconfig.json");
expect = require('chai').expect;
const chai = require('chai');
const prettyJson = require('prettyjson');
const assert = chai.assert;
var rp = require("request-promise");
const jsonSchemaValidator = require('is-my-json-valid');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
chai.use(deepEqualInAnyOrder);
const {
    Before,
    Given,
    After,
    When,
    setDefaultTimeout,
    formatterHelpers
} = require("@cucumber/cucumber");

const { fail } = require("assert");
const urlSuffix = config[process.env.env].data[process.env.proxy].hostname;
const uri = config[process.env.env].data[process.env.proxy].uri;

const proxyName = config[process.env.env].data[process.env.proxy].proxyname;

console.log("\n\n environment name---", process.env.env);
console.log("\n\n proxy name---", config[process.env.env].data[process.env.proxy].proxyname);
console.log("host- -", urlSuffix);
console.log("proxy uri- ", uri, "\n\n");

Before(function () {
    this.apickli = new apickli.Apickli("https", urlSuffix + uri);
    //process.env_NODE_TLS_REJECT_UNAUTHORIZED = 'O';
})


After(function () {
    if (
        this.apickli.httpRequestOptions.body != undefined &&
        this.apickli.httpRequestOptions.body.indexOf("assertion") != -1
    ) {
        let obj = this.apickli.httpRequestOptions.body.split("assertion=");
        this.apickli.httpRequestOptions.body = obj[0] + "assertion =**** ";
    }
    if (
        this.apickli.httpResponse.body != undefined &&
        this.apickli.httpResponse.body.indexOf("access_token") != -1
    ) {
        let splitFromEnd = this.apickli.httpResponse.body.split('"expires_in"');
        let splitFromFront = this.apickli.httpResponse.body.split('access_token"."');

        this.apickli.httpResponse.body = splitFromFront[0] + 'access_token":" **** ", "expires_in"' + splitFromEnd[1];
    }
    let logStr =
        "\n\n\n ---------------------------------------API Request----------------\n" +
        JSON.stringify(this.apickli.httpRequestOptions) +
        "\n\n--------------------------------------------API Status Code-------------\n" +
        "API Response Code- " + this.apickli.httpResponse.statusCode +
        "\n\n--------------------------------------------API Response----------------\n" +
        JSON.stringify(this.apickli.httpResponse.body) +
        "\n\n--------------------------------------------API Response Headers-----------\n" +
        JSON.stringify(this.apickli.httpResponse.headers) +
        "\n----------------------------------------------------------------------------\n";
    writeLog(logStr);
});


When(/^I set request header "(.*)*" to "(.*)*"$/,
    function (headerkey, headerValue, callback) {
        this.apickli.addRequestHeader(headerkey, headerValue);
        callback();
    }
);

When(/^I set all headers for the request$/, function (callback) {
    let headers = config[process.env.env].data[process.env.proxy].headers
    for (const [key, value] of Object.entries(headers)) {
        this.apickli.addRequestHeader(key, value);
    }
    callback();
});

When(/^I set Origin header$/, function (callback) {
    this.apickli.addRequestHeader("Origin", config[process, env, env], data[process.env.proxy].Origin
    );
    callback();
});

When(/^I remove (.*) header$/, function (headerName, callback) {
    this.apickli.removeRequestHeader(headerName);
    callback();
});


When(/^I set request body$/, function (callback) {
    requestMethod = config[process.env.env].data[process.env.proxy].method;
    bodyInConfig = config[process.env.env].data[process.env.proxy].body;
    if (requestMethod == "POST" && bodyInConfig !== "") {
        this.apickli.setRequestBody(bodyInConfig);
    }
    callback();
});

Given(/^I set request body to (.*)$/, function (bodyValue, callback) {
    this.apickli.setRequestBody(bodyValue);
    callback();
});

Given(/^I set contents of file (.*) to request body$/, function (bodyfile, callback) {

    const schemaPath = "./test-controller/requestBodyTemplate/" + bodyfile + ".schema";
    fs.readFile(path.join(schemaPath), 'utf8', function (err, jsonSchemaString) {
        if (err) {
            assert.fail("expected file not found:", filePath);
        } else {
            this.apickli.pipeFileContentsToRequestBody(file, function (error) {
                if (error) {
                    callback(new Error(error));
                }
            });
        }
    });
});

Given(/^I set request query parameters to$/, function (queryParameters, callback) {
    this.apickli.setQueryParameters(queryParameters.hashes());
    callback();
});


Given(/^I append basic authentication credentials$/, function (callback) {
    const username = config[process.env.env].data[process.env.proxy].security.clientID;
    const password = config[process.env.env].data[process.env.proxy].security.clientSecret;

    this.apickli.addHttpBasicAuthorizationHeader(username, password);
    callback();
});


Given(/^I attach (.+) client TLS configuration$/, function (configurationName, callback) {

    this.apickli.clientTLSConfig = {
        valid: {
            key: config[process.env.env].data[process.env.proxy].security.key,
            cert: config[process.env.env].data[process.env.proxy].security.cert
        }
    }
    this.apickli.setClientTLSConfiguration(configurationName, function (error) {
        if (error) {
            callback(new Error(error));
        }
        callback();
    });
});


When(/^I invoke the endpoint (.*)$/, function (resource, callback) {
    requestMethod = config[process.env.env].data[process.env.proxy].method;

    if (requestMethod == "GET") {
        this.apickli.get(resource, function (error, response) {
            if (error) {
                callback(new Error(error));
            }
            callback();
        });
    } else if (requestMethod == "POST") {
        this.apickli.post(resource, function (error, response) {
            if (error) {
                callback(new Error(error));
            }
            callback();
        });
    }
});


When(/^validate response code should be (.*)$/, function (responseCode, callback) {
    const realResponseCode = this.apickli.getResponseObject().statusCode.toString();
    expect(responseCode).to.equal(realResponseCode);
    callback();
});

Given(/^validate response header "(.*)*" should exist$/, function (header, callback) {
    const success = typeof this.apickli.getResponseObject().headers[header.toLowerCase()] != 'undefined';
    callback();
});

Given(/^validate response header "(.*)*" should not exist$/, function (header, callback) {
    const assertion = this.apickli.assertResponseContainsHeader(header);
    assertion.success = !assertion.success;
    callbackWithAssertion(callback, assertion);
});


When(/^validate response body should contain "(.*)*"$/, function (expression, callback) {
    const assertion = this.apickli.assertResponseBodyContainsExpression(expression);
    callbackWithAssertion(callback, assertion);
});

When(/^validate response body should not contain "(.*)*"$/, function (expression, callback) {
    const assertion = this.apickli.assertResponseBodyContainsExpression(expression);
    assertion.success = !assertion.success;
    callbackWithAssertion(callback, assertion);
});

Given(/^I store the value (.*) as (.*) in a variable$/, function (value, variable, callback) {
    this.apickli.storeValueInScenarioScope(variable, value);
    callback();
});



When(/^Validate response structure with "(.*)*" template$/, function (schemafile, callback) {
    responseBody = JSON.parse(this.apickli.getResponseObject().body);
    const filePath = "./test-controller/responseSchemaTemplate/" + schemafile + ".schema";

    fs.readFile(path.join(filePath), "utf8", function (err, jsonSchemaString) {
        if (err) {
            assert.fail("expected file not found:", filePath);
        } else {
            try {
                jsonSchema = JSON.parse(jsonSchemaString);
            } catch (e) {
                assert.fail("invalid expected response schema:", filePath);
            }
            compResponse = _.isEqual(jsonSchema, responseBody);
            if (compResponse == true) {
                callback();
            } else {
                assert.fail(
                    "expected response :" +
                    JSON.stringify(jsonSchema) +
                    "is not matching with actual response:" +
                    JSON.stringify(responseBody)
                );
            }
            callback();
        }
    });
});

When(/^validate response body should be valid according to schema "(.*)*" file$/, function (schemaFile, callback) {
    const schemaPath = "./test-controller/responseSchemaTemplate/" + schemaFile + ".schema";
    const responseBody = JSON.parse(this.apickli.getResponseObject().body);

    fs.readFile(path.join(schemaPath), 'utf8', function (err, jsonSchemaString) {
        if (err) {
            assert.fail("expected file not found:", filePath);
        } else {
            const jsonSchema = JSON.parse(jsonSchemaString);
            const validate = jsonSchemaValidator(jsonSchema, { verbose: true });
            const success = validate(responseBody);
            console.log("success", success);
            if (success == true) {
                callback();
            } else {
                assert.fail("response is not matching with schema");
            }
            callback();
        }
    });
});



When(/^Validate Access-Control-Allow-Origin response header value is same as Origin in request header$/, function (callback) {
    apiResponseHeaders = this.apickli.httpResponse.headers;
    var accessControlAllowOrigin = apiResponseHeaders['access-control-allow-origin'];
    var originHeaderValue = config[process.env.env].data[process.env.proxy].Origin;
    expect(accessControlAllowOrigin).to.equal(originHeaderValue);
    callback();
});


When(/^prepare execution html report$/, function (callback) {

    var reporter = require("cucumber-html-reporter");
    var options = {
        theme: 'bootstrap',
        jsonFile: './reports/report.json',
        output: './reports/cucumber_report.html',
        reportSuiteAsScenarios: false,
        scenarioTimestamp: true,
        launchReport: true,
        metadata: {
            "App Version": "0.3.2",
            "Test Environment": "Update Test env",
            "Browser": "N/A",
            "Platform": "Update",
            "Parallel": "Scenarios",
            "Executed": "Jenkins"
        }
    };
    reporter.generate(options);
    callback();
});



function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date(), getTime();
    }
}


const stepContext = {};

const prettyPrintJson = function (json) {
    const output = {
        stepContext,
        testOutput: json,
    };

    return prettyJson.render(output, {
        noColor: true,
    });
};

const callbackWithAssertion = function (callback, assertion) {
    if (assertion.success) {
        callback();
    } else {
        callback(prettyPrintJson(assertion));
    }
};

function writeLog(str) {
    return new Promise(function (resolve, reject) {
        fs.appendFile("./reports/executionLog.txt", str, function (err) {
            if (err) {
                return reject("Unexpected response");
            } else {
                return resolve("true");
            }
        });
    });
}

setDefaultTimeout(60 * 1000);