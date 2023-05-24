module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        seatCount: Number
      },
      { timestamps: true }
    );
  
    const Coach = mongoose.model("coach_data", schema);
    return Coach;
  };