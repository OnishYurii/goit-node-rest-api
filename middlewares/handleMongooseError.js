export const handleMongooseError = (error, data, next) => {
  error.status = 400;
  console.log(data);
  next();
};
