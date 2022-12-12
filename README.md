
CRUD-Operation-Witth-Digital-Signature-Verification

Requirements:

1. Using Node.js create an API on which you can perform basic operations
   for CRUD for the user.
2. For every user getting created a signing key will be generated using
   ED25519 (use libsodium).
3. Send the private key and public key as the response to user creation and
   store the public key in the database.
4. Create a POST /verify route where a signature is received under the XSignature header for the request body and the request body is verified
   using the same ED25519 algorithm and the public key stored for that
   user in the backend.
5. Don't save the private key in the backend.
6. Please also create a client (No extensive UI Required) to demo the CRUD
   and POST /verify route

It was a simple project to demonstrate the CRUD Operation,and use of digital signature to verify that data is not altere when it receive to the server side.

Tables Neeed to be created:
CREATE TABLE `sql6525042`.`user_basic_details` ( `User_Id` INT(11) NOT NULL AUTO_INCREMENT , `First_Name` VARCHAR(50) NOT NULL , `Last_Name` VARCHAR(50) NOT NULL , `Email` VARCHAR(100) NOT NULL , `Mobile_No` VARCHAR(50) NOT NULL , `Created_On` DATE NOT NULL , `Updated_On` DATETIME NULL , `Created_By` INT(11) NOT NULL , `Updated_By` INT(11) NULL DEFAULT NULL , PRIMARY KEY (`User_Id`)) ENGINE = InnoDB;

ALTER TABLE `user_basic_details` ADD `Password` VARCHAR(1000) NOT NULL AFTER `Mobile_No`, ADD `Public_Key` VARCHAR(1000) NOT NULL AFTER `Password`;

The whole Project is done using node.js(express) in the backend and React.js in the front end.

What We are going to do:
i)Do CRUD Operation on user
-Create=>done while doing singup
-Read=>Done when user get loged in we will get the details of the user.-
Update=>We allow user to update their basic details
-Delete=>We also allow user to delete their account.

ii)To verify the req.body using libsodium:
-We had created a middleware which will verify the request body data using libsodium either it has been altered or not.(It was used when we make request to update the user details).
-also one verify end point has created which will verify the message is altered or not.The same api is used to demonstrated it in UI.

BackendFlow:
i)Sign Up:
-password is stored as hash in the table.
-private and public key is generate using libsodium.
-store the public key in backend.
-a jwt token is created.
-as a response we will send those details in UI.

ii)login:
-we wil do verification of the user and then generate private,public key and jwt token and send it to the ui.

iii)upateUserDetails:
-first we will use auth middleware which will verify the user using jwt token,
-second middleware will verify the data comming is same or not by using the user public key and the req.body using libsodium.

iv)verify endpoin:
-this endpoin will recieve the message and verify the message is orignal or changed using the digital signature and public key of the user.

FrontEnd Flow:
i)Sign Up:
-when user get signed up we will keep jwt token,private,public key in cookies.
-and navigate the user to middleware route where user has option to select crud operation or digital siginature demo.

ii)LogIn:
-will store jwt token,private,public key in cookies.

iii)LogOut:
-clear all the cookies and redirect to login page.

iv)updateUserDetails:
-to update user details we will send token and signature in the headers.
How signature is generate in UI?
-to generate the signature we will first stringify the data in req body and make the signature using public and private key stored in the cookies to do that we will use libsodium.

v)demoVerifyUser:
-it is an UI develop to demonstrate the workflow of digital signature.
-here if we send the orignal message then backend will verify that message was not changed using that digital signature.
-here if we send different message than that of orignal message than backend will verify that message was changed during transfer.
-all these process is done using libsodium digital signature verfication process.
