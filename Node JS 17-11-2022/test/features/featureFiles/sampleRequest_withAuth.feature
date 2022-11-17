Feature: Sample feature which help, how to prepare a API request with all required combination along with Authentication


    Scenario: Preapre request with Basic authentication along with headers, query params and Body(Passing value from some Template file)
        When I set all headers for the request
        And I set request header "Accept" to "application/json"
        And I set request header "Content-Type" to "application/json"
        And I set request query parameters to
            | parameters      | value |
            | x-tst-client-id | "aaa" |
        And I set contents of file "validRequest.schema" to request body
        And I append basic authentication credentials
        And I invoke the endpoint /
        Then validate response code should be 200



    Scenario: Preapre request with Client TLS along with headers, query params and Body(Passing value from some Template file)
        When I set all headers for the request
        And I set request header "Accept" to "application/json"
        And I set request header "Content-Type" to "application/json"
        And I set request query parameters to
            | parameters      | value |
            | x-tst-client-id | "aaa" |
        And I set contents of file "validRequest.schema" to request body
        And I attach Valid client TLS configuration
        And I invoke the endpoint /
        Then validate response code should be 200