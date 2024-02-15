import express from 'express'
const router = express.Router();
import {Main , Add} from '../Controllers/Main.js'
import { AttendenceModel } from '../DB/Schema.js';
router.get('/' , Main)
router.get('/api/v1/add' ,Add )
// router.post('/Login' ,Add )
router.post('/attendance', async (req, res) => {
    try {
            const {username ,  password , attendence} = req.body;
            let add_user = new AttendenceModel({
                username : username,
                password : password,
                attendence : attendence,
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
    
});



export default router