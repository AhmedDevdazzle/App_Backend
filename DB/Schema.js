import mongoose from 'mongoose';
import moment from 'moment-timezone';
import dotenv from 'dotenv';
dotenv.config();
const productSchema = new mongoose.Schema({
    email : { type: String },
    name : { type: String },
    price: { type: String , required: true },
    description : { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
});
export const userModel = mongoose.model('userModel', productSchema);

const attendenceSchema = new mongoose.Schema({
    username : { type: String },
    password : { type: String },
    attendance: [{
        type: { type: String },
        time: { type: Date, default: () => moment.tz('Asia/Karachi').format( 'YYYY/MM/DD HH:mm' ) }
    }],
    createdOn: { type: Date, default: Date.now },
});
export const AttendenceModel = mongoose.model('Attendence', attendenceSchema);



const mongodbURI = process.env.MONGODB_URL;
/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
