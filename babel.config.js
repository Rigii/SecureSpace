module.exports = function (api) {
  api.cache(true);

  const env = process.env.ENV || 'default';

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      'nativewind/babel',
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: env === 'default' ? '.env' : `.env.${env}`, // to use .env.stage
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
