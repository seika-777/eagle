"use client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

type InsertedItem = {
  name: string;
  isGlobal: boolean;
};

export default function EmotionCacheProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cache] = useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: InsertedItem[] = [];
    cache.insert = (...args) => {
      const [selector, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({
          name: serialized.name,
          isGlobal: !selector,
        });
      }
      return prevInsert(...args);
    };
    (cache as unknown as { _inserted: InsertedItem[] })._inserted = inserted;
    return cache;
  });

  useServerInsertedHTML(() => {
    const inserted = (cache as unknown as { _inserted: InsertedItem[] })
      ._inserted;
    if (inserted.length === 0) return null;

    let styles = "";
    let dataEmotionAttribute = cache.key;
    const globals: { name: string; style: string }[] = [];

    inserted.forEach(({ name, isGlobal }) => {
      const style = cache.inserted[name];
      if (typeof style !== "boolean") {
        if (isGlobal) {
          globals.push({ name, style: style as string });
        } else {
          styles += style;
          dataEmotionAttribute += ` ${name}`;
        }
      }
    });

    (cache as unknown as { _inserted: InsertedItem[] })._inserted = [];

    return (
      <>
        {globals.map(({ name, style }) => (
          <style
            key={name}
            data-emotion={`${cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        ))}
        {styles && (
          <style
            data-emotion={dataEmotionAttribute}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        )}
      </>
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
