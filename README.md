How to run the app : 
1. yarn install
2. npx expo start

Stack : React Native

Redux: I uses this to handle props and data as multiple screen will be reusing the same data and to handle loading, error logic whihc are repeated across many places. This can avoid duplicating multiple fetch and also without the need to pass props across multiple screen but instead through one shared source.

Flatlist : To handle lazyloading if data is large, onEndReached to allow load more 

Separate layers : 
1. Data Layer - handle communications - api calls 
2. Domain layer - handle app states, rules - redux
3. Presentation layer - user ui interface - the screens, and reusable components

Spliting allow future easier maintainance, readability and easier debugging. 

AI Usage : 
1. Which library to uses when in planning stage
2. Guidance usage for some condition (example : in detail.js how to get param from url -> 'useLocalSearchParams' which only triggers re-renders when the current screen parameters change)
3. Final bug fix and clean up unuse components / file











# Welcome to your Expo app 👋










This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
