import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { removeConnectionId } from "../../businessLogic/blagues";


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): 
Promise<APIGatewayProxyResult> => {
  console.log("Websocket disconnect", event)

  const connectionId = event.requestContext.connectionId
  await removeConnectionId(connectionId)

  return {
    statusCode: 200,
    body: ''
  }
}