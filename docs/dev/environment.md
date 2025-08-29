# Environment Variables Apply

To apply environment variables within the project, used `react-native-dotenv` package.
It fetch the variables from the **`.env`** file.
To avoid Type Script type issuses with unknown environment variables types, used **`env.d.ts`**.

## Main sources:

- **`react-native-dotenv`** package
- **`.env`** and **`.env.stage`** files - with actual environment variables
- **`env.d.ts`** file - to declare environment variable types for the Type Script

The **`env.d.ts`** file should be declared in **`tsconfig.json`**

## Env Switch

1. To access `.env.staging` or other .env files with name extantions, open the path in `babel.config.js`:

```js
  const env = process.env.ENV || 'default';

...
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
```

2. To run Staging Version in **_`package.json`_** declare `ENV` with .env file extention name (like "stage"):
   `"stage:debug": "ENV=stage react-native start --experimental-debugger --reset-cache"`

## Production Build Env's

The production build will be created with the default `.env`
