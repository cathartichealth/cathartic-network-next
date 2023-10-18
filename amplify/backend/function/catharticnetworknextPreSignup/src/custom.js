/* Amplify Params - DO NOT EDIT
	API_CATHARTICNETWORKNEXT_GRAPHQLAPIENDPOINTOUTPUT
	API_CATHARTICNETWORKNEXT_GRAPHQLAPIIDOUTPUT
	API_CATHARTICNETWORKNEXT_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const GRAPHQL_ENDPOINT = process.env.API_CATHARTICNETWORKNEXT_GRAPHQLAPIENDPOINTOUTPUT;
  const GRAPHQL_APIKEY = process.env.API_CATHARTICNETWORKNEXT_GRAPHQLAPIKEYOUTPUT;

  console.log(event.request.userAttributes);
  const query = /* GraphQL */ `
    mutation CREATE_USER($input: CreateUserInput!) {
      createUser(input: $input) {
        first_name
        last_name
        email
        mobile
        company
        position
        location
        role
      }
    }
  `;

  const variables = {
    input: {
      first_name: event.request.userAttributes['custom:first_name'],
      last_name: event.request.userAttributes['custom:last_name'],
      email: event.request.userAttributes['email'],
      mobile: event.request.userAttributes['phone'],
      company: event.request.userAttributes['custom:company'],
      position: event.request.userAttributes['custom:company_position'],
      location: event.request.userAttributes['custom:location'],
      role: event.request.userAttributes['custom:role']
    },
  };

  const options = {
    method: "POST",
    headers: {
      "x-api-key": GRAPHQL_APIKEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify( {query, variables})
  };

  const response = {};
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, options);
    response.data = await res.json()
  } catch(error) {
    response.statusCode = 400;
    response.body = {
      errors: [
        {
          message: error.message,
          stack: error.stack,
        }
      ],
    };
  };

  return {
    ...response,
    body: JSON.stringify(response.body)
  };
};
