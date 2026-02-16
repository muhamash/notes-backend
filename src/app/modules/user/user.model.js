import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { USER_ACTION, USER_ROLES } from "../../utils/enums/users.enum.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      default: USER_ROLES.USER,
    },

    interests: [
      {
        type: String,
        trim: true,
      },
    ],

    userAction: {
      type: String,
      enum: USER_ACTION,
      default: USER_ACTION.ACTIVE
    }
  },
  { timestamps: true }
);

// indexes
// userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ interests: 1 });

//pre middleware for hash password saving
userSchema.pre( "save", async function ()
{
  if ( !this.isModified( "password" ) ) return;

  const salt = await bcrypt.genSalt( 10 );
  this.password = await bcrypt.hash( this.password, salt );
} );


userSchema.methods.comparePassword = async function ( candidatePassword )
{
  return bcrypt.compare( candidatePassword, this.password );
};

export const User = mongoose.models.User || mongoose.model( "User", userSchema );