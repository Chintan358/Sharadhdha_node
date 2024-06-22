const express = require("express")
const app = express()
const Razorpay = require('razorpay');


app.get("/",(req,resp)=>{
    resp.sendFile(__dirname+"/index.html")
})

app.get("/payment",(req,resp)=>{

    const amt  = Number(req.query.amt);

    var instance = new Razorpay({ key_id: 'rzp_test_a7SSRy55tg3DNp', key_secret: 'rMTukwWBdNatIClz8CX3yJ5Q'})

    var options = {
    amount: amt*100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
    };
    
    instance.orders.create(options, function(err, order) {
    console.log(order);
    resp.send(order)
    });

})


app.listen(3000,()=>{
    console.log("server running on port :"+3000);
})