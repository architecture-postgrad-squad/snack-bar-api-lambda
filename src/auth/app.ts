import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CognitoJwtVerifier } from "aws-jwt-verify";

//TODO: change mocked data
const verifier = CognitoJwtVerifier.create({
  userPoolId: "123",
  tokenUse: "access",
  clientId: "123",
});


export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  try {
    await verifier.verify(event.requestContext.identity.accessKey || '');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Authorized",
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Unauthorized",
      }),
    };
  }
};
