Feature: Sample feature which help, how to validate a API respone (status code, response body and response header)


    Scenario: Validate API response - Response Status and Response Header
        When I set all headers for the request
        And I set request header "Accept" to "application/json"
        And I set request header "Content-Type" to "application/json"
        And I invoke the endpoint /
        Then validate response code should be 200
        And validate response header "content-type" should exist
        And validate response header "hello/test" should not exist


    @1111
    Scenario: Validate API response - Response Status and Response Header and Body (validate specific Key)
        When I set all headers for the request
        And I set request header "Accept" to "application/json"
        And I set request header "Content-Type" to "application/json"
        And I invoke the endpoint /
        Then validate response code should be 200
        And validate response header "content-type" should exist
        And validate response header "hello/test" should not exist
        And validate response body should contain "postcode"
        And validate response body should not contain "hello"



    Scenario: Validate API response - Response Status and Response Header and Body (validate full response with schema)
        When I set all headers for the request
        And I set request header "Accept" to "application/json"
        And I set request header "Content-Type" to "application/json"
        And I invoke the endpoint /
        Then validate response code should be 200
        And validate response header "content-type" should exist
        And validate response header "hello/test" should not exist
        And Validate response structure with "response_200_schema" template