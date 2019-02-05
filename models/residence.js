module.exports = (Schema) => {
    var DocumentSchema = new Schema({
        type: { type: String, required: true },
        thumb: { type: String, required: true },
        url: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }, { timestamps: true });

    return new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
        address: { type: String},
        // activitiesName: { type: String, required: true },
        activityHistory: [{
            createdAt: { type: Date, default: new Date()},
            activities: [{
                  type: Schema.Types.ObjectId, ref: 'Activities' 
            }]
        }

        ],
        documents: [DocumentSchema],
        verified:{type:Boolean,default:false},
        verifiedBy:{type: Schema.Types.ObjectId, ref: 'User'},
        deactivated:{type:Boolean,default:false},
        deactivatedComplet:{type:Boolean,default:false}

    }, { timestamps: true });
}


