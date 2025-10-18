import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  league: {
    type: String,
    required: true,
    trim: true
  },
  kickoff_time: {
    type: Date,
    required: true
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop'
  },
  stream_links: [{
    type: String,
    required: true
  }],
  status: { 
    type: String, 
    enum: ["upcoming", "live", "ended"], 
    default: "upcoming" 
  },
  apiFootballId: {
    type: Number,
    unique: true,
    sparse: true
  },
  home_team: {
    type: String,
    required: true,
    trim: true
  },
  away_team: {
    type: String,
    required: true,
    trim: true
  },
  score: { 
    home: { type: Number, default: 0 }, 
    away: { type: Number, default: 0 } 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Match", matchSchema);
