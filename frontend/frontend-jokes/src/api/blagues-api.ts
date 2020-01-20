import { BlagueItemRequest } from 'src/app/models/BlagueItemRequest';
import { BlagueItem } from 'src/app/models/BlagueItem';
import { apiEndpoint } from 'src/app/config';
import Axios from 'axios'

/*
This is just stub function 
*/
export async function createBlague(idToken:string,
  nouvelleBlague: BlagueItemRequest): Promise<BlagueItem>  {
    const response = await Axios.post(
      `${apiEndpoint}/blagues`,
      JSON.stringify(nouvelleBlague), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      }
    )
    return response.data.item as BlagueItem
  }