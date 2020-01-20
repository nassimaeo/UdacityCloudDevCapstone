import { CreateBlagueRequest } from "../requests/CreateBlagueRequest";
import { BlagueItem } from "../models/blagueItem";
import { BlaguesAccess } from "../dataLayer/blaguesAccess";
import { UpdateBlagueRequest } from "../requests/UpdateBlagueRequest";

const blaguesAccess = new BlaguesAccess()

export async function createBlagueItem(
  userId:string,
  blagueId: string, 
  nouvelleBlague: CreateBlagueRequest
  ): Promise<BlagueItem> {
  return blaguesAccess.createBlagueItem(userId,blagueId, nouvelleBlague);
}

export async function rateBlague(
  userId:string,
  blagueId: string, 
  ratingBlague: UpdateBlagueRequest): Promise<BlagueItem>{
    return blaguesAccess.rateBlague(userId, blagueId, ratingBlague);
}

export async function getBlagues(): Promise<BlagueItem[]> {
  return blaguesAccess.getBlagues()
}

//userId est envoye explicitement dans l'endpoint
export async function getBlaguesUser(userId): Promise<BlagueItem[]> {
  return blaguesAccess.getBlaguesUser(userId)
}

//userId tiré du authToken
export async function getBlaguesUsers(userId): Promise<BlagueItem[]> {
  return blaguesAccess.getBlaguesUsers(userId)
}

export async function deleteBlague(userId, blagueId): Promise<BlagueItem>{
  return blaguesAccess.deleteBlague(userId, blagueId);
}

export async function addConnectionId(connectionId){
  blaguesAccess.addConnectionId(connectionId)
}

export async function removeConnectionId(connectionId){
  blaguesAccess.removeConnectionId(connectionId)
}

export async function sendMessageToClient(connectionId, payload){
  console.log('sending message to a connection', connectionId, payload)
  try {

    blaguesAccess.sendMessageToClient(connectionId, payload)

  } catch(e) {
    console.log("Failed to send message", JSON.stringify(e))
    if (e.statusCode === 410){
      console.log('Stale connection')
      blaguesAccess.removeConnectionId(connectionId)
    }
  }
}

export async function getAllConnectedUsers(): Promise<string[]>{
  return blaguesAccess.getAllConnectedUsers()
}