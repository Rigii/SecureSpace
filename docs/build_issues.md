# XCODE build issues 
Current Device MacBook M1

## Errors

### Command PhaseScriptExecution failed with a nonzero exit code

(xcode m1 Intermediates.noindex/Pods.build/Debug-iphonesimulator/hermes-engine.build/Script-46EB2E00021610.sh: line 9: /Users/user/.nvm/versions/node/v21.6.1/bin/node: No such file or directory)

- `npx react-native upgrade` (root folder)
- del: Pods and build folders, .xcode.env.local, Podfile.lock (`rm -rf Pods, ...`)
- Install pods with Bundle: `bundle install` `bundle exec pod install`


If Above solutions doesen't helped (resolved my issue 16.05.2024, current Node v18.15.0):

- remove ios folder
- create new react-native project with sane name
- relocate ios folder from the current project

Current RN instructions:

  Run instructions for Android:
    • Have an Android emulator running (quickest way to get started), or a device connected.
    • cd "/Users/jakobs/Documents/Projects/SecureSpace/SecureSpaceApplicaton" && npx react-native run-android
  
  Run instructions for iOS:
    • cd "/Users/jakobs/Documents/Projects/SecureSpace/SecureSpaceApplicaton/ios"

N.B! Some libs could be needed to be updated or reinstalled. 