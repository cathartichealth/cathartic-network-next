const aws = require('aws-sdk');
const ses = new aws.SES();
const { API, graphqlOperation } = require('aws-amplify');

import { getUser } from '@/src/graphql/queries'; 

exports.handler = async (event) => {
  try {
    for (const { eventName, dynamodb: record } of event.Records) {
      if (eventName === "INSERT") {
        const clientID = record.newImage.clientID.S;
        const productID = record.newImage.productID.S;
        const supplierID = record.newImage.supplierID.S;

        // Fetch supplier's email using GraphQL query
        const supplierResponse = await API.graphql(graphqlOperation(getUser, { id: supplierID }));
        const supplierEmail = supplierResponse.data.getUser.email;

        // Send email notification to supplier
        await ses.sendEmail({
          Destination: {
            ToAddresses: [supplierEmail],
          },
          Source: process.env.SES_EMAIL,
          Message: {
            Subject: { Data: 'New Request Submitted' },
            Body: {
              Text: {
                Data: `A new request has been submitted by a client with ID ${clientID} for a product with ID ${productID}.`,
              },
            },
          },
        }).promise();
      }
    }
    return { status: 'done' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
