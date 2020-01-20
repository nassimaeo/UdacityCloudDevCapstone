import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import { JwtPayload } from "../../auth/JwtPayload";
import { Jwt } from "../../auth/Jwt";
import {verify,  decode } from "jsonwebtoken";
import Axios from "axios";


const jwksUrl = "https://dev-g1xa92ox.auth0.com/.well-known/jwks.json"

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  console.log("Event", event)

  var authorizationToken = event.authorizationToken
  if (!event.authorizationToken)
    authorizationToken = event.headers.Authorization
  console.log("Authorizing a user", authorizationToken)

  try {
    const jwtToken = await verifyToken(authorizationToken)
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version:'2012-10-17',
        Statement:[
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log("user not authorized", {error: e.message})
    return {
      principalId: 'user',
      policyDocument: {
        Version:'2012-10-17',
        Statement:[
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }    
  }
  

  
}

async function verifyToken(authHeader:string): Promise<JwtPayload>{
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, {complete:true}) as Jwt

  const decodedTokenKid = jwt.header.kid
  console.log("decoded Token kid", decodedTokenKid)

  var jwks;
  await Axios(jwksUrl).then(
    res => {
      jwks = res.data
    }
  )
  
  const keyUser = getKey(jwks.keys, decodedTokenKid)
  const cert = keyUser.x5c[0]
  const pem = certToPEM(cert)

  const rs = verify(token, pem, {algorithms: ['RS256']}) as JwtPayload
  return rs
}

function certToPEM( cert ) {
  let pem = cert.match( /.{1,64}/g ).join( '\n' );
  pem = `-----BEGIN CERTIFICATE-----\n${ cert }\n-----END CERTIFICATE-----\n`;
  return pem;
}

function getKey(keys, kid){
  return keys.find(key => key.kid === kid)
}

function getToken(authHeader:string):string {
  if(!authHeader) throw new Error('No authentication header')
  if(!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentifcation header')
  const split = authHeader.split(' ')
  const token = split[1]
  return token
}