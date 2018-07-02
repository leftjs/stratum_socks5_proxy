module.exports = {
  webpack: (config, options, webpack) => {
    config.devtool = false;
    config.externals = [];
    config.plugins.splice(1, 1);
    return config;
  }
};
