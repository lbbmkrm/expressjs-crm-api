const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export default validate;
