declare type LocaleAreas<T> = {
  en: T;
  ja: T;
};

declare type I18nMessageType = {
  extension_description: LocaleAreas<string>;
  share_twitter: LocaleAreas<string>;
  share_bsky: LocaleAreas<string>;
  share_facebook: LocaleAreas<string>;
  share_hatena: LocaleAreas<string>;
  share_note: LocaleAreas<string>;
  copy: LocaleAreas<string>;
  copy_md_format: LocaleAreas<string>;
  copy_only_title: LocaleAreas<string>;
  copy_no_param_url: LocaleAreas<string>;
  contextmenu_sns: LocaleAreas<string>;
  error_unavailable: LocaleAreas<string>;
  error_copy_failed: LocaleAreas<string>;
};
