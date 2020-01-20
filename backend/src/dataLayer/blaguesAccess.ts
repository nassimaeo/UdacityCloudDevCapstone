import { CreateBlagueRequest } from "../requests/CreateBlagueRequest";
import { BlagueItem } from "../models/blagueItem";
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid'
import { UpdateBlagueRequest } from "../requests/UpdateBlagueRequest";

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const connectionsTable = process.env.CONNECTIONS_TABLE

function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient()
}

const apiId = process.env.API_ID
const stage = process.env.STAGE
const connectionParams = {
  apiVersion: "2018-11-29",
  endpoint: `${apiId}.execute-api.us-east-1.amazonaws.com/${stage}`
}
const apiGateway = new AWS.ApiGatewayManagementApi(connectionParams)

export class BlaguesAccess {



  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly blaguesTable = process.env.BLAGUES_TABLE,
    private readonly ratingsTable = process.env.RATINGS_TABLE,
    private readonly ratingsIndexTable = process.env.INDEX_RATING_BLAGUE,
    private readonly blaguesIndexTable = process.env.INDEX_BLAGUE
  ) {

  }

  async createBlagueItem(userId: string,
    blagueId: string,
    nouvelleBlague: CreateBlagueRequest): Promise<BlagueItem> {
    var imageUrl;
    var url;
    if (nouvelleBlague.attachmentUrl) {
      //chercher PresignedURL
      const imageId = uuid.v4()
      url = this.getUploadUrl(imageId)
      imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
    } else {
      imageUrl = null
      url = null
    }
    const blagueItem = {
      userId: userId,
      blagueId: blagueId,
      createdAt: new Date().toISOString(),
      imageUrl: imageUrl,
      attachmentUrl: url,
      blague: nouvelleBlague.blague
    }

    // sauvgarder la blague dans la BDD
    await this.docClient.put(
      {
        TableName: this.blaguesTable,
        Item: blagueItem
      }
    ).promise()

    return blagueItem as BlagueItem
  }


  async rateBlague(
    userId: string,
    blagueId: string,
    ratingBlague: UpdateBlagueRequest
  ): Promise<BlagueItem> {

    //sauvgarder le rating userId(voter) + blagueId
    var params = {
      TableName: this.ratingsTable,
      Key: {
        "userId": userId,
        "blagueId": blagueId
      },
      UpdateExpression: "set rating = :ratingBlague",
      ExpressionAttributeValues: {
        ":ratingBlague": ratingBlague.rating,
      },
      ReturnValues: "UPDATED_NEW"
    };

    await this.docClient.update(
      params
    ).promise()

    // calculer le nouveau rating pour mettre ajour plus tard la note de la blague
    const result = await this.docClient.query({
      TableName: this.ratingsTable,
      IndexName: this.ratingsIndexTable,
      KeyConditionExpression: 'blagueId = :blagueId',
      ExpressionAttributeValues: {
        ':blagueId': blagueId
      }
    }).promise()
    const items = result.Items
    console.log("Items ratings:", items)
    if (items.length > 0) {
      console.log("#Items :", items.length)
      var count = 0
      var total = 0
      items.forEach(item => {
        count = count + 1
        total = total + parseInt(item.rating)
      });
      console.log("#count :", count)
      console.log("#total :", total)
      const average = Math.ceil(total / count)
      console.log("#average :", average)

      // get userId publisher
      const resultQueryUser = await this.docClient.query({
        TableName: this.blaguesTable,
        IndexName: this.blaguesIndexTable,
        KeyConditionExpression: 'blagueId = :blagueId',
        ExpressionAttributeValues: {
          ':blagueId': blagueId
        }
      }).promise()
      var userIdPublisher = null
      const itemsQueryUser = resultQueryUser.Items
      itemsQueryUser.forEach(item =>{
        userIdPublisher = item.userId
      })
      
      // update le rating sur l'image
      var paramsUpdate = {
        TableName: this.blaguesTable,
        Key: {
          "userId": userIdPublisher, // userId du posteur
          "blagueId": blagueId
        },
        UpdateExpression: "set rating = :average",
        ExpressionAttributeValues: {
          ":average": average,
        },
        ReturnValues: "UPDATED_NEW"
      };

      const ratedBlague = await this.docClient.update(
        paramsUpdate
      ).promise()
      const res = ratedBlague.Attributes as BlagueItem
      console.log("#ratedBlague :", res)
      return res
    }
    return null
  }



  getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: parseInt(urlExpiration)
    }
    )
  }

  async getBlagues(): Promise<BlagueItem[]> {
    const result = await this.docClient.scan({
      TableName: this.blaguesTable
    }).promise();
    const items = result.Items;
    return items as BlagueItem[]
  }


  async getBlaguesUser(userId): Promise<BlagueItem[]> {
    const result = await this.docClient.query({
      TableName: this.blaguesTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();
    console.log("resultat:", result)
    const items = result.Items;
    return items as BlagueItem[]
  }

  async getBlaguesUsers(userId): Promise<BlagueItem[]> {
    const result = await this.docClient.query({
      TableName: this.blaguesTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();
    console.log("resultat:", result)
    const items = result.Items;
    return items as BlagueItem[]
  }

  async deleteBlague(userId, blagueId): Promise<BlagueItem> {
    var params = {
      TableName: this.blaguesTable,
      Key: {
        "userId": userId,
        "blagueId": blagueId
      }
    }
    const result = await this.docClient.delete(params).promise()
    return result.Attributes as BlagueItem
  }


  async addConnectionId(connectionId) {
    const timestamp = new Date().toISOString()
    const item = {
      id: connectionId,
      timestamp
    }

    console.log("Storing Item: ", item)

    await this.docClient.put({
      TableName: connectionsTable,
      Item: item
    }).promise()
  }

  async removeConnectionId(connectionId) {
    const key = {
      id: connectionId
    }

    console.log("removnig item with key:", key)
    await this.docClient.delete({
      TableName: connectionsTable,
      Key: key
    }).promise()
  }

  async sendMessageToClient(connectionId, payload){
    await apiGateway.postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(payload)
    }).promise()    
  }

  async getAllConnectedUsers(): Promise<string[]>{
    const result = await this.docClient.scan({
      TableName: connectionsTable,
      ProjectionExpression : "connectionId"
    }).promise();
    const items = result.Items

    var connectionIds : string[] = []
    items.forEach(connectionId => {
      connectionIds.push(connectionId.toISOString())
    });

    return connectionIds
  }
}