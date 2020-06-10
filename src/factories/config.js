import GLOBALS from "../constants/globals";

const config = {
  get: options => ({
    path: options.path || "",
    hookUri: options.hookUri || "",
    channel: options.channel || "", // Optional prop
    username: options.username || "", // Optional prop
    project: {
      name: options?.project?.name || "",
      boardUrl: options?.project?.boardUrl || "",
      key: options?.project?.key || "", // String / Array / Regex
    },
    messages: {
      title: options?.messages?.title || GLOBALS.MESSAGES.TITLE,
      added: {
        description: options?.messages?.added?.description || GLOBALS.MESSAGES.ADDED.DESCRIPTION,
        body: options?.messages?.added?.body || GLOBALS.MESSAGES.ADDED.BODY,
        footer: options?.messages?.added?.footer || "",
      },
      changed: {
        description: options?.messages?.changed?.description || GLOBALS.MESSAGES.CHANGED.DESCRIPTION,
        body: options?.messages?.changed?.body || GLOBALS.MESSAGES.CHANGED.BODY,
        footer: options?.messages?.changed?.footer || "",
      },
      removed: {
        description: options?.messages?.removed?.description || GLOBALS.MESSAGES.REMOVED.DESCRIPTION,
        body: options?.messages?.removed?.body || GLOBALS.MESSAGES.REMOVED.BODY,
        footer: options?.messages?.removed?.footer || "",
      },
    },
  }),
};

export default config;
