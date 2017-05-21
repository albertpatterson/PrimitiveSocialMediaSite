
class RouterMock{
    constructor(){
        this.inputs = {use:[], get:[], post:[]};
    }

    use(){
        this.inputs.use.push(arguments);
    }

    get(){
        this.inputs.get.push(arguments);
    }

    post(){
        this.inputs.post.push(arguments);
    }

    all(){
        this.inputs.all.push(arguments);
    }

    findRoute(method,path){
        return this.inputs[method].find(inputs=>inputs[0]===path);
    }
}


class ExpressMock{
    constructor(){
        this.routerMock = new RouterMock();
    }

    Router(){
        return this.routerMock;
    }
}

module.exports = ExpressMock;