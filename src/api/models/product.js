const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: String,
    Seed_RepDate: String,
    Seed_Year: String,
    Seeds_YearWeek: String,
    Seed_Varity: String,
    Seed_RDCSD: String,
    Seed_Stock2Sale: String,
    Seed_Season: String,
    Seed_Crop_Year: String,
});

module.exports = mongoose.model('Product', productSchema);