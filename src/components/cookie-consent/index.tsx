'use client';

import { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { Button, Card } from "@heroui/react";

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = Cookies.get("fk_cookie_consent");
        if (!consent) {
            setShowBanner(true);
        } else if (consent === "true") {
            loadGoogleAnalytics();
        }
    }, []);

    const handleAccept = () => {
        Cookies.set("fk_cookie_consent", "true", { expires: 365 });
        loadGoogleAnalytics();
        setShowBanner(false);
    };

    const handleReject = () => {
        Cookies.set("fk_cookie_consent", "false", { expires: 365 });
        setShowBanner(false);
    };

    const loadGoogleAnalytics = () => {
        if (typeof window === "undefined") return;

        // Load GA script
        const script1 = document.createElement("script");
        script1.src = "https://www.googletagmanager.com/gtag/js?id=G-DFN1W13SY3";
        script1.async = true;
        document.head.appendChild(script1);

        const script2 = document.createElement("script");
        script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-DFN1W13SY3');
    `;
        document.head.appendChild(script2);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 px-4">
            <Card className="p-4 border border-orange-400 w-full max-w-2xl shadow-lg">
                <p className="text-sm mb-2">
                    We use cookies to enhance your learning experience and to understand how users interact with FlashKanji. This helps us improve the app and make it more effective for your studies. Do you accept the use of cookies?
                </p>
                <div className="flex gap-3 justify-end">
                    <Button size="sm" variant="light" onClick={handleReject}>
                        Reject
                    </Button>
                    <Button size="sm" color="primary" onClick={handleAccept}>
                        Accept
                    </Button>
                </div>
            </Card>
        </div>
    );
}
