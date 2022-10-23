const express = require('express');
const multer = require('multer'); //used to extract the file from the request body.
const Post = require("../models/post");
const authCheck = require('../middlewares/check-auth');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error = null;

    if (!MIME_TYPE_MAP[file.mimetype]) {
      error = new Error('Invalid mime type!')
    }

    cb(error, 'backend/images');// null here means no error, we tell multer
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];

    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.get('', (req, res, next) => {
  // res.send("Hello from express!");
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();

  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }

  postQuery
    .then(posts => {
      fetchedPosts = posts;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json({
        post,
        message: 'Post fetched successfully!'
      })

      return;
    }

    res.status(404).json({
      message: 'Post not found!'
    })
  })
});

router.post('', authCheck, multer({storage}).single('image'), (req, res, next) => {
  // const post = req.body;// body here added by body parsed, we use body parser to easily get the request data (body)
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });

  post.save().then(createdPost => {
    res.status(200).json({
      post: {
        ...createdPost,
        id: createdPost._id,
      },
      message: 'Post added successfully!'
    })
  });
});

router.put('/:id', authCheck, multer({storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  let post = {...req.body};

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');

    imagePath = url + '/images/' + req.file.filename;
    post.imagePath = imagePath;
  }

  Post.updateOne({_id: req.params.id}, post).then(() => {
    res.status(200).json({
      message: 'Post updated successfully!',
      post: post
    })
  })
});


router.delete('/:id', authCheck, (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(() => {
    res.status(200).json({
      message: 'Post Deleted Successfully!',
    });
  });
});

module.exports = router;
