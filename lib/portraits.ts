const base = "https://randomuser.me/api/portraits";

/** Placeholder portrait from randomuser.me (ids 0–99 per gender). */
export const portraitUrl = (gender: "women" | "men", id: number) => `${base}/${gender}/${id}.jpg`;

const woman = (id: number) => portraitUrl("women", id);
const man = (id: number) => portraitUrl("men", id);

/** Portraits for the sample people in the app, keyed by full name. */
export const portraits: Record<string, string> = {
  "Dr. James Carter": man(85),

  "Emily Carter": woman(44),
  "James Miller": man(32),
  "Sophia Nguyen": woman(68),
  "Daniel Lee": man(45),
  "Robert Kim": man(75),
  "Olivia Torres": woman(65),
  "Ava Patel": woman(26),
  "Liam Brooks": man(22),
  "Mia Wong": woman(12),
  "Noah Wilson": man(52),
  "Isabella Rossi": woman(33),
  "Ethan Moore": man(86),
  "Grace Hall": woman(79),
  "Lucas Young": man(18),
  "Chloe Adams": woman(17),
  "Henry Scott": man(60),

  "Jessica Lee": woman(2),
  "Dr. Michael Brown": man(11),

  "Olivia Bennett": woman(90),
  "Liam Carter": man(41),
  "Ava Martinez": woman(57),
};
