import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getBlaguesUsers } from "../../businessLogic/blagues";
import { getUserId } from "../utils";
//var urlencode = require('urlencode');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('processin event:', event)
  //const userId = urlencode.decode(event.pathParameters.userId, 'utf-8');
  const userId = getUserId(event)
  
  const result = await getBlaguesUsers(userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },      
    body: JSON.stringify({
        result
      }
    )
  }
}