export type JsonValue = string | number | boolean | JsonObject | JsonArray | any;

export interface JsonObject {
  [x: string]: JsonValue;
}

export type JsonArray = Array<JsonValue>