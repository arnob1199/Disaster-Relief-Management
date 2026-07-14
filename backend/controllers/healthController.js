const getHealth = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Disaster Relief API is running'
  });
};

module.exports = { getHealth };
