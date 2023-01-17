// import { Config } from "@prisma/client";
import * as fs from "fs";
import sha256File from "sha256-file";
import { prisma } from "./prisma.server";
import isValidPath from "is-valid-path";
import isValidMime from "is-valid-mime";

export const predefinedParsers = {
  "nginx-proxy-manager":
    '[%d:%t %^] %^ %^ %s - %m %^ %v "%U" [Client %h] [Length %b] [Gzip %^] [Sent-to %^] "%u" "%R"',
  COMMON: '%h %^ %^ [%d:%t %^] "%r" %s %b',
  VCOMMON: '%v %h %l %u %t "%r" %s %b',
  COMBINED: '%h %^ %^ [%d:%t %^] "%r" %s %b "%R" "%u"',
  VCOMBINED: '%v %h %l %u %t "%r" %s %b "%R" "%u"',
};

export async function tryLog(_path: string) {
  if (!fs.existsSync(_path)) {
    return { ok: false, reason: "path.noexists" };
  }
  let found = Object.keys(predefinedParsers)
    .map((e) => {})
    .filter((e) => e);
}

export async function checkLog(_path: string) {
  if (!fs.existsSync(_path)) {
    return { ok: false, reason: "path.noexists" };
  }
  let prefhash = (await prisma.config.findFirst({
    where: { path: "hash:" + _path },
  })) ?? { path: "hash:" + _path, value: null };
  if (prefhash.value === sha256File(_path)) {
    return { ok: false, reason: "hash.nochange" };
  }
  let log = await prisma.log.findFirst({
    where: { path: _path },
  });
  if (!log) return { ok: false, reason: "sql.nolog" };
  let arm = await prisma.logEntry.findMany({
    where: { logId: log?.id },
    orderBy: { id: "desc" },
    take: 10,
  });
}

export function parseLog(log_inp: string, parseStr: string) {
  let act: Record<string, Array<string> | string> = {};
  var names: string[] = [];
  var parts = parseStr
    .replace(/(%[a-zA-Z0-9^~])/g, function (str, name) {
      names.push(name);
      return "~";
    })
    .split("~");
  let remainder = log_inp;
  var i, len, index;
  for (i = 0, len = names.length; i < len; i++) {
    remainder = remainder.substring(parts[i].length);
    index = remainder.indexOf(parts[i + 1]);
    if (act[names[i]] === undefined)
      act[names[i]] = remainder.substring(0, index);
    else if (typeof act[names[i]] === "string") {
      (act[names[i]] as string[]) = [
        act[names[i]] as string,
        remainder.substring(0, index),
      ];
    } else if (Array.isArray(act[names[i]]))
      (act[names[i]] as string[]).push(remainder.substring(0, index));
    remainder = remainder.substring(index);
  }
  return act;
}
function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function checkSyntax(
  _type: Record<string, Array<string> | string>,
  time_p: string,
  date_p: string
) {
  return !Object.keys(_type)
    .map((e) => {
      switch (e) {
        case "%x":
          return !isNumeric(_type[e]);
        case "%t":
          return false; //TODO Time format
        case "%d":
          return false; //TODO Date format
        case "%v":
          return false; //? This is fine i guess
        case "%e":
          return !isNumeric(_type[e]);
        case "%C":
          return false;
        case "%h":
          return (
            !new RegExp(
              /^((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/,
              "g"
            ).test(_type[e] as string) &&
            !new RegExp(
              /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
              "g"
            ).test(_type[e] as string)
          );
        case "%r":
          return false; //TODO This must be extended
        case "%m":
          return ![
            "GET",
            "HEAD",
            "POST",
            "PUT",
            "DELETE",
            "CONNECT",
            "OPTIONS",
            "TRACE",
            "PATCH",
          ].includes((_type[e] as string).toUpperCase());
        case "%U":
          return isValidPath(_type[e] as string);
        case "%q":
          return false; //TODO Must think of it
        case "%H":
          return !["http", "https"].includes(_type[e] as string);
        case "%s":
          return !isNumeric(_type[e]);
        case "%b":
          return !isNumeric(_type[e]);
        case "%R":
          return false;
        case "%u":
          return false;
        case "%K":
          return false;
        case "%k":
          return false;
        case "%M":
          return !isValidMime(_type[e] as string);
        case "%D":
          return !isNumeric(_type[e]);
        case "%T":
          return !isNumeric(_type[e]);
        case "%L":
          return !isNumeric(_type[e]);
        case "%^":
          return false;
        default:
          return false;
      }
    })
    .some((e) => e);
}
