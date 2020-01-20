import {APIGatewayProxyHandler, 
  APIGatewayProxyEvent,
  APIGatewayProxyResult} from 'aws-lambda'
import { getBlagues } from '../../businessLogic/blagues'
  
  export const handler: APIGatewayProxyHandler 
  = async (event : APIGatewayProxyEvent):
  Promise<APIGatewayProxyResult> => {
    console.log('Processing event:', event) 
  
    const result = await getBlagues()
  
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
  
