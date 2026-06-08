import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router'; // Ajout de useRouter
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking'; // Ajout de l'écouteur de liens
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter(); // Initialisation du routeur pour faire la redirection

  useEffect(() => {
    // Fonction qui analyse l'URL et effectue la redirection
    const handleDeepLink = (event) => {
      if (!event || !event.url) return;
      
      // On parse l'URL du QR code
      const data = Linking.parse(event.url);
      
      // On extrait l'ID du transat (gère les deux formats d'URL potentiels)
      const transatId = data.queryParams?.transat || data.queryParams?.['/transat'];

      if (transatId) {
        // Redirection forcée vers l'écran de login en passant l'ID du transat
        router.push({
          pathname: '/(tabs)/login',
          params: { id_tables_transat: transatId }
        });
      }
    };

    // 1. Cas où l'appli était complètement fermée (Cold Start)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // 2. Cas où l'appli tournait déjà en arrière-plan
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Nettoyage de l'écouteur quand le composant est démonté
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}