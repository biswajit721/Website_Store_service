import mongoose from "mongoose";


const packageSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  revisions: {
    type: Number,
    required: true,
  },
  features: [
    {
      type: String,
    },
  ],
});

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});


const reviewSchema = new mongoose.Schema({
  userName: String,
  avatar: String,
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    image: {
      type: [String],
      required: true,
    },

    avatar: {
      type: String,
    },

    basePrice: {
      type: Number,
      required: true,
    },

    displayPrice: {
      type: String, // ex: ₹2,999
    },

    rating: {
      type: Number,
      default: 3,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    liveDemoUrl: {
      type: String,
      default:"https://maker-lane-co.lovable.app/"
    },

    /* ===== Packages ===== */
    packages: {
      Basic: packageSchema,
      Standard: packageSchema,
      Premium: packageSchema,
    },

    /* ===== FAQs ===== */
    faqs: [faqSchema],

    /* ===== Reviews ===== */
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

 const Service = mongoose.model("Service", serviceSchema);
 export default Service
