<!-- Answers to the Short Answer Essay Questions go here -->

1.  Describe Middleware, Sessions (as we know them in express), bcrypt and JWT.
--Middleware are functions that are executed after a request and return  a response that can be passed or used until the cycle is complete.
--Sessions are ways for the server to store and access data about a client.
--bcrypt is a function that hashes passwords.
--JWT = JSON web tokens are industry standard in authentication and transferring data between client and server.

2.  What does bcrypt do in order to prevent attacks?
--it hashes passwords using salt, making it difficult for potential attackers to set up a rainbow table

3.  What are the three parts of the JSON Web Token?
Header, payload, signature