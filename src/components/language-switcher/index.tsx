"use client";

import { Select, SelectItem } from "@heroui/react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const locales = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "my", label: "မြန်မာစာ", flag: "🇲🇲" },
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const switchLocale = (targetLocale: string) => {
        if (locale === targetLocale) return;

        const segments = pathname.split("/");
        segments[1] = targetLocale;
        const newPath = segments.join("/");

        router.push(newPath);
        router.refresh(); // 👈 ensures the layout re-runs with correct locale
    };

    const current = locales.find((l) => l.code === locale);

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-300">
                Language:
            </span>
            <Select
                // label={`${current?.label}`}
                className="w-[140px]"
                aria-label="Theme Selector"
                onChange={(e) => switchLocale(e.target.value)}
                selectedKeys={[locale ?? 'en']}
            >
                {locales.map(({ code, label }) => (
                    <SelectItem
                        key={code}
                    >
                        {label}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
}
