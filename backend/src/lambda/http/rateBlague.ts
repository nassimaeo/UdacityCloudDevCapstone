import {APIGatewayProxyHandler, 
  APIGatewayProxyEvent,
  APIGatewayProxyResult} from 'aws-lambda'
  import { UpdateBlagueRequest } from '../../requests/UpdateBlagueRequest'
  import { getUserId } from '../utils'
import { rateBlague} from '../../businessLogic/blagues'
  
  export const handler: APIGatewayProxyHandler 
  = async (event : APIGatewayProxyEvent):
  Promise<APIGatewayProxyResult> => {
    console.log('Processing event:', event)

    const blagueId = event.pathParameters.blagueId
    const ratingBlague: UpdateBlagueRequest = JSON.parse(event.body)
    const userId = getUserId(event)
  
    const result = await rateBlague(userId, blagueId, ratingBlague)
    /*
    const userIds = await getAllConnectedUsers()

    userIds.forEach(connectionId => {
      console.log("sending message to ", connectionId)
      sendMessageToClient(connectionId, {data:"coucou"})
    });
    */
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': true
      },    
      body: JSON.stringify({nouvelleBlague:result})
    }
  }
  
  
  