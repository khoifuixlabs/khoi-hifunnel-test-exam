# UserContext Documentation

## Overview

The UserContext provides centralized authentication state management for the application. It automatically checks for stored access tokens on app initialization and fetches user profile information.

## Features

- Automatic token validation on app load
- User profile fetching from `/api/profile` endpoint
- Secure token storage (only access token in localStorage)
- Loading states management
- Authentication status tracking

## Usage

### Using the Hook

```typescript
import { useUser } from '@/contexts/UserContext';

function MyComponent() {
  const { user, isLoading, isAuthenticated, login, logout, refreshUser } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <div>Welcome, {user.email}!</div>;
  }

  return <div>Please log in</div>;
}
```

### Available Properties and Methods

#### Properties

- `user: User | null` - The current user object with id, email, and role
- `isLoading: boolean` - Whether the authentication check is in progress
- `isAuthenticated: boolean` - Whether the user is currently authenticated

#### Methods

- `login(token: string): Promise<void>` - Login with an access token
- `logout(): void` - Clear authentication state and remove token
- `refreshUser(): Promise<void>` - Manually refresh user profile from API

### User Object Structure

```typescript
interface User {
  id: string;
  email: string;
  role: string;
}
```

## Implementation Details

- Only the access token is stored in localStorage
- User information is fetched from the API on each app load
- Invalid tokens are automatically removed
- The context is provided at the root level in `layout.tsx`

## Example Login Flow

```typescript
// In your login component
const { login } = useUser();

const handleLogin = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (response.ok) {
    await login(result.accessToken);
    // User is now authenticated and user data is available
  }
};
```
