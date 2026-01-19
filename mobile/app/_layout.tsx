import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FAF9F6',
          },
          headerTintColor: '#1C1C1C',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'RiseUp Collective' }} />
        <Stack.Screen name="auth/login" options={{ title: 'Log In' }} />
        <Stack.Screen name="auth/register" options={{ title: 'Sign Up' }} />
        <Stack.Screen 
          name="feed" 
          options={{ 
            title: 'Community Feed',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="events" 
          options={{ 
            title: 'Events',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="map" 
          options={{ 
            title: 'Solidarity Map',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{ 
            title: 'Profile',
            headerShown: true,
          }} 
        />
        <Stack.Screen name="events/[id]" options={{ title: 'Event Details' }} />
      </Stack>
    </AuthProvider>
  );
}
