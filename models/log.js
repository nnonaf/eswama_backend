module.exports = (Schema) => {
  let schema = new Schema({
    key: { type: String, required: true },
    type: { type: String, required: true },
    level: { type: String, enum: ['info', 'warning', 'error'], default: 'info' },
    data: { type: Schema.Types.Mixed, required: true },
  }, { timestamps: true });

  return schema;
}