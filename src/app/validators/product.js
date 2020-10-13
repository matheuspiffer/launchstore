async function post(req, res, next) {
  const keys = Object.keys(req.body);
  keys.forEach((key) => {
    if (!req.body[key]) {
      res.send("Please get back and fill " + key);
    }
  });

  if (req.files.length == 0)
    return res.send("Please, choose at least one image");
  next();
}
async function put(req, res, next) {
  const keys = Object.keys(req.body);
  keys.forEach((key) => {
    if (!req.body[key] && key != "removed_files") {
      res.send("Please fill " + key);
    }
  });
  next();
}

module.exports = {
  post,
  put,
};
