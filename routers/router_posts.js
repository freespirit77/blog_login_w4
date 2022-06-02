const express = require("express");
const Posts = require("../models/post");
const Comments = require("../models/comment");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

// * 댓글 전체 목록 조회 (최신순으로) 
router.get("/comments", async (req, res, next) => {
    const {postId} = req.query;
    const comments = await Comments.find({postId});
    console.log(comments);
    comments.sort((a,b)=> (a.editDate > b.editDate) ? -1: 1)
    res.json({ 
        comments : comments.map((comments) => {
            return {
                content: comments.content,
                editor : comments.editor,
                editDate : comments.editDate,
            }
        })
    });
});

// * 댓글 수정 API - ok
router.put("/comments", authMiddleware, async (req, res)=>{
    // const {postId} = req.params; 
    const {content, commentId} = req.body; 
    const {user} = res.locals;
    
    // console.log(`commentId는 ${commentId}`);
    const existsComment = await Comments.findOne({commentId});
    // console.log("postId : ",postId);
    // console.log(`existsComment는 ${existsComment}`);
    // console.log("입력받은 값 : ",postPw);
    // console.log(existsPost.postPw);
    // console.log(`existsComment 에디터는 ${existsComment.editor}`);
    // console.log(`user 에디터는 ${user.nickname}`);

    if(existsComment&& (existsComment.editor==user.nickname)){
        await Posts.updateOne({commentId}, { $set: {content} });
        res.json({ result: "success" });
    } else if (!existsComment){
        return res.status(400).json({success: false, errorMessage: "수정할 댓글이 없습니다."});
    } else {
        return res.status(400).json({success: false, errorMessage: "댓글을 작성한 분이 아니라 수정이 불가해요."});
    } 
});


// * 댓글 삭제 API 
router.delete("/comments", authMiddleware, async (req, res) => {
    const {commentId} = req.body; 
    const {user} = res.locals;
   
    const existsComment = await Comments.findOne({commentId});

    if (existsComment&& (existsComment.editor==user.nickname)) {
      await Comments.deleteOne({commentId});
      console.log("삭제");
      res.json({ result: "success" });
    } else if (!existsComment){
        return res.status(400).json({success: false, errorMessage: "삭제할 댓글이 없습니다."});
    } else {
        return res.status(400).json({success: false, errorMessage: "작성자만 댓글을 삭제할 수 있습니다."});
    }
    
});



// * 댓글 등록 
router.post("/comments", authMiddleware, async (req,res)=> {
    console.log("댓글등록api 실행")
    const {postId, editor, content} = req.body; 
  
    if(!content) {
        return res.status(400).json({success: false, errorMessage: "댓글 내용을 입력해주세요."});
    }

    const createdComments = await Comments.create({
        postId,
        editor, 
        content,
    });

    res.json({comments : createdComments});
});





// * 게시글 수정 API 
router.put("/", authMiddleware, async (req, res)=>{
    // const {postId} = req.params; 
    const {content, postId} = req.body; 
    const {user} = res.locals;
    
    const existsPost = await Posts.findOne({postId: Number(postId)});
    // console.log("postId : ",postId);
    console.log(existsPost);
    // console.log("입력받은 값 : ",postPw);
    // console.log(existsPost.postPw);

    if(existsPost&& (existsPost.editor==user.nickname)){
        await Posts.updateOne({postId: Number(postId)}, { $set: {content} });
        res.json({ result: "success" });
    } else if (!existsPost){
        return res.status(400).json({success: false, errorMessage: "수정할 게시글이 없습니다."});
    } else {
        return res.status(400).json({success: false, errorMessage: "댓글을 작성한 분이 아니라 수정이 불가해요."});
    } 
});





// * 게시글 삭제 : 다시 작성해야함

router.delete("/", authMiddleware, async (req, res) => {
    const {postId} = req.body; 
    
    console.log(postId);
    
    const existsPost = await Posts.findOne({ postId : Number(postId) });

    if (existsPost&& (existsPost.editor==user.nickname)) {
      await Posts.deleteOne({ postId : Number(postId)});
      console.log("삭제");
      res.json({ result: "success" });
    } else if (!existsPost){
        return res.status(400).json({success: false, errorMessage: "삭제할 게시글이 없습니다."});
    } else {
        return res.status(400).json({success: false, errorMessage: "작성자만 게시글을 삭제할 수 있습니다."});
    }
    
});



// * 게시글 등록 
router.post("/", authMiddleware, async (req,res)=> {
    console.log("댓글등록api 실행")
    const {editor, content} = req.body; 
    // const posts = await Posts.find({postId}); 
    
    if(!content) {
        return res.status(400).json({success: false, errorMessage: "댓글 내용을 입력해주세요."});
    }
    // if(posts.length){
    //   return res.status(400).json({success: false, errorMessage: "해당 번호에 이미 게시글이 등록되어 있습니다."});
    // } 

    const createdPosts = await Posts.create({
        editor, 
        content,
    });

    res.json({posts : createdPosts});
});


// * 게시글 전체 목록 조회 (최신순으로)
router.get("/", async (req, res, next) => {
    const posts = await Posts.find();
    posts.sort((a,b)=> (a.editDate > b.editDate) ? -1: 1)
    res.json({ 
        post : posts.map((post) => {
            return {
                postsId : post.postId,
                content: post.content,
                editor : post.editor,
                editDate : post.editDate,
            }
        })
    });
});


module.exports = router;