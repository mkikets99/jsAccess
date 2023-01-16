// import { Config } from "@prisma/client";
import * as fs from "fs";
import sha256File from "sha256-file";
import { prisma } from "./prisma.server";

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
  let logs = await prisma.logEntry.findMany({
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
