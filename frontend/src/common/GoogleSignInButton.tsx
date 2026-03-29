import { Alert, Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

type GoogleSignInButtonProps = {
  buttonText?: "continue_with" | "signin_with" | "signup_with";
  disabled?: boolean;
  onCredential: (credential: string) => void | Promise<void>;
};

declare global {
  interface Window {
    google?: any;
  }
}

const loadGoogleIdentityScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Script load failed")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Script load failed"));
    document.head.appendChild(script);
  });

export const GoogleSignInButton = ({
  buttonText = "continue_with",
  disabled = false,
  onCredential,
}: GoogleSignInButtonProps) => {
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const clientId = String(import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();

  useEffect(() => {
    let isMounted = true;

    const initializeGoogleButton = async () => {
      if (!clientId) {
        if (isMounted) {
          setSetupError("Google sign-in is not configured yet. Add VITE_GOOGLE_CLIENT_ID in frontend/.env or frontend/.env.local.");
        }
        return;
      }

      try {
        await loadGoogleIdentityScript();

        if (!isMounted || !buttonContainerRef.current || !window.google?.accounts?.id) {
          return;
        }

        setSetupError(null);
        buttonContainerRef.current.innerHTML = "";

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential?: string }) => {
            if (response?.credential) {
              void onCredential(response.credential);
            }
          },
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(buttonContainerRef.current, {
          theme: "outline",
          size: "large",
          text: buttonText,
          shape: "pill",
          width: 360,
        });
      } catch (_error) {
        if (isMounted) {
          setSetupError("Unable to load Google sign-in. Please check your frontend Google client ID.");
        }
      }
    };

    initializeGoogleButton();

    return () => {
      isMounted = false;
    };
  }, [buttonText, clientId, onCredential]);

  if (setupError) {
    return <Alert severity="info">{setupError}</Alert>;
  }

  return (
    <Box
      sx={{
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <div ref={buttonContainerRef} className="flex justify-center" />
    </Box>
  );
};
