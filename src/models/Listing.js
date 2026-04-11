import mongoose from 'mongoose';

/**
 * Listing Schema
 * Stores marketplace listings with product details
 */
const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a listing title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide images'],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0 && arr.length <= 10;
        },
        message: 'Please provide between 1 and 10 images',
      },
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
      minlength: [3, 'Location must be at least 3 characters'],
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Listing', listingSchema);
