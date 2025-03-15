import mongoose, { CallbackError, Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name:string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    resetCode?: string; // Add this line
    role: string; // Add this line
}

const userSchema: Schema = new Schema({
    name:{type:String, required:true},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resetCode: { type: String }, // Add this line
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role field with default 'user'
});

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log("Hashed Password during registration: ", this.password);
        next();
    } catch (error) {
        return next(error as CallbackError);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        console.log("Candidate Password: ", candidatePassword);
        console.log("Stored Hashed Password: ", this.password);
        const result = await bcrypt.compare(candidatePassword, this.password);
        console.log("Comparison Result: ", result);
        return result;
    } catch (error) {
        console.error("Error comparing passwords: ", error);
        throw error;
    }
};

export default mongoose.model<IUser>('User', userSchema);