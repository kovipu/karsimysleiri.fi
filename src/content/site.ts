export const site = {
  hero: {
    title: "Kärsimysleiri",
    dates: "7.–9.8.2026",
    location: "Rusko (Vahto)",
    tagline: "Omavarainen gravel-tyhmäpyöräily"
  },

  about: [
    "Kärsimysleiri on koko viikonlopun mittainen soratieultra elokuun ensimmäisenä viikonloppuna. Lähtö ja maali on Vahdon metsästysmajalla Ruskolla.",
    "Tapahtuma ei ole kilpailu, voit suorittaa reitin omaa tahtiasi, samoilla silmillä tai sitten retkeillen.",
    "Osallistumismaksu on 40€."
  ],

  routes: [
    {
      id: "pikku",
      km: 242,
      ascent: "1803m",
      description:
        "Sopivasti kärsimystä."
    },
    {
      id: "keski",
      km: 310,
      ascent: "2329m",
      description:
        "Vähän enemmän kärsimystä.",
    },
    {
      id: "iso",
      km: 467,
      ascent: "4212m",
      description:
        "Kahjo reissu."
    },
  ],

  included: {
    yes: [
      "Kisakeskus Vahdon metsästysmajalla",
      "Ajoseuraa",
      "Ravintoa maalissa",
      "Sauna",
      "Nukkumamahdollisuus maalissa",
    ],
    no: [
      "Kuljetus paikalle",
      "Reitin huolto",
      "Ruoka ja juoma matkalla",
      "Varaosat ja varusteet",
    ],
  },

  practical: [
    {
      title: "Lähtö",
      body: "Yhteislähtö Vahdon metsästysmajalta. Voit valita kahdesta lähtöryhmästä: perjantai kello 18:00 tai lauantai kello 9:00."
    },
    {
      title: "Mitä mukaan",
      body: "Toimiva polkupyörä, navigointiin sopiva laite, omat huoltotarvikkeet ja varusteet vaihteleviin keliolosuhteisiin. Yön yli kestävillä reiteillä myös valaisin on pakollinen.",
    },
    {
      title: "Reitit ja navigointi",
      body: "GPX-tiedostot toimitetaan ilmoittautuneille hyvissä ajoin ennen tapahtumaa. Reitit kulkevat pääosin sora- ja metsäautoteillä, paikoin myös vähäliikenteisillä päällystetyillä osuuksilla.",
    },
    {
      title: "Pysäköinti",
      body: "Vahdon metsästysmajalla on pysäköintimahdollisuus tapahtuman ajaksi.",
    },
    {
      title: "Sää",
      body: "Elokuun alku Lounais-Suomessa: päivisin yleensä lämmin, öisin viileä. Sade on aina mahdollinen — varustaudu sen mukaisesti.",
    },
  ],

  organizer: {
    name: "Konsta Purtsi",
    contact: "Yhteystiedot päivittyvät pian.",
  },
} as const;

export type SiteContent = typeof site;
