import { useCallback, useEffect, useState } from 'react';

//Font loading
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen"

//Nav component
import FlashNavigation from "./Navigation/FlashNavigation"

//Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

//Custom Font Imports
function fetchFonts() {
  return Font.loadAsync({
    "open-sans-light": require("./assets/Fonts/OpenSansCondensed-Light.ttf"),
    "open-sans-bold": require("./assets/Fonts/OpenSansCondensed-Bold.ttf"),
    "open-sans-light-italic": require("./assets/Fonts/OpenSansCondensed-LightItalic.ttf"),
  });
}

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await fetchFonts();

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setFontLoaded(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!fontLoaded) {
    return null;
  }

  return <FlashNavigation />;
}


