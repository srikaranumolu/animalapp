# Next.js App with Firebase Authentication

This is a Next.js application with Firebase Authentication integration.

## Getting Started

1. Clone the repository
2. Install dependencies
```bash
npm install
```
3. Set up your Firebase project and authentication
4. Create a `.env.local` file with your Firebase configuration
5. Run the development server
```bash
npm run dev
```

## Firebase Authentication Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup steps
3. Once your project is created, click on the web icon (</>) to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration values for the next step

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Replace the placeholder values with your actual Firebase configuration.

### 3. Enable Authentication Methods

1. In the Firebase console, go to Authentication > Sign-in method
2. Enable the authentication methods you want to use:
   - Email/Password
   - Google
   - (Others as needed)

### 4. Configure Google Authentication

For Google authentication to work properly:

1. In the Firebase console, go to Authentication > Sign-in method
2. Edit the Google provider
3. Make sure your support email is set correctly
4. Add your domain (for production) to the "Authorized domains" list

### Troubleshooting Common Issues

#### "Firebase: Error (auth/internal-error)"

This error can occur for several reasons:

1. **Missing or incorrect environment variables**: Double-check that all Firebase config values are correctly set in your `.env.local` file
2. **Google authentication not properly configured**: Make sure you've completed all steps in the "Configure Google Authentication" section
3. **Popup blockers**: Some browsers block popups by default. Ensure popups are allowed for your site
4. **Cross-Origin issues**: For local development, make sure you're using the correct port that's registered with Firebase

#### "Firebase: Error (auth/unauthorized-domain)"

This occurs when your domain isn't authorized for Firebase authentication:

1. In Firebase console, go to Authentication > Sign-in method
2. Scroll down to "Authorized domains"
3. Add your domain (e.g., `localhost`, your production domain)

## Authentication Features

This app includes:

- Email/password login and registration
- Google authentication
- Password reset functionality
- Error handling with user-friendly messages

## Project Structure

- `/src/app/firebase/` - Firebase configuration and authentication functions
- `/src/app/context/` - React context for authentication state management
- `/src/app/login/` - Login page
- `/src/app/signup/` - Signup page

## Built With

- Next.js
- Firebase Authentication
- React Context API

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
