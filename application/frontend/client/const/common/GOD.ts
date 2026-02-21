export const GOD = {
  TYPE_TEXT: {
    1: "第一の剣",
    3: "第三の剣",
    2: "第二の剣",
  } as Record<number, string>,
  TYPE_ORDER: [1, 3, 2] as readonly number[],
} as const;
