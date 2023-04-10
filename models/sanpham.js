var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
  // isbn: {
  //   type: String,
  //   required: true
  // },
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  mau: {
    type: String,
    required: true
  },
  masp:{
    type: String,
    required: true
  },
  makh:{
    type: String,
    required: true
  },
  loaisp:{
    type: String,
    required: true
  },
  tenkh:{
    type: String,
    required: true
  }
  // hinhanh:{
    
  // }
});

module.exports = mongoose.model('SanPham', BookSchema);
