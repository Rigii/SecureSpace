# Chat Flow

# Entities

1. Private rooms. Content is encrypted with the public keys of all participants.
2. Public rooms. Content is encrypted with a room key.
3. User Chat accout. Separate from the general app user account.

# Flow

## Create Chat Account

## Fetch Encryption Keys

## Create Room

## Accept/Decline Room Invitation

## Receive Messages

1. User in room

- messages are listened to on the room channel
- messages are displayed in the room list
- all room event popups are disabled

2. User is in the app (but not in a room)

- messages are listened to on the user’s private channel
- messages are displayed as popups
- all room event popups are enabled
