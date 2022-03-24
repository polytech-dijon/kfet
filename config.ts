export type DashboardLanguage = {
  key: string;
  name: string;
  aliases: string[];
  flag: string;
};
export type BotLanguage = {
  key: string;
  name: string;
  aliases: string[];
}

export type ConfigType = {
  dashLanguages: DashboardLanguage[];
  languages: BotLanguage[];
}

const config: ConfigType = {
  dashLanguages: [
    {
      key: "ar-JO",
      name: "اللغة العربية",
      aliases: ["arabic", "ar"],
      flag: "ar",
    },
    {
      key: "de-DE",
      name: "Deutsch",
      aliases: ["de", "ger", "german", "allemand", "de-DE"],
      flag: "de",
    },
    {
      key: "el-GR",
      name: "Ελληνικά",
      aliases: ["greek", "gr", "el", "Ελληνικά", "el-GR"],
      flag: "gr",
    },
    {
      key: "en-US",
      name: "English",
      aliases: ["en", "anglais", "en_us", "english", "en-US"],
      flag: "gb",
    },
    {
      key: "fr-FR",
      name: "Français",
      aliases: ["fr", "french", "fra", "français", "francais", "fr-FR"],
      flag: "fr",
    },
    {
      key: "ko-KR",
      name: "한국어",
      aliases: ["한국어", "ko", "ko-KR", "Korean", "kr"],
      flag: "kr",
    },
    {
      key: "pl-PL",
      name: "Polski",
      aliases: ["polski", "polish", "pl"],
      flag: "pl",
    },
    {
      key: "pt-PT",
      name: "Português",
      aliases: ["pt", "português", "portuguese", "pt-PT"],
      flag: "pt",
    },
    {
      key: "ru-RU",
      name: "Русский",
      aliases: ["Русский", "russian", "ru"],
      flag: "ru",
    },
    {
      key: "tr-TR",
      name: "Türkçe",
      aliases: ["turkish", "tr", "tr-TR", "turc", "Türk", "Türkçe"],
      flag: "tr",
    },
  ],
  languages: [
    {
      key: "ar-JO",
      name: "اللغة العربية",
      aliases: ["arabic", "ar"],
    },
    {
      key: "bg-BG",
      name: "Българин",
      aliases: ["bulgarian", "bg", "bulg", "България", "bg-BG"],
    },
    {
      key: "de-DE",
      name: "Deutsch",
      aliases: ["de", "ger", "german", "allemand", "de-DE"],
    },
    {
      key: "el-GR",
      name: "Ελληνικά",
      aliases: ["greek", "gr", "el", "Ελληνικά", "el-GR"],
    },
    {
      key: "en-US",
      name: "English",
      aliases: ["en", "anglais", "en_us", "english", "en-US"],
    },
    {
      key: "es-ES",
      name: "Español",
      aliases: ["Español", "spanish", "esp", "es"],
    },
    {
      key: "fr-FR",
      name: "Français",
      aliases: ["fr", "french", "fra", "français", "francais", "fr-FR"],
    },
    {
      key: "ko-KR",
      name: "한국어",
      aliases: ["한국어", "ko", "ko-KR", "Korean", "kr"],
    },
    {
      key: "pl-PL",
      name: "Polski",
      aliases: ["polski", "polish", "pl"],
    },
    {
      key: "pt-PT",
      name: "Português",
      aliases: ["pt", "português", "portuguese", "pt-PT"],
    },
    {
      key: "ru-RU",
      name: "Русский",
      aliases: ["Русский", "russian", "ru"],
    },
    {
      key: "sv-SE",
      name: "Svenska",
      aliases: ["sw", "sv", "se", "swedish", "svenska", "sv-Se"],
    },

    {
      key: "tr-TR",
      name: "Türk",
      aliases: ["turkish", "tr", "tr-TR", "turc", "Türk"],
    },
  ],
}

export default config