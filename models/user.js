import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  otp: { 
    type: String, 
    required: false 
  },
  otpExpires: { 
    type: Date, 
    required: false 
  },
  walletBalance: { 
    type: Number, 
    default: 0, // Por defecto, el saldo inicial es 0
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('User', userSchema);
