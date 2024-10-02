import { APIGatewayProxyEvent } from "aws-lambda";

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognito = new CognitoIdentityProviderClient({});

async function authenticate(
  username: string,
  password: string,
  clientId: string
) {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });

  try {
    return (await cognito.send(command)).AuthenticationResult;
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthenticated" }),
    };
  }
}

export const lambdaHandler = async (event: APIGatewayProxyEvent) => {
  const user = process.env.USERNAME!;
  const pass = process.env.PASSWORD!;
  const clientId = process.env.CLIENTID!;

  try {
    return await authenticate(user, pass, clientId);
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Error",
      }),
    };
  }
};
