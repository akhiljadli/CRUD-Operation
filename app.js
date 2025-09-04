import express from "express";
import path  from "path";
import { fileURLToPath } from "url";
import posts from "./data/data.js";
import { v4 as uuidv4 } from 'uuid';
import methodOverride from 'method-override';

const app = express();
const port = 3006;

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

app.get("/posts",(req,res)=>{
    res.render("index",{posts});
})

app.get("/posts/new",(req,res)=>{
    res.render("new");
})

app.post("/posts",(req,res)=>{
    let {username , about} = req.body;
    let newid = uuidv4(); 
    posts.push({id:newid,username,about});
    res.redirect("/posts");
})

app.get("/posts/:id",(req,res)=>{
    let {id} = req.params;
    let post = posts.find((p)=> id===p.id);
    res.render("show",{post});
})


app.get("/posts/:id/edit",(req,res)=>{
    let {id} = req.params;
    let post = posts.find((p)=> id===p.id);
    res.render("edit",{post});
})

//update route
app.patch("/posts/:id",(req,res)=>{
    let {id} = req.params;
    let post = posts.find((p)=>id === p.id);
    let newabout= req.body.about;
    post.about = newabout;
    res.redirect("/posts");
})


app.delete("/posts/:id",(req,res)=>{
    let {id} = req.params;
    let index = posts.findIndex((p)=> id === p.id);
    if(index !== -1){
        posts.splice(index,1);  
    }
    res.redirect("/posts");
});


const start =  async()=>{
    app.listen(port,(req,res)=>{
        console.log(`app is listening in port ${port}`);
    })
}
start();