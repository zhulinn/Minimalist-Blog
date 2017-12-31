var express     = require("express"),
methodOverride  = require("method-override"),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
expressSanitizer = require("express-sanitizer"),
app             = express();

// App Config
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer())
// Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// RESTful Routes
app.get("/", function(req,res){
   res.redirect("/blogs")
});
app.get("/blogs", function(req,res){
   Blog.find({}, function(err, blogs){
      if(err){
          console.log("ERROR");
      } else {
          res.render("index", {blogs: blogs});
      }
   });
});
app.get("/blogs/new", function(req, res){
   res.render("new"); 
});
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new");
       } else {
           res.redirect("/blogs")
       }
   });
});
app.get("/blogs/:id", function(req,res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           res.redirect("/blogs");
       } else {
          res.render("show", {blog: blog});
       }
   });
});
app.get("/blogs/:id/edit", function(req,res){
   Blog.findById(req.params.id,  function(err, blog){
       if(err){
           console.log(err);
       } else{
           res.render("edit", {blog:blog});
       }
   });
       
});
app.put("/blogs/:id", function(req,res){
        req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs/" + req.params.id);
      }
    });
    
});
app.delete("/blogs/:id", function(req,res){
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs");
      }
    });
});

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("App is running...")
})