# What is this projet?

This project allows you to post jokes online. Each joke can be a text, an image or both.
Only authenticated users can add and rate jokes.
Non authenticated users can read the jokes and see the ratings.

# This projet is composed of two parts:

1- Backend (AWS, Serverless)

All the functions described below are implemented.

```
endpoints:
  POST - https://tytzeng3o9.execute-api.us-east-1.amazonaws.com/dev/blagues
  GET - https://tytzeng3o9.execute-api.us-east-1.amazonaws.com/dev/blagues
  GET - https://tytzeng3o9.execute-api.us-east-1.amazonaws.com/dev/blagues/{userId}
  GET - https://tytzeng3o9.execute-api.us-east-1.amazonaws.com/dev/blagues/user
  DELETE - https://tytzeng3o9.execute-api.us-east-1.amazonaws.com/dev/blagues/user/{blagueId}
  PATCH - https://tytzeng3o9.execute-api.us-east-1.amazonaws.com/dev/blagues/rate/{blagueId}
functions:
  Auth: oAuth, to authenticate users 
  CreateBlague: a user can post a joke (text, images or both)
  GetBlagues: get the list of all the jokes, of all users. 
  GetBlaguesUser: get the list of all jokes of the current authenticated user 
  GetBlaguesUsers: get the list of all the jokes of the user identified by {{hostApi}}/blagues/{userId}
  DeleteBlague: only the authenticated user can delete his own joke.
  RateBlague: an authenticated user can rate a joke. One joke can be rated only once. The last rating will be counted.
```

2- Frontend (Angular)

The frontend interacts with the backend (AWS) using the endpoints
(NB: When you publish the frontend, redirect all the api to index.html)
I posted the frontend on Heruko: http://sleepy-earth-8391.herokuapp.com/

create a file on the root of build: .htaccess (it will redirect all the traffic to index.html
```
# Rewrite Engine ON
RewriteEngine on

# Redirect everything to one file
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule . index.html [L]
```

# Configure Callback URLs
Before you deploy, make sure to configure your callback urls and your apiEndpoint.
Inside the file: frontend/frontend-jokes/src/app/config.ts

```
export const apiEndpoint = "https://REPLACE_THIS.execute-api.us-east-1.amazonaws.com/dev"

export const authConfig = {
  domain: 'REPLACE_THIS.auth0.com',
  clientId: 'REPLACE_THIS',
  callbackUrlLogin: 'REPLACE_THIS/callback',
  callbackUrlLogout: 'REPLACE_THIS/feed'
}
```

In auth0, Make sure you allow your callbackUrlLogin and callbackUrlLogout (inside the box: Allowed Callback URL).

# Deploy to heruku
add a file index.php
```
<?php header( 'Location: /index.html' ) ;  ?>
```
# Screenshots.
See the folder screenshots.

