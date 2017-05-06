const proxyquire = require('proxyquire').noCallThru();
const ExpressMock = require('../mock/expressMock');

const expressMock = new ExpressMock();

var signInPageView = 'signInOrUp.pug';
var homePageView = 'homePage.pug';
var othersPageView = 'othersPage.pug';
var searchResultsPageView = 'searchResults.pug';

var renderSignInPage = proxyquire('../../routes/renderSignInPage',
                            {
                                'express': expressMock
                            })   

describe('The renderSignInPage route should render the sign in page in response to get requests to "/"', function(){

    it('should assign routing for the "/" path, specified as the first input to the router',function(){
        var path = renderSignInPage.inputs.get[0][0];
        expect(path).toBe('/');
    })

    it('should render the sign in page in the function specified as the second input to the router',function(){
        var handler = renderSignInPage.inputs.get[0][1];
        var isFun =  handler instanceof Function;
        expect(isFun).toBe(true);

        mockResponse = {
            render: function(view){
                mockResponse.renderedView = view;
            }
        };

        if(isFun){
            handler(null, mockResponse, null)
            expect(mockResponse.renderedView).toBe(signInPageView)
        }

    })
})