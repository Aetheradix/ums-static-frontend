import React, { useEffect, useRef, useState } from 'react';
import { translations as erpTranslations } from '../constants/translations';
import { translations as davvTranslations } from '../../features/davv-cms/constants/translations';
import type { Language } from './LanguageContext';
import { LanguageContext } from './LanguageContext';

// Merge both dictionaries dynamically
const translations: Record<string, Record<string, string>> = {
  en: { ...erpTranslations.en, ...davvTranslations.en },
  hi: { ...erpTranslations.hi, ...davvTranslations.hi },
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = sessionStorage.getItem('app_language');
    // Default to English ('en')
    return (stored as Language) || 'en';
  });

  const observerRef = useRef<MutationObserver | null>(null);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    sessionStorage.setItem('app_language', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };
  const t = (key: string): string => {
    if (!key) return '';

    // Search in active language dictionary
    const activeDict = translations[language];
    if (activeDict && activeDict[key] !== undefined) {
      return activeDict[key];
    }

    // If active language is English, do not fall back to Hindi
    if (language === 'en') {
      return key;
    }

    // Fall back to Hindi
    const hiDict = translations['hi'];
    if (hiDict && hiDict[key] !== undefined) {
      return hiDict[key];
    }

    // Fall back to English
    const enDict = translations['en'];
    if (enDict && enDict[key] !== undefined) {
      return enDict[key];
    }

    return key;
  };
  // ─── Translation Guard helpers ─────────────────────────────────────────
  // Returns true if an element is an icon and should NOT be translated
  const isIconElement = (el: HTMLElement): boolean => {
    const tag = el.tagName?.toLowerCase();
    if (tag === 'i' || tag === 'em') {
      const cls = el.className || '';
      // PrimeIcons: <i class="pi pi-home" />
      if (cls.includes('pi ') || cls.startsWith('pi-') || cls === 'pi')
        return true;
      // Material Symbols / Material Icons
      if (cls.includes('material-symbols') || cls.includes('material-icons'))
        return true;
      // FontAwesome
      if (
        cls.includes('fa ') ||
        cls.includes('fas ') ||
        cls.includes('far ') ||
        cls.includes('fab ')
      )
        return true;
    }
    // <span> used as icon containers
    if (tag === 'span') {
      const cls = el.className || '';
      if (cls.includes('material-symbols') || cls.includes('material-icons'))
        return true;
      if (
        cls.includes('p-icon') ||
        cls.includes('pi ') ||
        cls.startsWith('pi-')
      )
        return true;
    }
    return false;
  };

  // Returns true if the text looks like an icon name / class name (should NOT be translated)
  const isIconLikeText = (text: string): boolean => {
    const t = text.trim();
    // PrimeIcon class patterns: "pi pi-home", "pi-home"
    if (/^pi\s+pi-/.test(t)) return true;
    if (/^pi-[a-z]/.test(t)) return true;
    // Single lowercase hyphenated word (icon names like "arrow-up", "check-circle")
    if (/^[a-z]+(-[a-z]+)+$/.test(t)) return true;
    // Material icon names (single lowercase word with underscores)
    if (/^[a-z][a-z0-9_]+$/.test(t) && t.length <= 30 && !t.includes(' ')) {
      // Heuristic: icon names don't have vowel-consonant patterns of real words > 2 syllables
      // Skip if no spaces and all lowercase — likely an icon identifier
      if (t.length <= 20 && !/\s/.test(t) && /^[a-z_]+$/.test(t)) return true;
    }
    // CSS class-like: dot notation, no spaces
    if (/^[a-z][a-z0-9_-]*(\.)[a-z][a-z0-9_-]*$/.test(t)) return true;
    return false;
  };

  // Run DOM scanner and MutationObserver
  useEffect(() => {
    const hiDict = translations['hi'] || {};
    // Sort keys by length descending to replace longer phrases first (avoids partial matching conflicts)
    const sortedKeys = Object.keys(hiDict).sort((a, b) => b.length - a.length);

    // ── Escape special regex characters in translation keys ──
    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // ── Pre-compile word-boundary regexes for all keys (for performance) ──
    // \b works for ASCII word boundaries. For keys starting/ending with non-ASCII
    // (Hindi chars), we fall back to a lookahead/lookbehind on English letters.
    const regexCache = new Map<string, RegExp>();
    for (const key of sortedKeys) {
      const escaped = escapeRegex(key);
      // Use negative lookbehind/lookahead on [a-zA-Z] so that:
      //   "Exam" does NOT match inside "Examination"  ✔️
      //   "Exam" DOES match standalone "Exam"          ✔️
      //   "Examination" (longer key) matches first     ✔️
      regexCache.set(
        key,
        new RegExp(`(?<![a-zA-Z])${escaped}(?![a-zA-Z])`, 'g')
      );
    }

    const restoreNode = (node: Node) => {
      // Restore text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        if ((node as any).__originalText !== undefined) {
          node.nodeValue = (node as any).__originalText;
        }
      }

      // Restore attribute nodes
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if ((el as any).__originalPlaceholder !== undefined) {
          el.setAttribute('placeholder', (el as any).__originalPlaceholder);
        }
        if ((el as any).__originalTitle !== undefined) {
          el.setAttribute('title', (el as any).__originalTitle);
        }
        if ((el as any).__originalAlt !== undefined) {
          el.setAttribute('alt', (el as any).__originalAlt);
        }
        el.childNodes.forEach(restoreNode);
      }
    };

    const translateNode = (node: Node) => {
      // 1. Text Node translation
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        if (text && text.trim()) {
          // ── Guard: skip if parent is an icon element ──
          const parent = node.parentElement;
          if (parent && isIconElement(parent)) return;

          // ── Guard: skip if the text itself looks like an icon name ──
          if (isIconLikeText(text.trim())) return;

          const originalText =
            (node as any).__originalText !== undefined
              ? (node as any).__originalText
              : text;
          let translatedText = originalText;
          let updated = false;

          for (const key of sortedKeys) {
            if (originalText.includes(key)) {
              const re = regexCache.get(key)!;
              re.lastIndex = 0; // reset global regex state
              const next = translatedText.replace(re, hiDict[key]);
              if (next !== translatedText) {
                translatedText = next;
                updated = true;
              }
            }
          }

          if (updated) {
            if ((node as any).__originalText === undefined) {
              (node as any).__originalText = text;
            }
            node.nodeValue = translatedText;
          }
        }
      }

      // 2. Element Node translation (for placeholder, title, alt attributes)
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;

        // Skip translation for scripts, styles, and icon elements
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
        if (isIconElement(el)) return;

        // Translate placeholder
        const placeholder = el.getAttribute('placeholder');
        if (placeholder && placeholder.trim()) {
          const originalPlaceholder =
            (el as any).__originalPlaceholder !== undefined
              ? (el as any).__originalPlaceholder
              : placeholder;
          let translatedPlaceholder = originalPlaceholder;
          let updated = false;

          for (const key of sortedKeys) {
            if (originalPlaceholder.includes(key)) {
              const re = regexCache.get(key)!;
              re.lastIndex = 0;
              const next = translatedPlaceholder.replace(re, hiDict[key]);
              if (next !== translatedPlaceholder) {
                translatedPlaceholder = next;
                updated = true;
              }
            }
          }

          if (updated) {
            if ((el as any).__originalPlaceholder === undefined) {
              (el as any).__originalPlaceholder = placeholder;
            }
            el.setAttribute('placeholder', translatedPlaceholder);
          }
        }

        // Translate title
        const title = el.getAttribute('title');
        if (title && title.trim()) {
          const originalTitle =
            (el as any).__originalTitle !== undefined
              ? (el as any).__originalTitle
              : title;
          let translatedTitle = originalTitle;
          let updated = false;

          for (const key of sortedKeys) {
            if (originalTitle.includes(key)) {
              const re = regexCache.get(key)!;
              re.lastIndex = 0;
              const next = translatedTitle.replace(re, hiDict[key]);
              if (next !== translatedTitle) {
                translatedTitle = next;
                updated = true;
              }
            }
          }

          if (updated) {
            if ((el as any).__originalTitle === undefined) {
              (el as any).__originalTitle = title;
            }
            el.setAttribute('title', translatedTitle);
          }
        }

        // Translate alt
        const alt = el.getAttribute('alt');
        if (alt && alt.trim()) {
          const originalAlt =
            (el as any).__originalAlt !== undefined
              ? (el as any).__originalAlt
              : alt;
          let translatedAlt = originalAlt;
          let updated = false;

          for (const key of sortedKeys) {
            if (originalAlt.includes(key)) {
              const re = regexCache.get(key)!;
              re.lastIndex = 0;
              const next = translatedAlt.replace(re, hiDict[key]);
              if (next !== translatedAlt) {
                translatedAlt = next;
                updated = true;
              }
            }
          }

          if (updated) {
            if ((el as any).__originalAlt === undefined) {
              (el as any).__originalAlt = alt;
            }
            el.setAttribute('alt', translatedAlt);
          }
        }

        // Recursively translate children
        el.childNodes.forEach(translateNode);
      }
    };

    if (language === 'hi') {
      // Initial translation of the DOM
      translateNode(document.body);

      // Initialize MutationObserver
      const observer = new MutationObserver(mutations => {
        // Disconnect observer to prevent infinite loops when mutating DOM nodes
        observer.disconnect();

        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              translateNode(node);
            });
          } else if (mutation.type === 'characterData') {
            translateNode(mutation.target);
          }
        });

        // Reconnect observer
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      observerRef.current = observer;
    } else {
      // Restore all text elements back to English instantly
      restoreNode(document.body);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, setLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
