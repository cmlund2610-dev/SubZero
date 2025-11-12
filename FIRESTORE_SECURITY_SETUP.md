# Firestore Security Rules Setup

## Quick Fix (For Testing - NOT for Production)

If you want to test immediately, you can temporarily use open rules:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project "beehive-45129"
3. Go to **Firestore Database** → **Rules** tab
4. Replace with this (TEMPORARY ONLY):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Click **Publish**

⚠️ **This allows ANY authenticated user to read/write ANY data - only for testing!**

---

## Proper Security Rules (Recommended)

### Option 1: Manual Setup (Fastest)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project "beehive-45129"
3. Go to **Firestore Database** → **Rules** tab
4. Copy and paste the content from `firestore.rules` file
5. Click **Publish**

### Option 2: Deploy via Firebase CLI

1. Install Firebase CLI (if not already):
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init firestore
```
- Select your existing project "beehive-45129"
- Use `firestore.rules` as the rules file
- Don't overwrite if it asks

4. Deploy the rules:
```bash
firebase deploy --only firestore:rules
```

---

## What These Rules Do

✅ **Allow authenticated users to:**
- Read/write their own user document
- Read/write clients in their company
- Create/update/delete notes and tasks for their company's clients
- Read other users in their company

❌ **Prevent:**
- Unauthenticated access
- Access to other companies' data
- Deleting notes created by other users (except own notes)

---

## Troubleshooting

### "Missing or insufficient permissions"
- Your Firestore rules are too restrictive or not deployed
- Make sure you're signed in
- Check that `userCompany.id` exists in your session

### Rules not taking effect
- Wait 1-2 minutes after publishing
- Clear browser cache
- Sign out and sign in again

### Testing Rules
You can test rules in Firebase Console:
1. Go to **Firestore Database** → **Rules** tab
2. Click **Rules Playground**
3. Test with your user ID and company ID
