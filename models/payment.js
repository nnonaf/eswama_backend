module.exports = (Schema) => {
    return new Schema({
        bill: { type: Schema.Types.ObjectId, ref: 'Bill' },
        // processing: { type: Boolean, default: false },
        // processed: { type: Boolean, default: false },
        fault: { type: Boolean, default: false },
        verified: { type: Boolean, default: false },
        reference: { type: String, required: true },
        amount: { type: Number, required: true },
        amountPaid: { type: Number }
    }, { timestamps: true });
}
