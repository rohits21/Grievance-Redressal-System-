# GRS
Grievance Redressal System

The system is designed and developed to address the issue of grievance registration for college students in their respective colleges or universities.<br>
Systems's sole purpose is to make students' complaints heard by the authorities of the colleges so that they can be addressed as soon as possible.<br>

<b> UNIQUE FEATURE: </b> Faculties would be granted scores on the basis of number of issue they solved that were assigned to them.

## Modules
- Student
- Faculties
- Admins 

### Student
Functional Requirements 
- Login/Registration
- Raise Complaint
- Upvote a complaint
- Fill Feedbacks

### Faculties
Functional Requirements
- Login/Resgitration
- Complaint handling and addressing timely
- Create Feedback form

### Admins
All HODs and higher authorities(Principal,Vice Principal etc) of the university and college.<br>
Selection of Admin depends on the institute. 
<br>

Functional Requirements
- Login/Resgitration
- View Performance of Faculties
- Assign issue domain to faculty
- deactivate student account


## Database requirements
Note : <u>Pre install MySQL and create a database</u> <br>
<b>  setup a .env file </b> <br/>
  ```
  HOST = ''
  USER = ''
  PASSWORD = ''
  DATABASE = ''
  SECRET = ''
  ```

### Install all the dependencies
  Type the following in terminal 
  ```
  > npm install
  ```

### Install and connect mysql in node
  Type the following command in terminal
  ```
  > npm install mysql2
  ```
  To connect and setup the database automatically, run database/dbsetup.js file in terminal <br>
  ```
  > node database/dbsetup
  ```
  To initialize tables with values, run database/tbsetup.js file in terminal <br>
  ```
  > node database/tbsetup
  ```
  
## Start the server
  ```
  > npm run dev
  ```
## Run the application
  Type localhost:4000 in the browser
  
## Stop the server
  ```
  > press ctrl + c in terminal
  > Terminate batch job (Y/N)? y
  ```
