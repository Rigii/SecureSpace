# Environment Variables Apply

To apply environment variables within the project, used `react-native-dotenv` package.
It fetch the variables from the **`.env`** file.
To avoid Type Script type issuses with unknown environment variables types, used **`env.d.ts`**.

## Main sources:

- **`react-native-dotenv`** package
- **`.env`** file - with actual environment variables
- **`env.d.ts`** file - to declare environment variable types for the Type Script

The **`env.d.ts`** file should be declared in **`tsconfig.json`**
