// Annotation content for the typography study. Each entry is an interest point
// on the sheet: a numbered marker at (x,y) in the 612x793 sheet space, and the
// reasoning that opens when you click it.
//
// Copy is Alexander's. Fixed obvious spelling/grammar (see notes to him) and used
// proper typographic quotes/apostrophes since this is a typography piece. Positions
// are rough starting points — nudge with the Agentation tool.

export type Annotation = {
  id: string;
  n: number; // number shown in the marker + reading order
  x: number; // px from left of the sheet (0–612)
  y: number; // px from top of the sheet (0–793)
  title: string;
  body: string;
};

export const frontAnnotations: Annotation[] = [
  {
    id: "contrast",
    n: 1,
    x: 446,
    y: 474,
    title: "Increased contrast",
    body: "I lightened up the menu paper color to increase the contrast between the page and the menu’s contents, thereby improving legibility in the bar’s low light. Gold was removed as a color altogether and replaced with a dark green, just light enough to be differentiated from the ink black of the cocktail names and ingredients. The green color was derived from wallpaper used in the bar.",
  },
  {
    id: "layout",
    n: 2,
    x: 517,
    y: 117,
    title: "Layout & Size",
    body: "The bar program was reorganized by Hello, Marjorie’s staff to emphasize classic cocktails, increasing the number of cocktails on the menu from 18 to 30. This presented a major problem for the old menu, in layout and size. This spurred the idea to remove the two old sections, “House Cocktails” and “Classics & New Classic Variations,” and replace them with liquor categories, ordered by general popularity. Additionally, the menu size increased to the standard 8.5″ × 11″ to accommodate the increase in number of cocktails while maintaining ease of print.",
  },
  {
    id: "house",
    n: 3,
    x: 81,
    y: 365,
    title: "House cocktails",
    body: "House cocktails still needed to be featured prominently while staying within the new liquor category layout. The simplest way to achieve this was by adding an “M” dot to delineate house cocktails.",
  },
  {
    id: "price",
    n: 4,
    x: 315,
    y: 37,
    title: "Price & Tax",
    body: "Previously, all house cocktails were the same price, but anything in the “Classics & New Classic Variations” section could be anywhere from $11 to $14. The bar decided to settle all prices at an even $13, and factored tax into this price as well, to keep things particularly simple for patrons and in keeping with a growing trend in the hospitality world. The legend needed to communicate the new tax policy subtly, which seemed an appropriate place for the House Cocktail “M” dot too.",
  },
  {
    id: "type",
    n: 5,
    x: 73,
    y: 227,
    title: "Type & Hierarchy",
    body: "Liquor type is emphasized in all caps and green, set in the serif, which was selected as an update to the old menu’s serif. The old menu design is an homage to a newspaper, which is part of the bar’s history and a foundation of its brand, so the typewriter monospace typeface was essential and had to carry over to my new menu design. To achieve greater contrast and readability for patrons, I increased the weight of the cocktail names, while italicizing the ingredient lists.",
  },
  {
    id: "dividers",
    n: 6,
    x: 292,
    y: 697,
    title: "Dividers",
    body: "Divider lines were an essential element of the old menu’s newspaper-esque design, so these carried over to the new design, albeit minimally and no longer for ornamentation.",
  },
];
