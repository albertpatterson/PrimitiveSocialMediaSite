define(['./squire.js', 'jqueryFullSpy', 'createFullSpy'], function(Squire, jqueryFullSpy,createFullSpy){
    var injector = new Squire();

    // post css
    var postContainerCSS = '.postContainer';
    var posterNameCSS = '.posterName';
    var posterContentCSS = '.postContent';

    describe('followUser Script', function() {
        it('should correctly configure the jquery get request', function(done) {

            injector.mock('jquery', jqueryFullSpy)
            .require(['followUser', 'jquery'], function(followUser, JQSpy){
                var followeeName = "user1";
                var callback = "myCallback";
                followUser(followeeName, callback);
                // expect for there to be one call to get
                var getCalls = JQSpy.get.calls;
                expect(getCalls.length).toBe(1);
                var getArgs = getCalls[0];
                // expect the url to be correct
                var getUrl = getArgs[0];
                expect(getArgs[0]).toBe(`/signedIn/ajax/followUser?followeeName=${followeeName}`)
                // expect the contexxt to be correct
                var getContext = getArgs[1];
                expect(getContext).toEqual({});
                // expect the callback to be correct
                var getCallback = getArgs[2];
                expect(getCallback).toEqual(callback);
                done();
            })
        });
    });

    describe('insertPost script', function(){
        it('Should prepend a post to a container of posts in the dom', function(done){
            require(['insertPost'], function(insertPost){
                
                // mock content for the post
                var poster = "user1";
                var content = "myContent";
                var parent = $("<div></div>");
                var method = 'append';
                $('body').append(parent)

                // expect for there to initially be no posts
                expect(parent.find(postContainerCSS).length).toBe(0);
                expect(parent.find(posterNameCSS).length).toBe(0);
                expect(parent.find(posterContentCSS).length).toBe(0);
                
                insertPost(poster, content, parent, method);

                // expect for 1 post to be added
                expect(parent.find(postContainerCSS).length).toBe(1);
                expect(parent.find(posterNameCSS).length).toBe(1);
                expect(parent.find(posterContentCSS).length).toBe(1);

                parent.remove()
                done();
            })
        })
    });

    describe('showFollowedPosts script', function(){
        it('Should call insertPost to prepend the posts to the dom in order', function(done){
            require(['insertPost'], function(insertPost){
                
                insertPostFullSpy =createFullSpy({insertPost});

                injector.mock(
                    {   'jquery': jqueryFullSpy,
                        'insertPost': insertPostFullSpy.insertPost
                    })
                .require(['showFollowedPosts', 'jquery'], function(showFollowedPosts, JQSpy){

                    var parent = "TheParent";
                    var followedPosts = [{poster:'user1',content:'A'},{poster:'user2',content:'B'}]
                    showFollowedPosts(parent, followedPosts);

                    // expect a document fragment to be created and for the posts to be prepended to it
                    var docFrags = JQSpy.findInstances(i=>(i.nodeName)&&(i.nodeName==="#document-fragment"));
                    var docFrag = docFrags[0];
                    expect(docFrags.length).toBe(1);

                    // expect the two posts to be prepended to the fragment in reverse order
                    expect(insertPostFullSpy.insertPost.calls.length).toBe(2);
                    var post1Args = insertPostFullSpy.insertPost.calls[0],
                        post1Poster = post1Args[0],
                        post1Content = post1Args[1],
                        post1Parent = post1Args[2];
                        post1Method = post1Args[3];
                    expect(post1Poster).toBe(followedPosts[0].poster);
                    expect(post1Content).toBe(followedPosts[0].content);
                    expect(post1Parent).toBe(docFrag);
                    expect(post1Method).toBe('append');
                    
                    var post2Args = insertPostFullSpy.insertPost.calls[1],
                        post2Poster = post2Args[0],
                        post2Content = post2Args[1],
                        post2Parent = post2Args[2];
                        post2Method = post2Args[3];
                    expect(post2Poster).toBe(followedPosts[1].poster);
                    expect(post2Content).toBe(followedPosts[1].content);
                    expect(post2Parent).toBe(docFrag);
                    expect(post2Method).toBe('append');

                    // expect the document fragment to be appended to parent
                    var parentJQObjs = JQSpy.findInstances(i=>i===parent);
                    expect(parentJQObjs.length).toBe(1);
                    var appendCalls = parentJQObjs[0].append.calls;
                    expect(appendCalls.length).toBe(1);
                    var appendArgs = appendCalls[0];
                    expect(appendArgs.length).toBe(1);
                    expect(appendArgs[0]).toEqual(docFrag);
                    done();
                })
            })
        });

        it('Should prepend the posts to the dom in reverse order', function(done){                
            require(['showFollowedPosts', 'jquery'], function(showFollowedPosts, $){

                var poster = "user1";
                var content = "myContent";
                var parent = $("<div></div>");
                $('body').append(parent)

                var followedPosts = [{poster:'user1',content:'A'},{poster:'user2',content:'B'}];
                
                // expect there to be no posts 
                expect(parent.find(postContainerCSS).length).toBe(0);
                expect(parent.find(posterNameCSS).length).toBe(0);
                expect(parent.find(posterContentCSS).length).toBe(0);
                
                showFollowedPosts(parent, followedPosts);

                // expect for 1 post to be added
                var postContainers = parent.find(postContainerCSS),
                    posterNames = parent.find(posterNameCSS),
                    postContents = parent.find(posterContentCSS);
                expect(postContainers.length).toBe(2);
                expect(posterNames.length).toBe(2);
                expect(postContents.length).toBe(2);

                // expect the posts to show information in the correct order
                var expectPosterNames = followedPosts.map(o=>o.poster),
                    expectPostContents = followedPosts.map(o=>o.content);
                var actualPosterNames = posterNames.toArray().map(e=>$(e).text()),
                    actualPostContents = postContents.toArray().map(e=>$(e).text());

                expect(actualPosterNames).toEqual(expectPosterNames);
                expect(actualPostContents).toEqual(expectPostContents);
                
                // expect the posts to have the correct order
                parent.remove();
                done();
            })
        });
    });
})