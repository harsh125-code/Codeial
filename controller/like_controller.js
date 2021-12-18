
const Post=require('../models/post');
const Comment=require('../models/comments');
const Like=require('../models/like');

module.exports.toggleLike=async function(req,res){
    console.log("con");
 try{
     console.log("controller");
    //like/toggle/?id=abcs&type=Post
    let likeable;
    let deleted=false;
    if(req.query.type=='Post')
    {   console.log("if");
        likeable=await Post.findById(req.query.id).populate('likes');
    }else
    {  
        likeable=await Comment.findById(req.query.id).populate('likes');
    }
    
    //check if a like already exists
    let existingLike=await Like.findOne({
        likeable:req.query.id,
        onModel:req.query.type,
        user:req.user._id
    })
    //if like already exists then delete it
    if(existingLike)
    {
        likeable.likes.pull(existingLike._id);
        likeable.save();
        existingLike.remove();
        deleted=true;
    }else
    {
        //else make a new like
        let newLike=await Like.create({
            user:req.user._id,
            likeable:req.query.id,
            onModel:req.query.type
        });
        likeable.likes.push(newLike._id);
        likeable.save();
    }

    return res.status(200).json({
        message:"Requested Successful!",
        data:{
            deleted:deleted
        }
    })

 }catch(err)
 {
     console.log(err);
     return res.status(500).json({
         message:'Internal server error'
     });
 }
}