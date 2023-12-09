const  crypto =  require("crypto");

const app_id = BigInt(
  parseInt(crypto.randomBytes(20).toString("hex"), 16)
).toString(); 
console.log(app_id);