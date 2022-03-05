## Ventee

<img
  alt="Ventee"
  src="assets/images/icon.png"
  width="256"
/>

**Ventee** is a mobile application that is used to transfer stored contacts between devices

Contacts transferring is done via the [proxy Websockets server](https://github.com/ventee-app/ventee-ws) that does not store any contacts information or information about the connected clients

Stack: [Expo](https://expo.dev), [React Native](https://reactnative.dev), [Typescript](https://www.typescriptlang.org)


### Required device resources

Application asks user to provide an access to contacts (to be able to parse the stored contacts when transferring to another device) and an access to the camera (when receiving the contacts from another device)

Internet connection is required

### Deploy

```shell script
git clone https://github.com/ventee-app/ventee-mobile
cd ./ventee-mobile
nvm use 16
npm i
```

### Websockets server URL

A `constants/backend-url.ts` file stores Websockets server URL and is required, see [constants/backend-url.example.ts](constants/backend-url.example.ts) for the reference

### Launch

```shell script
npm start
```

Run emulators:

```shell script
npm run android
```

```shell script
npm run ios
```

### License

[MIT](LICENSE.md)
