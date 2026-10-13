import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  blankList,
  blankTrio,
  builtinCatalog,
  filmLink,
  readFilmLink,
  TONES,
  uniqueSlug,
  type CatalogDocument,
  type StoredActivity,
  type StoredCategory,
  type Trio,
  type TrioList,
} from "../../catalogDocument";
import { publishCatalog } from "../../catalogLive";
import type { Locale } from "../../i18n/messages";

const LANGUAGES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "pt", label: "PT" },
  { id: "fr", label: "FR" },
];

function move<T>(list: T[], index: number, delta: number): T[] {
  const next = index + delta;
  if (next < 0 || next >= list.length) return list;
  const copy = list.slice();
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  return copy;
}

function linesOf(value: string): string[] {
  return value.split("\n");
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("canvas"));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    image.src = url;
  });
}

function ReorderControls({
  index,
  total,
  onEarlier,
  onLater,
}: {
  index: number;
  total: number;
  onEarlier: () => void;
  onLater: () => void;
}) {
  if (total < 2) return null;
  return (
    <div className="edit-order">
      <span className="edit-order-label">
        {index + 1} / {total}
      </span>
      <button
        type="button"
        className="ghost mini"
        disabled={index === 0}
        onClick={(event) => {
          event.stopPropagation();
          onEarlier();
        }}
      >
        Earlier on site
      </button>
      <button
        type="button"
        className="ghost mini"
        disabled={index === total - 1}
        onClick={(event) => {
          event.stopPropagation();
          onLater();
        }}
      >
        Later on site
      </button>
    </div>
  );
}

function newCategory(doc: CatalogDocument): StoredCategory {
  return {
    id: uniqueSlug("category", new Set(doc.categories.map((item) => item.id))),
    title: { en: "New category", pt: "Nova categoria", fr: "Nouvelle catégorie" },
    kicker: blankTrio(),
    tone: "sea",
    points: blankList(),
    activities: [],
  };
}

export default function PageEdit() {
  const [lang, setLang] = useState<Locale>("en");
  const [document, setDocument] = useState<CatalogDocument | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const [highlightCategoryId, setHighlightCategoryId] = useState<string | null>(null);
  const scrollCategoryId = useRef<string | null>(null);
  const categoryRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/catalog", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return builtinCatalog();
        const data = (await response.json()) as { catalog?: CatalogDocument | null };
        return data.catalog ?? builtinCatalog();
      })
      .then((catalog) => {
        if (!cancelled) setDocument(catalog);
      })
      .catch(() => {
        if (!cancelled) setDocument(builtinCatalog());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = scrollCategoryId.current;
    if (!id) return;
    scrollCategoryId.current = null;
    const frame = window.requestAnimationFrame(() => {
      const node = categoryRefs.current.get(id);
      if (!node) return;
      node.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlightCategoryId(id);
      window.setTimeout(() => setHighlightCategoryId(null), 2400);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [document?.categories]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!document) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/catalog", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ catalog: document }),
      });
      if (response.status === 401) {
        setError("Your session expired. Sign in again, then save.");
        return;
      }
      if (!response.ok) {
        setError(
          "The page could not be saved. Check every category and activity: English title, note, image address, valid times (until must be after from), and prices must be numbers.",
        );
        return;
      }
      publishCatalog(document);
      setMessage("Saved. The public pages are using this version.");
    } catch {
      setError("The page could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const addCategoryAt = (index: number) => {
    setDocument((doc) => {
      if (!doc) return doc;
      const category = newCategory(doc);
      scrollCategoryId.current = category.id;
      const categories = doc.categories.slice();
      categories.splice(index, 0, category);
      return { ...doc, categories };
    });
  };

  const moveActivityToCategory = (fromCategoryIndex: number, activityIndex: number, toCategoryId: string) => {
    setDocument((doc) => {
      if (!doc) return doc;
      const from = doc.categories[fromCategoryIndex];
      if (!from) return doc;
      const activity = from.activities[activityIndex];
      if (!activity) return doc;
      const toCategoryIndex = doc.categories.findIndex((item) => item.id === toCategoryId);
      if (toCategoryIndex < 0 || toCategoryIndex === fromCategoryIndex) return doc;
      return {
        ...doc,
        categories: doc.categories.map((cat, index) => {
          if (index === fromCategoryIndex) {
            return { ...cat, activities: cat.activities.filter((_, i) => i !== activityIndex) };
          }
          if (index === toCategoryIndex) {
            return { ...cat, activities: [...cat.activities, activity] };
          }
          return cat;
        }),
      };
    });
  };

  if (!document) return <p>Loading the page…</p>;

  const updateCategory = (index: number, patch: Partial<StoredCategory>) => {
    setDocument((doc) => {
      if (!doc) return doc;
      return {
        ...doc,
        categories: doc.categories.map((category, categoryIndex) =>
          categoryIndex === index ? { ...category, ...patch } : category,
        ),
      };
    });
  };

  const updateActivity = (categoryIndex: number, activityIndex: number, patch: Partial<StoredActivity>) => {
    setDocument((doc) => {
      if (!doc) return doc;
      const category = doc.categories[categoryIndex];
      if (!category) return doc;
      return {
        ...doc,
        categories: doc.categories.map((item, itemIndex) =>
          itemIndex === categoryIndex
            ? {
                ...item,
                activities: item.activities.map((activity, index) =>
                  index === activityIndex ? { ...activity, ...patch } : activity,
                ),
              }
            : item,
        ),
      };
    });
  };

  const setText = (value: Trio, next: string): Trio => ({ ...value, [lang]: next });
  const setList = (value: TrioList, next: string): TrioList => ({ ...value, [lang]: linesOf(next) });

  const categoryLabel = (category: StoredCategory) =>
    category.title[lang] || category.title.en || "Untitled category";

  const upload = async (categoryIndex: number, activityIndex: number, file: File) => {
    const key = `${categoryIndex}-${activityIndex}`;
    setUploading(key);
    setError("");
    try {
      const dataUrl = await resizeImage(file);
      const response = await fetch("/api/admin/catalog-image", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const data = (await response.json()) as { url?: string };
      if (!response.ok || !data.url) {
        setError("The image could not be uploaded. Paste an image address instead.");
        return;
      }
      updateActivity(categoryIndex, activityIndex, { image: data.url });
    } catch {
      setError("The image could not be uploaded. Paste an image address instead.");
    } finally {
      setUploading("");
    }
  };

  return (
    <form className="page-edit" onSubmit={save}>
      <div className="page-edit-bar">
        <div>
          <h1>Page edit</h1>
          <p>
            Change what guests see on the home page and on Book experiences. Titles, subtitles and notes follow the
            language switch. Images, links and times are shared across languages. Price is set per activity and shown only on the Book experiences page.
          </p>
        </div>
        <div className="edit-tools">
          <div className="lang" role="group" aria-label="Language">
            {LANGUAGES.map((item) => (
              <button key={item.id} type="button" aria-pressed={lang === item.id} onClick={() => setLang(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
          <button className="solid" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save page"}
          </button>
        </div>
      </div>
      {message && <p className="edit-note">{message}</p>}
      {error && <p className="field-error">{error}</p>}

      <section className="edit-block">
        <div className="edit-head">
          <div>
            <h2>Offered time periods</h2>
            <p className="edit-block-help">These are the time chips on the book page (for example Morning, Sunset).</p>
          </div>
          <button
            type="button"
            className="ghost"
            onClick={() =>
              setDocument((doc) => {
                if (!doc) return doc;
                return {
                  ...doc,
                  periods: [
                    ...doc.periods,
                    {
                      id: uniqueSlug("period", new Set(doc.periods.map((period) => period.id))),
                      label: { en: "New period", pt: "Novo período", fr: "Nouvelle période" },
                      start: "09:00",
                      end: "12:00",
                    },
                  ],
                };
              })
            }
          >
            Add period
          </button>
        </div>
        {document.periods.map((period, index) => (
          <div className="edit-period" key={period.id}>
            <ReorderControls
              index={index}
              total={document.periods.length}
              onEarlier={() => setDocument((doc) => (doc ? { ...doc, periods: move(doc.periods, index, -1) } : doc))}
              onLater={() => setDocument((doc) => (doc ? { ...doc, periods: move(doc.periods, index, 1) } : doc))}
            />
            <label>
              Name
              <input
                value={period.label[lang]}
                onChange={(event) =>
                  setDocument((doc) => {
                    if (!doc) return doc;
                    return {
                      ...doc,
                      periods: doc.periods.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, label: setText(item.label, event.target.value) } : item,
                      ),
                    };
                  })
                }
              />
            </label>
            <label>
              From
              <input
                type="time"
                value={period.start}
                onChange={(event) =>
                  setDocument((doc) => {
                    if (!doc) return doc;
                    return {
                      ...doc,
                      periods: doc.periods.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, start: event.target.value } : item,
                      ),
                    };
                  })
                }
              />
            </label>
            <label>
              Until
              <input
                type="time"
                value={period.end}
                onChange={(event) =>
                  setDocument((doc) => {
                    if (!doc) return doc;
                    return {
                      ...doc,
                      periods: doc.periods.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, end: event.target.value } : item,
                      ),
                    };
                  })
                }
              />
            </label>
            <button
              type="button"
              className="ghost"
              onClick={() => {
                setDocument((doc) => {
                  if (!doc) return doc;
                  if (doc.periods.length < 2) {
                    setError("Keep at least one time period.");
                    return doc;
                  }
                  setError("");
                  return { ...doc, periods: doc.periods.filter((_, itemIndex) => itemIndex !== index) };
                });
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      <div className="edit-head">
        <div>
          <h2>Categories and activities</h2>
          <p className="edit-block-help">
            Order here matches the home page and book page. Use “Earlier on site” / “Later on site” to move a block up
            or down in that list. New categories open here at the top — use those buttons to place them on the page.
          </p>
        </div>
        <button type="button" className="ghost" onClick={() => addCategoryAt(0)}>
          Add category
        </button>
      </div>

      {document.categories.map((category, categoryIndex) => (
        <section
          className={`edit-block edit-category${highlightCategoryId === category.id ? " edit-category-focus" : ""}`}
          key={category.id}
          ref={(node) => {
            if (node) categoryRefs.current.set(category.id, node);
            else categoryRefs.current.delete(category.id);
          }}
        >
          <div className="edit-head edit-category-head">
            <h3>{categoryLabel(category)}</h3>
            <div className="edit-tools">
              <ReorderControls
                index={categoryIndex}
                total={document.categories.length}
                onEarlier={() =>
                  setDocument((doc) => (doc ? { ...doc, categories: move(doc.categories, categoryIndex, -1) } : doc))
                }
                onLater={() =>
                  setDocument((doc) => (doc ? { ...doc, categories: move(doc.categories, categoryIndex, 1) } : doc))
                }
              />
              <button type="button" className="ghost mini" onClick={() => addCategoryAt(categoryIndex + 1)}>
                Add category below
              </button>
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setDocument((doc) => {
                    if (!doc) return doc;
                    if (doc.categories.length < 2) {
                      setError("Keep at least one category.");
                      return doc;
                    }
                    setError("");
                    return { ...doc, categories: doc.categories.filter((_, index) => index !== categoryIndex) };
                  });
                }}
              >
                Delete category
              </button>
            </div>
          </div>
          <div className="edit-fields">
            <label>
              Title
              <input
                value={category.title[lang]}
                onChange={(event) => updateCategory(categoryIndex, { title: setText(category.title, event.target.value) })}
              />
            </label>
            <label>
              Subtitle
              <textarea
                rows={2}
                value={category.kicker[lang]}
                onChange={(event) => updateCategory(categoryIndex, { kicker: setText(category.kicker, event.target.value) })}
              />
            </label>
            <label>
              Colour
              <select value={category.tone} onChange={(event) => updateCategory(categoryIndex, { tone: event.target.value })}>
                {TONES.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Points, one per line
              <textarea
                rows={3}
                value={category.points[lang].join("\n")}
                onChange={(event) => updateCategory(categoryIndex, { points: setList(category.points, event.target.value) })}
              />
            </label>
            <div className="edit-head">
              <h4>Activities in this category</h4>
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setDocument((doc) => {
                    if (!doc) return doc;
                    const activityIds = new Set(doc.categories.flatMap((item) => item.activities.map((a) => a.id)));
                    const activity: StoredActivity = {
                      id: uniqueSlug("activity", activityIds),
                      title: { en: "New activity", pt: "Nova atividade", fr: "Nouvelle activité" },
                      blurb: { en: "A short description.", pt: "Uma descrição breve.", fr: "Une courte description." },
                      image: "/photos/hero.jpg",
                      imageAlt: blankTrio(),
                      videoId: "",
                      videoUrl: "",
                      videoTitle: "",
                      startAt: null,
                      duration: { en: "About 2 hours", pt: "Cerca de 2 horas", fr: "Environ 2 heures" },
                      suggested: { start: "09:00", end: "12:00" },
                      offers: blankList(),
                      price: null,
                    };
                    const categories = doc.categories.map((item, itemIndex) =>
                      itemIndex === categoryIndex ? { ...item, activities: [...item.activities, activity] } : item,
                    );
                    return { ...doc, categories };
                  });
                }}
              >
                Add activity
              </button>
            </div>
            {category.activities.map((activity, activityIndex) => (
              <article className="edit-activity" key={activity.id}>
                <details className="edit-details">
                  <summary className="edit-summary">
                    <span>{activity.title[lang] || activity.title.en || "Untitled activity"}</span>
                    <ReorderControls
                      index={activityIndex}
                      total={category.activities.length}
                      onEarlier={() =>
                        setDocument((doc) => {
                          if (!doc) return doc;
                          return {
                            ...doc,
                            categories: doc.categories.map((item, itemIndex) =>
                              itemIndex === categoryIndex
                                ? { ...item, activities: move(item.activities, activityIndex, -1) }
                                : item,
                            ),
                          };
                        })
                      }
                      onLater={() =>
                        setDocument((doc) => {
                          if (!doc) return doc;
                          return {
                            ...doc,
                            categories: doc.categories.map((item, itemIndex) =>
                              itemIndex === categoryIndex
                                ? { ...item, activities: move(item.activities, activityIndex, 1) }
                                : item,
                            ),
                          };
                        })
                      }
                    />
                  </summary>
                  <div className="edit-fields">
                    <div className="edit-head">
                      {document.categories.length > 1 ? (
                        <label className="edit-move-category">
                          Category on site
                          <select
                            value={category.id}
                            onChange={(event) =>
                              moveActivityToCategory(categoryIndex, activityIndex, event.target.value)
                            }
                          >
                            {document.categories.map((item) => (
                              <option key={item.id} value={item.id}>
                                {categoryLabel(item)}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        className="ghost"
                        onClick={() =>
                          updateCategory(categoryIndex, {
                            activities: category.activities.filter((_, index) => index !== activityIndex),
                          })
                        }
                      >
                        Delete activity
                      </button>
                    </div>
                    <label>
                      Title
                      <input
                        value={activity.title[lang]}
                        onChange={(event) =>
                          updateActivity(categoryIndex, activityIndex, { title: setText(activity.title, event.target.value) })
                        }
                      />
                    </label>
                    <label>
                      Subtitle
                      <textarea
                        rows={3}
                        value={activity.blurb[lang]}
                        onChange={(event) =>
                          updateActivity(categoryIndex, activityIndex, { blurb: setText(activity.blurb, event.target.value) })
                        }
                      />
                    </label>
                    <label>
                      Note
                      <input
                        value={activity.duration[lang]}
                        placeholder="About 2 hours"
                        onChange={(event) =>
                          updateActivity(categoryIndex, activityIndex, {
                            duration: setText(activity.duration, event.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      Price on book page, euros
                      <input
                        inputMode="decimal"
                        value={activity.price ?? ""}
                        placeholder="Leave empty to hide on book page"
                        onChange={(event) => {
                          const text = event.target.value.trim().replace(",", ".");
                          if (text === "") {
                            updateActivity(categoryIndex, activityIndex, { price: null });
                            return;
                          }
                          const num = Number(text);
                          if (Number.isFinite(num)) {
                            updateActivity(categoryIndex, activityIndex, { price: num });
                          }
                        }}
                      />
                    </label>
                    <div className="edit-image">
                      {activity.image && <img src={activity.image} alt="" />}
                      <label>
                        Card image address
                        <input
                          value={activity.image}
                          onChange={(event) => updateActivity(categoryIndex, activityIndex, { image: event.target.value })}
                        />
                      </label>
                      <label>
                        Image description
                        <input
                          value={activity.imageAlt[lang]}
                          onChange={(event) =>
                            updateActivity(categoryIndex, activityIndex, {
                              imageAlt: setText(activity.imageAlt, event.target.value),
                            })
                          }
                        />
                      </label>
                      <label className="edit-upload">
                        {uploading === `${categoryIndex}-${activityIndex}` ? "Uploading…" : "Upload image"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            event.target.value = "";
                            if (file) void upload(categoryIndex, activityIndex, file);
                          }}
                        />
                      </label>
                    </div>
                    <label>
                      Link
                      <input
                        value={filmLink(activity)}
                        placeholder="YouTube or Facebook address"
                        onChange={(event) =>
                          updateActivity(categoryIndex, activityIndex, readFilmLink(event.target.value))
                        }
                      />
                    </label>
                    <label>
                      Film name
                      <input
                        value={activity.videoTitle}
                        onChange={(event) =>
                          updateActivity(categoryIndex, activityIndex, { videoTitle: event.target.value })
                        }
                      />
                    </label>
                    <div className="admin-range">
                      <label>
                        Included from
                        <input
                          type="time"
                          value={activity.suggested.start}
                          onChange={(event) =>
                            updateActivity(categoryIndex, activityIndex, {
                              suggested: { ...activity.suggested, start: event.target.value },
                            })
                          }
                        />
                      </label>
                      <label>
                        Included until
                        <input
                          type="time"
                          value={activity.suggested.end}
                          onChange={(event) =>
                            updateActivity(categoryIndex, activityIndex, {
                              suggested: { ...activity.suggested, end: event.target.value },
                            })
                          }
                        />
                      </label>
                    </div>
                    <label>
                      Included lines, one per line
                      <textarea
                        rows={3}
                        value={activity.offers[lang].join("\n")}
                        onChange={(event) =>
                          updateActivity(categoryIndex, activityIndex, { offers: setList(activity.offers, event.target.value) })
                        }
                      />
                    </label>
                  </div>
                </details>
              </article>
            ))}
          </div>
        </section>
      ))}
    </form>
  );
}
