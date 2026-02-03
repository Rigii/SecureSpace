# Keys Soring/Exchange Flow

# The entities

1. Key file

- permanent storage for public/private PGP keys
- includes user data (email, UUID) to associate the keys with the current user account
- data is encrypted with the user password
- remains on the device after the app is deleted

2. Keychain record

- stores only the private PGP key
- saved under the `${type}-${email}` association. `type`: device or chat private key
- purged when the app is deleted

3. Redux State

- session storage
- purged after logging out

# The Scenario

## User creates an account

- create keys for the app
- store keys in the keychain
- store keys in files (Onboarding - "Save your key")
  **_NB!_** If a user is not found in the database and does not have a public key, they must generate a new key pair and store the public key instead of uploading one.

  **_create keys for chat on first chat open_**

- create keys for chat
- store keys in the keychain
- store keys in files (Join Secure Space Chat - "Create Account")
  **_NB!_** If a User Chat Account is not found in the database and does not have a chat public key, they must generate a new key pair and store the public key instead of uploading one.

## User logs out.

- remove the keys from Redux state
- keys stay in the keychain
- keys stay in files

## User logs in on the initial device.

- get account data from the server, including public keys, store in Redux state
- get private keys from the keychain and add them to Redux state

**_If Key Chain Key Lost_**
The app will redirect user to "Upload your chat key" screen^to upload key file data.

## User deletes the app from the device.

- purge the associated keys from the keychain
- key files remain on the device (user can manually transfer them to another device)

## User installs the app on another device.

- transfer app/chat keys manually
- get keys from key files (Upload your chat key)
- store them in the keychain
- store them in Redux state

## No Key Data

Data and content that cannot be decrypted should remain stored, as the user may apply different keys later.  
It should be displayed as-is.

# Future Features

## Multi-Key Flow

Users will be able to create and use multiple application keys.

## Chat Archive

Encrypted with the application key.  
Chat room data is stored in the file system when sending or retrieving messages.

All chat room data (messages) should also be encrypted in parallel and stored on the device using the user's application key file.  
This is necessary to prevent data loss if a chat key is changed or lost.
