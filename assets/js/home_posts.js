{
    // method to submit form data using AJAX
    console.log('hello');
    let createPost=function(){
        let newPostForm=$("#new-post-form");
        newPostForm.submit(function(e){
            e.preventDefault();//prevent default submit so that we could submit manually
            // we will submit the form mannually using ajax
            console.log('hello');
            $.ajax({
                type:'post',
                url:'/posts/create',//same form name as in home.ejs
                data:newPostForm.serialize(),//this converts the form data into json.
                success: function(data){
                  let newPost=newPostDOM(data.data.post);
                  $("#posts-list-container>ul").prepend(newPost); //Adding post in the DOM
                  deletePost($(' .delete-post-button',newPost));  //for deleting post from DOM
                },
                error: function(err){
                    console.log(err);
                }
            })
        })
    }
    
    //method to create a post in DOM
    let newPostDOM=function(post){
        return $(`<li id="post-${post._id}"
        <p>
            
            <small>
                <a class="delete-post-button" href="/posts/destroy/${ post._id }">X</a>
            </small>
            
            ${ post.content }
            <br>
            <small>
               ${ post.user.name }
            </small>
        </p>
        <div class="post-comments">
            
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type Here to add comment..." required>
                    <input type="hidden" name="post" value=" ${post._id }" >
                    <input type="submit" value="Add Comment">
                </form>
    
            
    
            <div class="post-comments-list">
                <ul id="post-comments-${post._id }">
                    
                </ul>
            </div>
        </div>
        
        </li>`)
    } 

    // method to delete a post from DOM
    let deletePost=function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type:'get',
                url:/comments/create, //to get the href value of a tag.
                success:function(data){
                    $(`#post-${data.data.post_id}`).remove();  //for getting post id from the server and deleting it from DOM
                },
                error:function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    createPost();

    let createComment = function() {
    // Event delegation: Listen for submits on any form inside .post-comments
    $(document).on('submit', '.post-comments form', function(e) {
        e.preventDefault();
        let self = $(this); // The specific comment form being submitted

        $.ajax({
            type: 'post',
            url: '/comments/create',
            data: self.serialize(),
            success: function(data) {
                let newComment = newCommentDOM(data.data.comment);
                // Append the new comment to the specific post's comment list
                $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
                
                // Clear the input field after success
                self.find('input[name="content"]').val('');
                
                // Attach delete listener to the new delete button
                deleteComment($(' .delete-comment-button', newComment));
            },
            error: function(err) {
                console.log(err.responseText);
            }
        });
    });
};

let newCommentDOM = function(comment) {
    return $(`<li id="comment-${comment._id}">
        <p>
            <small>
                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
            </small>
            ${comment.content}
            <br>
            <small>${comment.user.name}</small>
        </p>
    </li>`);
};

let deleteComment = function(deleteLink) {
    $(deleteLink).click(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data) {
                $(`#comment-${data.data.comment_id}`).remove();
            },
            error: function(err) {
                console.log(err.responseText);
            }
        });
    });
};

createComment();
}
