declare type LocaleAreas<T> = {
  en: T;
  ja: T;
};

declare type I18nMessageType = {
  extension_description: LocaleAreas<string>;
  text_tweet_page: LocaleAreas<string>;
  text_copy: LocaleAreas<string>;
  text_copy_md_format: LocaleAreas<string>;
  text_copy_only_title: LocaleAreas<string>;
  text_copy_no_param_url: LocaleAreas<string>;
  error_0: LocaleAreas<string>;
  error_1: LocaleAreas<string>;
};
