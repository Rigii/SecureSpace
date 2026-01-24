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
- create keys for chat
- store keys in the keychain
- store keys in files

## User logs out.

- remove the keys from Redux state
- keys stay in the keychain
- keys stay in files

## User logs in on the initial device.

- get account data from the server, including public keys, store in Redux state
- get private keys from the keychain and add them to Redux state
- User deletes the app from the device.
- purge the associated keys from the keychain

key files remain on the device (user can manually transfer them to another device)

## User installs the app on another device.

- get keys from key files
- store them in the keychain
- store them in Redux state
