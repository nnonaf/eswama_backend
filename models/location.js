module.exports = (Schema) => {
  return new Schema({
    locationName: { type:String, required: true, unique: true },
    active:{ type: Boolean, defualt: true }


  }, { timestamps: true });
}