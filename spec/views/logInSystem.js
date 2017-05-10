describe('login system', function(){
    
    let loginPage = 'http://localhost:3000/';

    it('should allow a valid user to log in and redirect them to their home page', function(done){
        let testWindow = window.open(loginPage);
        testWindow.onload = function(){
            console.log('loaded');
            let accessForm = testWindow.document.querySelectorAll('#AccessForms');
            expect(accessForm.length).toBe(1);
            testWindow.close();
            done();        }
    })
})