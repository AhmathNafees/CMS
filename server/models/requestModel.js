
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  indexCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndexCustomer',
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This should be the customerCare admin who sends it
    required: true,
  },
    handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // branchAdmin who handled the request
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  
},{timestamps:true});

const Request= mongoose.model('Request', requestSchema);
export default Request;
