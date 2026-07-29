const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer =require('../mailers/comments_mailer');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save(); // Await is crucial here

            // Modern populate (no execPopulate)
            await comment.populate('user', 'name');

            // Mailer is commented out per your request
            // if (commentsMailer) commentsMailer.newComment(comment);

            if (req.xhr) {
                return res.status(200).json({
                    data: { comment: comment },
                    message: 'comment created'
                });
            }

            req.flash('success', 'Comment published!');
            return res.redirect('back'); // Success response
        } else {
            // CRITICAL: If no post is found, redirect back so it doesn't hang
            req.flash('error', 'Post not found');
            return res.redirect('back');
        }

    } catch (err) {
        console.log("Error in Controller:", err);
        req.flash('error', 'Internal Server Error');
        return res.redirect('back'); // Error response
    }
};



module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}