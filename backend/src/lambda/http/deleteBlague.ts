import {APIGatewayProxyHandler, 
  APIGatewayProxyEvent,
  APIGatewayProxyResult} from 'aws-lambda'
  import { getUserId } from '../utils'
import { deleteBlague } from '../../businessLogic/blagues'
  
  export const handler: APIGatewayProxyHandler 
  = async (event : APIGatewayProxyEvent):
  Promise<APIGatewayProxyResult> => {
    console.log('Processing event:', event)
  
    const blagueId = event.pathParameters.blagueId
    const userId = getUserId(event)
  
    const result = await deleteBlague(userId, blagueId)
  
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': true
      },    
      body: JSON.stringify({blague:result})
    }
  }
  
  
  