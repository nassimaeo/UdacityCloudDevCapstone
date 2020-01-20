import {APIGatewayProxyHandler, 
APIGatewayProxyEvent,
APIGatewayProxyResult} from 'aws-lambda'
import { CreateBlagueRequest } from '../../requests/CreateBlagueRequest'
import * as uuid from 'uuid'
import { createBlagueItem } from '../../businessLogic/blagues'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler 
= async (event : APIGatewayProxyEvent):
Promise<APIGatewayProxyResult> => {
  console.log('Processing event:', event)
  const nouvelleBlague: CreateBlagueRequest = JSON.parse(event.body)

  const blagueId = uuid.v4()
  const userId = getUserId(event)

  const result = await createBlagueItem(userId, blagueId, nouvelleBlague)

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


