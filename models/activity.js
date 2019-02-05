module.exports = (Schema) => {
  return new Schema({
    activitiesName: { type: String, required: true },
    fee: { type: Number, required: true },
    active: { type: Boolean, defualt:true }

  }, { timestamps: true });
}