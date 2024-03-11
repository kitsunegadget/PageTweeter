type CopyType =
  | "COPY"
  | "COPY_MD_FORMAT"
  | "COPY_ONLY_TITLE"
  | "COPY_NO_PARAM_URL";

type ActionType = "TWEET" | "BSKY" | "FACEBOOK" | "HATENA" | "NOTE" | CopyType;
