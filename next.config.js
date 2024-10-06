const withSvgr = require("next-svgr");

module.exports = withSvgr({
    webpack: (config, _) => ({
      ...config,
      watchOptions: {
        ...config.watchOptions,
        poll: 800,
        aggregateTimeout: 300,
      },
    }),
  });