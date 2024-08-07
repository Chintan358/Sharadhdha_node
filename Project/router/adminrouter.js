const express = require("express")
const router = express.Router()
const User = require("../model/users")
const auth = require("../middleware/auth")
const bcrypt = require("bcryptjs")
const Admin = require("../model/admins")
const jwt = require("jsonwebtoken")
const aauth = require("../middleware/aauth")
const Category = require("../model/categories")
const Product = require("../model/products")
const Order = require("../model/orders")



const multer = require("multer")
const fs = require("fs")

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/product_image')
    },
    filename:function(reg,file,cb)
    {
        cb(null, Date.now()+"_"+file.originalname)
    }
    
})

var upload = multer({storage:storage})

router.get("/admin",(req,resp)=>{
    resp.render("adminlogin")
})

router.get("/dashboard",aauth,(req,resp)=>{
    resp.render("dashboard")
})

router.post("/adminlogin",async(req,resp)=>{

    const username = req.body.username
    const password = req.body.password

    try {
        
        const data = await Admin.findOne({username:username})

       


        
        if(password==data.password)
        {
            
            const token = await jwt.sign({_id:data._id},process.env.A_KEY)
            resp.cookie("ajwt",token)
            resp.redirect("dashboard")
        }
        else{
            
            resp.render("adminlogin",{"msg":"Invalid credentials"})
        }


    } catch (error) {
        console.log(error);
        resp.render("adminlogin",{"msg":"Invalid credentials"})
    }


})

router.get("/adminlogout",aauth,async(req,resp)=>{
   
    resp.clearCookie("ajwt")
    resp.redirect("admin")
})



//**********************Category***************************** */
router.get("/category",aauth,async(req,resp)=>{
    try {

        const categories = await Category.find();
        resp.render("category",{"categories":categories})
    } catch (error) {
        
    }
})

router.post("/addcategory",aauth,async(req,resp)=>{


    const id = req.body.id;
   
    try {
        const id = req.body.id;

        if(id=="")
            {
                const cat = new Category(req.body)
                await cat.save();
                
            }
            else
            {
                await Category.findByIdAndUpdate(id,req.body)
            }
            resp.redirect("category")
       
    } catch (error) {
        
    }
})

router.get("/deletecategory",aauth,async(req,resp)=>{
    try {

        const _id = req.query.id;
        await Category.findByIdAndDelete(_id);
        resp.redirect("category");
    } catch (error) {
        
    }
})

router.get("/editcategory",aauth,async(req,resp)=>{
    try {

        const _id = req.query.id;
        catdata =  await Category.findOne({_id:_id});
        const categories = await Category.find();
        resp.render("category",{"categories":categories,"catdata":catdata});
    } catch (error) {
        
    }
})



//**********************Product************************************* */
router.get("/product",aauth,async(req,resp)=>{
    try {

        const allprod = await Product.find().populate('catid')

        //console.log(allprod)

        const allcat = await Category.find()
        resp.render("product",{"categories":allcat,"products":allprod})
    } catch (error) {
        
    }
})

router.post("/addproduct",upload.single("img"),async(req,resp)=>{
    try {
        
        const prod = new Product({
            catid : req.body.catname,
            pname : req.body.pname,
            price : req.body.price,
            qty : req.body.qty,
            image : req.file.filename
        })

        await prod.save()
        resp.redirect("product")
    } catch (error) {
        console.log(error);
    }
})

router.get("/deleteproduct",aauth,async(req,resp)=>{
    try {

        const _id = req.query.id;
        await Product.findByIdAndDelete(_id);
        resp.redirect("product");
    } catch (error) {
        
    }
})

//**********************order************************************* */
router.get("/order",aauth,async(req,resp)=>{
    try {
        resp.render("order")
    } catch (error) {
        
    }
})


//**********************Users************************************* */
router.get("/user",aauth,async(req,resp)=>{
    try {
        resp.render("user")
    } catch (error) {
        
    }
})


router.get("/userorder",aauth,async(req,resp)=>{
    try {

        const order = await Order.find().populate("uid").populate("Product.pid")

        console.log(order);
        

        resp.render("orders",{"orders":order})

    } catch (error) {
        console.log(error);
    }
})



module.exports=router