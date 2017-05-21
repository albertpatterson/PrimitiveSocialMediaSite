class RequestStub{
    constructor(session, body, query, file){
        this.session = session;
        this.body = body;
        this.query = query;
        this.file = file;
    }
}
module.exports = RequestStub;