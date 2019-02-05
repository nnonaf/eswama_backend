module.exports = (Schema) => {
    return new Schema({
        residence: { type: Schema.Types.ObjectId, ref: 'Residence', required: true },
        amount: { type: Number, required: true },
        isCleared: { type: Boolean, default: false }

    }, { timestamps: true });
}