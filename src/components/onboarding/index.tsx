"use client";

import { useEffect } from "react";
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { usePathname } from "@/i18n/navigation";

export default function OnboardingGuide() {
    const pathname = usePathname();

    // Define steps per page
    const stepsConfig: Record<string, DriveStep[]> = {
        "/flashmap": [
            {
                element: "#flashmap_section",
                popover: {
                    title: "Flash Map",
                    description: "Here you can start learning Kanji by chapters and levels.",
                    side: "right",
                    align: "start",
                },
            },
            {
                element: "#flashmap_level",
                popover: {
                    title: "Select Level",
                    description: "You can choose your Japanese proficiency level here (N5 to N3).",
                    side: "bottom",
                },
            },
            {
                element: "#flashmap_chapter",
                popover: {
                    title: "Select Chapter",
                    description: "You can adjust the chapter within your selected level.",
                    side: "bottom",
                },
            },
        ],

        "/flashboard": [
            {
                element: "#flashboard_section",
                popover: {
                    title: "Flash Board",
                    description: "This is your dashboard for kanji & jukugo progress.",
                    side: "right",
                    align: "start",
                },
            },
            {
                element: "#flashboard_stats",
                popover: {
                    title: "Progress Stats",
                    description: "Here you can see your learning statistics at a glance. Attention to the 'Due Today' and 'Expiring' cards to keep up with your reviews!",
                    side: "bottom",
                },
            },
            {
                element: "#flashboard_calendar",
                popover: {
                    title: "Review Calendar",
                    description: "This calendar shows your review schedule. Click on any date to see the cards due for review on that day.",
                    side: "bottom",
                },
            },
        ],

        "/flashdecks": [
            {
                element: "#flashdecks_section",
                popover: {
                    title: "Flash Decks",
                    description: "Here you can manage your custom kanji/jukugo decks.",
                    side: "bottom",
                },
            },
            {
                element: "#flashdecks_choose",
                popover: {
                    title: "Select Deck",
                    description: "Choose a deck to start studying or reviewing kanji/jukugo.",
                    side: "bottom",
                },
            },
        ],
    };

    useEffect(() => {
        if (!pathname) return;

        const steps = stepsConfig[pathname];
        if (!steps) return; // no onboarding for this route

        const storageKey = `hasSeenOnboarding_${pathname}`;
        const hasSeenGuide = localStorage.getItem(storageKey);

        if (!hasSeenGuide) {
            const driverObj = driver({
                showProgress: true,
                overlayOpacity: 0.6,
                nextBtnText: "Next",
                prevBtnText: "Back",
                doneBtnText: "Finish",
                steps,
            });

            driverObj.drive();
            localStorage.setItem(storageKey, "true");
        }
    }, [pathname]);

    return null;
}
