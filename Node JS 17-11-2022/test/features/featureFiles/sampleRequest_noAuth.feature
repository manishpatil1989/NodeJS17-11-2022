Feature: Sample feature which help, how to prepare a API request with all required combination


    Scenario: Preapre request with headers
        When I set all headers for the request
        And I set request header "Accept" to "application/json"
        And I set request header "Content-Type" to "application/json"
        And I invoke the endpoint /
        Then validate response code should be 200


    Scenario: Preapre request with headers and query params
        When I set all headers for the request
        And I set request header "Accept" to "application/json"
        And I set request header "Content-Type" to "application/json"
        And I set request query parameters to
            | parameters      | value |
            | x-tst-client-id | "aaa" |
        And I invoke the endpoint /
        Then validate response code should be 200


    Scenario: Preapre request with headers, query params and Body(Passing value from feature file)
        When I set all headers for the request
        And I set request header "Accept" to "application/json"
        And I set request header "Content-Type" to "application/json"
        And I set request query parameters to
            | parameters      | value |
            | x-tst-client-id | "aaa" |
        And I set request body to '{"name":"test", "fwk":"api", "car":null}'
        And I invoke the endpoint /
        Then validate response code should be 200


    Scenario: Preapre request with headers, query params and Body(Passing from Config)
        When I set all headers for the request
        And I set request header "Accept" to "application/json"
        And I set request header "Content-Type" to "application/json"
        And I set request query parameters to
            | parameters      | value |
            | x-tst-client-id | "aaa" |
        And I set request body
        And I invoke the endpoint /
        Then validate response code should be 200


    Scenario: Preapre request with headers, query params and Body(Passing value from some Template file)
        When I set all headers for the request
        And I set request header "Accept" to "application/json"
        And I set request header "Content-Type" to "application/json"
        And I set request query parameters to
            | parameters      | value |
            | x-tst-client-id | "aaa" |
        And I set contents of file "validRequest.schema" to request body
        And I append basic authentication credentials ClientID and ClientSecret
        And I invoke the endpoint /
        Then validate response code should be 200

