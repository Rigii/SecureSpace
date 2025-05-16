# User Sign Up/Login Flow and Data Storage

## Sign Up

If the user hasn't created an account yet, they need to create one.
During the first step of signing up, the user creates an auth entity with minimal authentication data and confirms their email or phone number.

## Onboarding with First Log In

In the second step, the user logs in and fills out the onboarding form.
At the final step, the user generates their master PGP key pair and stores it in:

- Keychain (encrypted with password)
- Redux storage, which uses Secure Storage to keep session data encrypted and persistent across app reloads.
- Database — Only the Public Key is posted to the DB.
  The Private Key is always stored on the client side.

## Logout

The user clears all client-side stored data except the keychain with the Private Key.

## Login

- The client hydrates data from the DB.
- Retrieves the Private Key from the keychain or from a key file.
