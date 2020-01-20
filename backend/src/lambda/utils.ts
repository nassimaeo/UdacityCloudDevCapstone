import { parseUserId } from "../auth/utils";

/**
 * Todo delete later
 * @param event 
 */
export function getUserId(event) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  const userId = parseUserId(jwtToken)
  return userId;
}