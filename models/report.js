module.exports = (Schema) => {
  return new Schema({
    location: { type: Schema.Types.ObjectId, ref: ' Location', required: true },
    from: [
      { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    status:{type:Boolean,default:false}
}, { timestamps: true });
}