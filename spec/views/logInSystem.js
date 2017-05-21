function promiseCallbackExecution(element, eventName){
    return new Promise(function(res){
        let listener = element.addEventListener(
            eventName,
            function(){
                console.log(eventName);
                // element.removeEventListener(eventName, listener);
                res(arguments);
            })
    })
}

function promiseNewPageLoad(window, timeout){
    timeout = timeout||5e3;
    return new Promise(function(res, rej){
        let oldHref = window.location.href;
        let int = setInterval(function(){
            let currentHref = window.location.href;
            if((currentHref!==oldHref)&&(window.document.readyState=='complete')){
                clearTimeout(failTimeout);
                clearInterval(int);
                res();
            }
        })
        let failTimeout = setTimeout(function(){
            clearInterval(int);
            rej("The new page did not load within the timeout.");
        }, timeout);
    })
}

describe('login system', function(){
    
    let testWindow;
    let myval;
    const loginPage = 'http://localhost:3000/';

    beforeEach(function(done){
        (async function(){
            myval=1;
            testWindow = window.open(loginPage);
            await promiseCallbackExecution(testWindow, 'load');
            done();
        })()
    })

    afterEach(function(done){
        (async function(){

            testWindow.close();
            done();
        })()
    })


    it('should allow a user to sign up and then show them their profile', function(done){
        (async function(){

            testWindow.document.getElementById('newUserName').value = "Sam";
            testWindow.document.getElementById('DOB').value = '1900-01-01';
            testWindow.document.getElementById('zipCode').value = 123456;
            testWindow.document.getElementById('biz').value = 'Business';
            // testWindow.document.getElementById('pic').value = "fake path to pic";
            testWindow.document.getElementById('signUpButton').click();

            await promiseNewPageLoad(testWindow)
            expect(testWindow.location.href).toBe('http://localhost:3000/signedIn/navigation/otherUser?name=Sam');
            expect(myval).toBe(1);
            done();
        })()
    })


    // it('should allow a valid user to log in and redirect them to their home page', function(done){
    //     (async function(){
    //     testWindow = window.open(loginPage);

    //     await promiseCallbackExecution(testWindow, 'load');
    //     let accessForm = testWindow.document.querySelectorAll('#AccessForms');
    //     expect(accessForm.length).toBe(1);
    //     testWindow.document.getElementById('userName').value = 'Spiderman';
    //     var loadProm = promiseCallbackExecution(testWindow, 'hashchange');
    //     testWindow.document.getElementById('loginButton').click();
        
    //     await promiseNewPageLoad(testWindow)
    //     // await promiseCallbackExecution(testWindow, 'load');
    //     let postButton = testWindow.document.getElementById('addContent');
    //     expect(postButton).not.toBe(null);
    //     testWindow.close();
    //     done();
    //     })()
    // })
})