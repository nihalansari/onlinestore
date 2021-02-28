### Assumptions
A) Course ID, class ID and subject ID refers to the same thing.
B) Basic authentication model has been chosen. JWT session persistence can be integrated easily, however this will demand a little more time to be invested.
C) Backend validation for email, username, password is limited.

### Trade-offs and limitations

Notes:
A) Please note that this application is not fit to run on the production environment yet. In an ideal scenario I would like to include secrets/passwords utilizing the credentials management of orchestration platform like Kubernetes.

B) The source code is modularized. However, some code portions are still in residing in app.js.  I hope this doesn't matter much.

C) Some variables or data areas throughout the source code may have been duplicated in some modules. 

4) All CRUD operations are not functional on both users and course database. Work in progress.

5) MongoDB integration is limited



### Task 1 - REST API
Notes:
1) Completed with a static dump of mongodb collection as a json file in directory /data on the root of this repository. 
2) There may be many ways of implementing this:
    a) filtering out data at mongodb level(queries)
    b) filtering out data at an application level
   
**I have followed approach b.

### Task 2 - API for Authentication, Registration and User Management

User Authentication at the backend level is functional. Front end systems can pass the user details in the following format as a POST request

{
"username": "testuser2",

"email": "test2@abc.com",

"password": "password"
}

Note: Currently all the users will have admin access. Unauthorized access, though, has been prevented.

### Task 3 - Web UI

Work in Progress...


### CI/CD Pipeline related artifacts


Please note that I am currently working from a low config windows system. I don't have access to a Macbook at this point. I would have preferred working on a local instance of Jenkins, kubectl, minikube running on a MacOS. They won't work on windows properly. 

If the app is deployed on AWS Beanstalk, a pipeline can be created, triggerable on git commits to the repository(webhooks).