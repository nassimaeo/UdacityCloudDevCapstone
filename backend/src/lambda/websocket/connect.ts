import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { addConnectionId, sendMessageToClient } from "../../businessLogic/blagues";




export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): 
Promise<APIGatewayProxyResult> => {
  console.log("Websocket connect", event)

  const connectionId = event.requestContext.connectionId

  await addConnectionId(connectionId)

  // envoyer des notifications
  const payload = {data:"ceci est une notification"}
  await sendMessageToClient(connectionId, payload)

  return {
    statusCode:200,
    body:''
  }
}


