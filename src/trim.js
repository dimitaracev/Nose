module.exports = {
  slash: (str) => {
    if (str[0] == "/") str = str.substr(1);
    if (str[str.length - 1] == "/") str = str.substr(0, str.length - 1);
    return str;
  },
};
