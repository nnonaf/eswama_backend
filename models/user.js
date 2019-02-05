


module.exports = (Schema) => {
  var DocumentSchema = new Schema({
    type: { type: String, required: true },
    thumb: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }, { timestamps: true });

  let schema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // role 1 => admin, role 2 => merchant, role 3 => user
    role: { type: Number, default: 2, enum: [1, 2] },
    disabled: { type: Boolean, default: false },
   
    verified: { type: Boolean, default: false },
    documents: [DocumentSchema],
    avatar: {
      thumb: { type: String },
      url: { type: String }
    }
  }, { timestamps: true });

  schema.virtual('isAdmin').get(function () {
    return this.role === 1;
  });

  schema.virtual('isUser').get(function () {
    return this.role === 2;
  });

  
  schema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
  }, 'The e-mail field cannot be empty.');

  return schema;
}

