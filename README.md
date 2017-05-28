# PrimitiveSocialMediaSite
A primitive social media site built using the MEAN stack and tested using Jasmine and custom test tools and Runners.

### Objective
While not intended to be a polished app with great style and performance, this app is intended to explore various aspects of programming in the MEAN stack and testing. The app will allow users to create accounts, interact with other users, and purchase premium content to be shown as advertisements throughout the site. Unit, integration, and system test of the app will also be included, using custom test tools (to be spun off into another project.)

### Project Checklist
#### Application implementation and testing
- [x] custom runners and tools for testing
  - [x] test runners
  - [x] testers
  - [x] test tools such as mocks and stubs
- [x] data layer using MongoDB & NodeJS
  - [x] source
  - [x] test
- [ ]  business layer using Express & NodeJS
  - [ ] source
    - [ ] Rest API for queyring and updating user data
  - [ ] test
- [ ] presentation layer and routing using Angular
    - [ ] source <br> 
      Currently the view is a very basic collection of pages created in Pug, which will be updated to include Angular components
    - [ ] test <br>
      in progress
- [ ] system tests of the app <br>
  in progress
  
#### Feature Implementation and testing
- [x] access
  - [x] sign up
    - [x] source
    - [x] test
  - [x] sign in
    - [x] source
    - [x] test  
  - [x] logout
    - [x] source
    - [x] test  
- [x] home page
  - [x] source
  - [x] test
- [x] profiles
  - [x] source
  - [x] test
- [x] user communication
  - [x] public messaging
    - [x] source
    - [x] test  
  - [x] private messaging
    - [x] source
    - [x] test  
- [x] search
    - [x] source
    - [x] test
- [ ] premium content
    - [ ] source
    - [ ] test


## Installation
TODO: create node package and detailed installation instructions.
Notes: The project accesses the database remotely, and the url is stored in a file not included in this project for security reasons. To run the project, one will have to provide access to their own database. 


## Usage

