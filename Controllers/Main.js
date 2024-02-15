import { userModel } from "../DB/Schema.js"
 const Main = ((req,res)=>{
res.send("The Server Working Properly!!")
})

const Add = ((req, res)=>{
    const {email , name , price , description} = req.body
        try {
            let add_user = new userModel({
                email : email,
                name : name,
                price: price,
                description : description,
            })
            add_user.save()
            .then(()=>{
                res.status(200).send("User added successfully");
            }).catch((error)=>{
  console.log(error)
            })
        }
     catch (error) {
          console.log("error: ", error);
          res.status(500).send("Error occurred while adding user");
        }
})



export  {Main , Add};