import { scryptSync, timingSafeEqual } from "node:crypto";
import { createWisePaymentLink } from "./wise.mjs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

function isEmail(value) {
  const email = value.trim();
  if (email.length > 254 || email.includes("..")) return false;
  if (!EMAIL.test(email)) return false;
  const at = email.lastIndexOf("@");
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (!local || !domain) return false;
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (domain.startsWith(".") || domain.endsWith(".") || domain.startsWith("-") || domain.endsWith("-")) {
    return false;
  }
  return domain.split(".").every((part) => part.length > 0 && !part.startsWith("-") && !part.endsWith("-"));
}

function isPhone(value) {
  const trimmed = value.trim();
  if (!/^[+\d][\d\s().-]{5,}$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 15;
}

const COOKIE = "algarve-admin";
const DAY = 60 * 60 * 12;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function env(name) {
  return process.env[name]?.trim() ?? "";
}

function json(status, body, extra = {}) {
  return { status, headers: { "content-type": "application/json", ...extra }, body };
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  const bytes = new Uint8Array(signed);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function safeEqual(left, right) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

function readCookie(header) {
  if (!header) return "";
  const match = header.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`));
  return match ? decodeURIComponent(match.slice(COOKIE.length + 1)) : "";
}

function passwordMatches(password, stored) {
  const [kind, salt, hash] = String(stored ?? "").split(":");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const next = scryptSync(password, salt, 32);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

function hashPassword(password) {
  const salt = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("hex");
  return `scrypt:${salt}:${scryptSync(password, salt, 32).toString("hex")}`;
}

async function sessionToken(secret, username) {
  const exp = String(Date.now() + DAY * 1000);
  const body = `${username}.${exp}`;
  return `${body}.${await hmac(secret, body)}`;
}

async function readSession(secret, header) {
  const token = readCookie(header);
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [username, exp, sig] = parts;
  if (!/^[a-z0-9]{3,32}$/.test(username) || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return null;
  if (!safeEqual(sig, await hmac(secret, `${username}.${exp}`))) return null;
  return username;
}

function cookie(value, secure, maxAge) {
  const parts = [
    `${COOKIE}=${encodeURIComponent(value)}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${maxAge}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

function cleanLines(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 40) return null;
  const lines = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const activityId = typeof item.activityId === "string" ? item.activityId.trim() : "";
    const title = typeof item.title === "string" ? item.title.trim() : "";
    const date = typeof item.date === "string" ? item.date.trim() : "";
    const people = Number(item.people);
    if (!activityId || activityId.length > 80 || !title || title.length > 160) return null;
    if (!DATE.test(date)) return null;
    if (!Number.isInteger(people) || people < 1 || people > 16) return null;
    if (!Array.isArray(item.ranges) || item.ranges.length === 0 || item.ranges.length > 8) return null;
    const ranges = [];
    for (const range of item.ranges) {
      if (!range || typeof range !== "object") return null;
      const start = typeof range.start === "string" ? range.start : "";
      const end = typeof range.end === "string" ? range.end : "";
      if (!TIME.test(start) || !TIME.test(end) || end <= start) return null;
      ranges.push({ start, end });
    }
    lines.push({ activityId, title, date, people, ranges });
  }
  return lines;
}

function invalid(code) {
  return json(400, { ok: false, code });
}

async function supabase(path, init) {
  const url = env("SUPABASE_URL").replace(/\/$/, "");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("missing database configuration");
  return fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

function clock(value) {
  const text = String(value ?? "");
  return text.length >= 5 ? text.slice(0, 5) : text;
}

function asRequest(row) {
  const experiences = Array.isArray(row.algarve_stay_experiences) ? row.algarve_stay_experiences : [];
  const lines = experiences.length
    ? experiences.map((line) => ({
        activityId: String(line.activity_id ?? ""),
        title: String(line.title ?? ""),
        date: String(line.experience_date ?? ""),
        people: Number(line.people ?? 1),
        ranges: (Array.isArray(line.algarve_stay_hours) ? line.algarve_stay_hours : []).map((span) => ({
          start: clock(span.starts),
          end: clock(span.ends),
        })),
      }))
    : Array.isArray(row.lines)
      ? row.lines
      : [];
  return {
    id: String(row.id ?? ""),
    ref: String(row.ref ?? ""),
    createdAt: String(row.created_at ?? ""),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    notes: String(row.notes ?? ""),
    paid: Boolean(row.paid),
    amount: row.amount === null || row.amount === undefined || row.amount === "" ? null : Number(row.amount),
    paidAt: row.paid_at ? String(row.paid_at) : null,
    paymentLink: row.payment_link ? String(row.payment_link) : null,
    paymentLinkAt: row.payment_link_at ? String(row.payment_link_at) : null,
    lines,
  };
}

const REQUEST_SELECT =
  "id,ref,created_at,name,email,phone,notes,paid,amount,paid_at,payment_link,payment_link_at,lines,algarve_stay_experiences(activity_id,title,experience_date,people,algarve_stay_hours(starts,ends))";

async function replaceExperiences(requestId, lines) {
  const removed = await supabase(`/rest/v1/algarve_stay_experiences?request_id=eq.${requestId}`, { method: "DELETE" });
  if (!removed.ok) return false;
  for (const line of lines) {
    const created = await supabase("/rest/v1/algarve_stay_experiences", {
      method: "POST",
      headers: { prefer: "return=representation" },
      body: JSON.stringify({
        request_id: requestId,
        activity_id: line.activityId,
        title: line.title,
        experience_date: line.date,
        people: line.people,
      }),
    });
    if (!created.ok) return false;
    const payload = await created.json();
    const row = Array.isArray(payload) ? payload[0] : payload;
    if (!row?.id) return false;
    if (line.ranges.length === 0) continue;
    const hours = await supabase("/rest/v1/algarve_stay_hours", {
      method: "POST",
      body: JSON.stringify(line.ranges.map((range) => ({ experience_id: row.id, starts: range.start, ends: range.end }))),
    });
    if (!hours.ok) return false;
  }
  return true;
}

const TONES = new Set(["sea", "olive", "land", "wine", "walk", "balloon", "horse", "ink", "navy"]);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function textOf(value, max) {
  if (!value || typeof value !== "object") return null;
  const trio = {};
  for (const key of ["en", "pt", "fr"]) {
    const text = typeof value[key] === "string" ? value[key].trim() : "";
    if (text.length > max) return null;
    trio[key] = text;
  }
  return trio;
}

function listOf(value, maxItems, maxLen) {
  if (!value || typeof value !== "object") return null;
  const trio = {};
  for (const key of ["en", "pt", "fr"]) {
    if (!Array.isArray(value[key]) || value[key].length > maxItems) return null;
    const items = [];
    for (const item of value[key]) {
      if (typeof item !== "string") return null;
      const text = item.trim();
      if (!text) continue;
      if (text.length > maxLen) return null;
      items.push(text);
    }
    trio[key] = items;
  }
  return trio;
}

function cleanCatalog(value) {
  if (!value || typeof value !== "object") return null;
  if (!Array.isArray(value.periods) || value.periods.length < 1 || value.periods.length > 12) return null;
  if (!Array.isArray(value.categories) || value.categories.length < 1 || value.categories.length > 20) return null;
  const periodIds = new Set();
  const periods = [];
  for (const period of value.periods) {
    if (!period || typeof period !== "object") return null;
    const id = typeof period.id === "string" ? period.id : "";
    if (!SLUG.test(id) || id.length > 40 || periodIds.has(id)) return null;
    periodIds.add(id);
    const label = textOf(period.label, 40);
    if (!label || label.en.length < 2) return null;
    const start = clock(period.start);
    const end = clock(period.end);
    if (!TIME.test(start) || !TIME.test(end) || end <= start) return null;
    periods.push({ id, label, start, end });
  }
  const categoryIds = new Set();
  const activityIds = new Set();
  const categories = [];
  let activityCount = 0;
  for (const category of value.categories) {
    if (!category || typeof category !== "object") return null;
    const id = typeof category.id === "string" ? category.id : "";
    if (!SLUG.test(id) || id.length > 40 || categoryIds.has(id)) return null;
    categoryIds.add(id);
    const title = textOf(category.title, 80);
    const kicker = textOf(category.kicker, 240);
    const points = listOf(category.points, 8, 80);
    if (!title || title.en.length < 2 || !kicker || !points) return null;
    if (typeof category.tone !== "string" || !TONES.has(category.tone)) return null;
    if (!Array.isArray(category.activities) || category.activities.length > 24) return null;
    const activities = [];
    for (const activity of category.activities) {
      activityCount += 1;
      if (activityCount > 80 || !activity || typeof activity !== "object") return null;
      const activityId = typeof activity.id === "string" ? activity.id : "";
      if (!SLUG.test(activityId) || activityId.length > 48 || activityIds.has(activityId)) return null;
      activityIds.add(activityId);
      const activityTitle = textOf(activity.title, 120);
      const blurb = textOf(activity.blurb, 400);
      const imageAlt = textOf(activity.imageAlt, 180);
      const duration = textOf(activity.duration, 80);
      const offers = listOf(activity.offers, 8, 80);
      if (!activityTitle || activityTitle.en.length < 2 || !blurb || !imageAlt || !duration || duration.en.length < 2 || !offers) {
        return null;
      }
      const image = typeof activity.image === "string" ? activity.image.trim() : "";
      if (!image || image.length > 500 || image.startsWith("data:") || !(image.startsWith("/") || image.startsWith("https://"))) {
        return null;
      }
      const videoId = typeof activity.videoId === "string" ? activity.videoId.trim() : "";
      if (videoId && !/^[\w-]{6,20}$/.test(videoId)) return null;
      const videoUrl = typeof activity.videoUrl === "string" ? activity.videoUrl.trim() : "";
      if (videoUrl && (!videoUrl.startsWith("https://") || videoUrl.length > 500)) return null;
      const videoTitle = typeof activity.videoTitle === "string" ? activity.videoTitle.trim().slice(0, 160) : "";
      const startAt =
        activity.startAt === null || activity.startAt === undefined || activity.startAt === ""
          ? null
          : Number(activity.startAt);
      if (startAt !== null && (!Number.isInteger(startAt) || startAt < 0 || startAt > 10000)) return null;
      const suggested = activity.suggested;
      const suggestedStart = clock(suggested?.start);
      const suggestedEnd = clock(suggested?.end);
      if (!TIME.test(suggestedStart) || !TIME.test(suggestedEnd) || suggestedEnd <= suggestedStart) return null;
      const price =
        activity.price === null || activity.price === undefined || activity.price === ""
          ? null
          : Number(activity.price);
      if (price !== null && (!Number.isFinite(price) || price < 0 || price > 1000000)) return null;
      activities.push({
        id: activityId,
        title: activityTitle,
        blurb,
        image,
        imageAlt,
        videoId,
        videoUrl,
        videoTitle,
        startAt,
        duration,
        suggested: { start: suggestedStart, end: suggestedEnd },
        offers,
        price,
      });
    }
    categories.push({ id, title, kicker, tone: category.tone, points, activities });
  }
  return { periods, categories };
}

function decodeImage(value) {
  if (typeof value !== "string") return null;
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/.exec(value);
  if (!match) return null;
  const bytes = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  if (bytes.length < 80 || bytes.length > 2_500_000) return null;
  const type = match[1].toLowerCase();
  const ext = type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
  return { type, ext, bytes };
}

function cleanSite(value) {
  if (!value || typeof value !== "object") return null;
  const aboutTitle = textOf(value.aboutTitle, 80);
  const aboutBody = textOf(value.aboutBody, 4000);
  if (!aboutTitle || aboutTitle.en.length < 2 || !aboutBody || aboutBody.en.length < 20) return null;
  if (!Array.isArray(value.contacts) || value.contacts.length < 1 || value.contacts.length > 8) return null;
  const ids = new Set();
  const contacts = [];
  for (const item of value.contacts) {
    if (!item || typeof item !== "object") return null;
    const id = typeof item.id === "string" ? item.id : "";
    if (!SLUG.test(id) || id.length > 40 || ids.has(id)) return null;
    ids.add(id);
    if (item.kind !== "phone" && item.kind !== "email") return null;
    const raw = typeof item.value === "string" ? item.value.trim() : "";
    if (item.kind === "email") {
      if (!isEmail(raw) || raw.length > 120) return null;
      contacts.push({ id, kind: "email", value: raw });
      continue;
    }
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15 || raw.length > 24) return null;
    const name = typeof item.name === "string" ? item.name.trim().slice(0, 80) : "";
    contacts.push({ id, kind: "phone", value: raw, name });
  }
  return { aboutTitle, aboutBody, contacts };
}

async function readSiteRow() {
  const found = await supabase("/rest/v1/algarve_catalog?id=eq.site&select=document", { method: "GET" });
  if (!found.ok) return { ok: false, site: null };
  const rows = await found.json();
  const site = Array.isArray(rows) && rows[0]?.document ? cleanSite(rows[0].document) : null;
  return { ok: true, site };
}

async function readCatalog() {
  const found = await supabase("/rest/v1/algarve_catalog?id=eq.live&select=document", { method: "GET" });
  if (!found.ok) return json(502, { ok: false, code: "send" }, { "cache-control": "no-store" });
  const rows = await found.json();
  const catalog = Array.isArray(rows) && rows[0]?.document ? rows[0].document : null;
  return json(200, { ok: true, catalog }, { "cache-control": "no-store" });
}

export async function handleStayApi(input) {
  const path = input.path.split("?")[0];
  const secret = env("ADMIN_SESSION_SECRET");

  if (path === "/api/admin/login" && input.method === "POST") {
    const username = typeof input.body?.username === "string" ? input.body.username.trim().toLowerCase() : "";
    const given = typeof input.body?.password === "string" ? input.body.password : "";
    if (!secret || !/^[a-z0-9]{3,32}$/.test(username) || !given) {
      return json(401, { ok: false, code: "unauthorized" });
    }
    const found = await supabase(
      `/rest/v1/algarve_admins?username=eq.${encodeURIComponent(username)}&select=username,password_hash`,
      { method: "GET" },
    );
    if (!found.ok) return json(502, { ok: false, code: "send" });
    const rows = await found.json();
    const admin = Array.isArray(rows) ? rows[0] : null;
    if (!admin || !passwordMatches(given, admin.password_hash)) {
      return json(401, { ok: false, code: "unauthorized" });
    }
    return json(200, { ok: true, username }, { "set-cookie": cookie(await sessionToken(secret, username), input.secure, DAY) });
  }

  if (path === "/api/admin/logout" && input.method === "POST") {
    return json(200, { ok: true }, { "set-cookie": cookie("", input.secure, 0) });
  }

  if (path === "/api/admin/password" && input.method === "POST") {
    const username = await readSession(secret, input.cookie);
    if (!username) return json(401, { ok: false, code: "unauthorized" });
    const current = typeof input.body?.current === "string" ? input.body.current : "";
    const next = typeof input.body?.next === "string" ? input.body.next : "";
    if (next.length < 7 || next.length > 80) return json(400, { ok: false, code: "password" });
    const found = await supabase(
      `/rest/v1/algarve_admins?username=eq.${encodeURIComponent(username)}&select=password_hash`,
      { method: "GET" },
    );
    if (!found.ok) return json(502, { ok: false, code: "send" });
    const rows = await found.json();
    const admin = Array.isArray(rows) ? rows[0] : null;
    if (!admin || !passwordMatches(current, admin.password_hash)) {
      return json(401, { ok: false, code: "unauthorized" });
    }
    const saved = await supabase(`/rest/v1/algarve_admins?username=eq.${encodeURIComponent(username)}`, {
      method: "PATCH",
      body: JSON.stringify({ password_hash: hashPassword(next), updated_at: new Date().toISOString() }),
    });
    if (!saved.ok) return json(502, { ok: false, code: "send" });
    return json(200, { ok: true });
  }

  if (path === "/api/admin/requests" && input.method === "GET") {
    const username = await readSession(secret, input.cookie);
    if (!username) return json(401, { ok: false, code: "unauthorized" });
    const response = await supabase(
      `/rest/v1/algarve_stay_requests?select=${REQUEST_SELECT}&order=created_at.desc`,
      { method: "GET" },
    );
    if (!response.ok) return json(502, { ok: false, code: "send" });
    const rows = await response.json();
    return json(200, { ok: true, username, requests: rows.map(asRequest) });
  }

  if (path === "/api/admin/request" && input.method === "POST") {
    if (!(await readSession(secret, input.cookie))) return json(401, { ok: false, code: "unauthorized" });
    const id = typeof input.body?.id === "string" ? input.body.id : "";
    if (!/^[0-9a-f-]{36}$/i.test(id)) return json(400, { ok: false, code: "send" });
    if (input.body?.action === "delete") {
      const removed = await supabase(`/rest/v1/algarve_stay_requests?id=eq.${id}`, { method: "DELETE" });
      if (!removed.ok) return json(502, { ok: false, code: "send" });
      return json(200, { ok: true });
    }
    if (input.body?.action === "generate-payment") {
      const found = await supabase(
        `/rest/v1/algarve_stay_requests?select=ref,amount,paid&id=eq.${id}`,
        { method: "GET" },
      );
      if (!found.ok) return json(502, { ok: false, code: "send" });
      const rows = await found.json();
      const row = Array.isArray(rows) ? rows[0] : null;
      if (!row) return json(404, { ok: false, code: "send" });
      if (row.paid) return json(400, { ok: false, code: "paid" });
      const amount =
        row.amount === null || row.amount === undefined || row.amount === ""
          ? null
          : Number(row.amount);
      if (amount === null || !Number.isFinite(amount) || amount <= 0) {
        return json(400, { ok: false, code: "amount" });
      }
      const wise = await createWisePaymentLink({
        amount,
        description: `Algarve stay ${row.ref}`,
      });
      if (!wise.ok) return json(502, { ok: false, code: wise.code ?? "wise" });
      const now = new Date().toISOString();
      const saved = await supabase(`/rest/v1/algarve_stay_requests?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          payment_link: wise.link,
          payment_link_at: now,
          amount,
          paid: true,
          paid_at: now,
        }),
      });
      if (!saved.ok) return json(502, { ok: false, code: "send" });
      return json(200, { ok: true, paymentLink: wise.link });
    }
    const name = typeof input.body?.name === "string" ? input.body.name.trim() : "";
    const email = typeof input.body?.email === "string" ? input.body.email.trim() : "";
    const phone = typeof input.body?.phone === "string" ? input.body.phone.trim() : "";
    const notes = typeof input.body?.notes === "string" ? input.body.notes.trim().slice(0, 2000) : "";
    const paid = input.body?.paid === true;
    const paidAt = typeof input.body?.paidAt === "string" && input.body.paidAt ? input.body.paidAt : null;
    const amountValue = input.body?.amount;
    const amountText =
      amountValue === "" || amountValue === null || amountValue === undefined
        ? ""
        : String(amountValue).trim().replace(",", ".");
    const amount = amountText === "" ? null : Number(amountText);
    if (name.length < 2 || name.length > 120) return invalid("name");
    if (!isEmail(email)) return invalid("email-format");
    if (!isPhone(phone)) return invalid("phone");
    if (amount !== null && (!Number.isFinite(amount) || amount < 0 || amount > 1000000)) {
      return json(400, { ok: false, code: "amount" });
    }
    const lines = cleanLines(input.body?.lines);
    if (!lines) return invalid("activity");
    const saved = await supabase(`/rest/v1/algarve_stay_requests?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name,
        email,
        phone,
        notes,
        paid,
        amount,
        paid_at: paid ? (paidAt ?? new Date().toISOString()) : null,
        lines,
      }),
    });
    if (!saved.ok) return json(502, { ok: false, code: "send" });
    if (!(await replaceExperiences(id, lines))) return json(502, { ok: false, code: "send" });
    return json(200, { ok: true });
  }

  if (path === "/api/requests" && input.method === "POST") {
    const body = input.body ?? {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 2000) : "";
    if (name.length < 2 || name.length > 120) return invalid("name");
    if (!email) return invalid("email");
    if (!isEmail(email)) return invalid("email-format");
    if (!isPhone(phone)) return invalid("phone");
    if (body.acceptedTerms !== true) return invalid("terms");
    const lines = cleanLines(body.lines);
    if (!lines) {
      const raw = Array.isArray(body.lines) ? body.lines : [];
      if (raw.length === 0) return invalid("activity");
      const undated = raw.find((item) => item && typeof item === "object" && !DATE.test(String(item.date ?? "")));
      return invalid(undated ? "date" : "time");
    }
    const response = await supabase("/rest/v1/rpc/create_algarve_stay_request", {
      method: "POST",
      body: JSON.stringify({
        p_name: name,
        p_email: email,
        p_phone: phone,
        p_notes: notes,
        p_lines: lines,
      }),
    });
    if (!response.ok) return json(502, { ok: false, code: "send" });
    const payload = await response.json();
    const row = Array.isArray(payload) ? payload[0] : payload;
    if (!row?.ref) return json(502, { ok: false, code: "send" });
    const saved = asRequest(row);
    return json(200, { ok: true, ref: saved.ref, createdAt: saved.createdAt });
  }

  if (path === "/api/site" && input.method === "GET") {
    const found = await readSiteRow();
    if (!found.ok) return json(502, { ok: false, code: "send" }, { "cache-control": "no-store" });
    return json(200, { ok: true, site: found.site }, { "cache-control": "no-store" });
  }
  if (path === "/api/admin/site" && input.method === "GET") {
    if (!(await readSession(secret, input.cookie))) return json(401, { ok: false, code: "unauthorized" });
    const found = await readSiteRow();
    if (!found.ok) return json(502, { ok: false, code: "send" }, { "cache-control": "no-store" });
    return json(200, { ok: true, site: found.site }, { "cache-control": "no-store" });
  }
  if (path === "/api/admin/site" && input.method === "PUT") {
    if (!(await readSession(secret, input.cookie))) return json(401, { ok: false, code: "unauthorized" });
    const document = cleanSite(input.body?.site);
    if (!document) return json(400, { ok: false, code: "site" });
    const saved = await supabase("/rest/v1/algarve_catalog?on_conflict=id", {
      method: "POST",
      headers: { prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ id: "site", document, updated_at: new Date().toISOString() }),
    });
    if (!saved.ok) return json(502, { ok: false, code: "send" });
    return json(200, { ok: true });
  }
  if (path === "/api/catalog" && input.method === "GET") return readCatalog();
  if (path === "/api/admin/catalog" && input.method === "GET") {
    if (!(await readSession(secret, input.cookie))) return json(401, { ok: false, code: "unauthorized" });
    return readCatalog();
  }
  if (path === "/api/admin/catalog" && input.method === "PUT") {
    if (!(await readSession(secret, input.cookie))) return json(401, { ok: false, code: "unauthorized" });
    const document = cleanCatalog(input.body?.catalog);
    if (!document) return json(400, { ok: false, code: "catalog" });
    const saved = await supabase("/rest/v1/algarve_catalog?on_conflict=id", {
      method: "POST",
      headers: { prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ id: "live", document, updated_at: new Date().toISOString() }),
    });
    if (!saved.ok) return json(502, { ok: false, code: "send" });
    return json(200, { ok: true });
  }
  if (path === "/api/admin/catalog-image" && input.method === "POST") {
    if (!(await readSession(secret, input.cookie))) return json(401, { ok: false, code: "unauthorized" });
    const image = decodeImage(input.body?.dataUrl);
    if (!image) return json(400, { ok: false, code: "image" });
    const url = env("SUPABASE_URL").replace(/\/$/, "");
    const key = env("SUPABASE_SERVICE_ROLE_KEY");
    const name = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${image.ext}`;
    const uploaded = await fetch(`${url}/storage/v1/object/catalog/${name}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        apikey: key,
        "content-type": image.type,
        "cache-control": "public, max-age=31536000",
      },
      body: image.bytes,
    });
    if (!uploaded.ok) return json(502, { ok: false, code: "image" });
    return json(200, { ok: true, url: `${url}/storage/v1/object/public/catalog/${name}` });
  }

  return json(404, { ok: false, code: "send" });
}

export function vercelStayHandler(path) {
  return async (req, res) => {
    const header = req.headers.cookie;
    const host = Array.isArray(req.headers.host) ? req.headers.host[0] : (req.headers.host ?? "");
    const forwarded = req.headers["x-forwarded-proto"];
    const proto = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const name = host.split(":")[0].toLowerCase();
    const result = await handleStayApi({
      method: req.method ?? "GET",
      path,
      cookie: Array.isArray(header) ? header.join("; ") : (header ?? null),
      body: req.body,
      secure:
        proto === "https" ||
        name.endsWith(".vercel.app") ||
        name === "discoverthebestofthealgarve.com" ||
        name.endsWith(".discoverthebestofthealgarve.com"),
    });
    res.status(result.status);
    for (const [name, value] of Object.entries(result.headers)) res.setHeader(name, value);
    if (result.body == null) res.end();
    else res.end(JSON.stringify(result.body));
  };
}
