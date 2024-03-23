import mongoose from "mongoose";

const radioChannelSchema = new mongoose.Schema({
    imagePath:{ type:String},
    stationName: { type: String,  },
    frequency:{ type: String },
    stationLink : { type: String,  }
});

export const RadioChannel = mongoose.model('RadioChannel', radioChannelSchema);
