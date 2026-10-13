import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hasFilm, watchUrl, type Activity } from "../data/catalog";
import { useDraft } from "../draft";
import { useLocale } from "../i18n";

function VideoDialog({
  activity,
  onClose,
}: {
  activity: Activity | null;
  onClose: () => void;
}) {
  const { isSelected } = useDraft();
  const { m } = useLocale();

  useEffect(() => {
    if (!activity) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [activity, onClose]);

  if (!activity) return null;
  const selected = isSelected(activity.id);
  const start = activity.startAt ?? 0;

  return (
    <div className="dialog-back" role="presentation" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="frame">
          {activity.videoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activity.videoId}?rel=0&start=${start}`}
              title={activity.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(activity.videoUrl ?? "")}&show_text=false&width=1280`}
              title={activity.videoTitle}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
        <div className="dialog-copy">
          <p className="eyebrow">{activity.duration}</p>
          <h2 id="video-title">{activity.title}</h2>
          <p>{activity.blurb}</p>
          {activity.offers && (
            <ul className="offers">
              {activity.offers.map((offer) => (
                <li key={offer}>{offer}</li>
              ))}
            </ul>
          )}
          <p className="film-name">
            {m.filmBy}: {activity.videoTitle}
          </p>
          <div className="dialog-actions">
            <Link className="solid" to={`/book?activity=${activity.id}`} onClick={onClose}>
              {selected ? m.openDay : m.includeDay}
            </Link>
            {watchUrl(activity) && (
              <a className="ghost" href={watchUrl(activity)} target="_blank" rel="noreferrer">
                {m.watch}
              </a>
            )}
            <button type="button" className="texty" onClick={onClose}>
              {m.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({
  activity,
  onWatch,
}: {
  activity: Activity;
  onWatch: (activity: Activity) => void;
}) {
  const { isSelected, toggleActivity } = useDraft();
  const { m } = useLocale();
  const selected = isSelected(activity.id);
  return (
    <article className="card">
      {hasFilm(activity) ? (
        <button type="button" className="shot" onClick={() => onWatch(activity)}>
          <img src={activity.image} alt={activity.imageAlt} />
          <span className="play">{m.film}</span>
        </button>
      ) : (
        <div className="shot still">
          <img src={activity.image} alt={activity.imageAlt} />
        </div>
      )}
      <div className="card-foot">
        <p className="meta">{activity.duration}</p>
        <h3>{activity.title}</h3>
        <p>{activity.blurb}</p>
        {activity.offers && (
          <ul className="offers">
            {activity.offers.map((offer) => (
              <li key={offer}>{offer}</li>
            ))}
          </ul>
        )}
        <button
          type="button"
          className={selected ? "mini on" : "mini"}
          aria-pressed={selected}
          onClick={() => toggleActivity(activity)}
        >
          {selected ? m.included : m.include}
        </button>
      </div>
    </article>
  );
}

export default function FlyerPage() {
  const [watching, setWatching] = useState<Activity | null>(null);
  const { m, categories } = useLocale();

  return (
    <div className="flyer">
      <section className="hero">
        <div className="hero-media">
          <img src="/photos/hero.jpg" alt={m.heroAlt} />
        </div>
        <div className="hero-copy">
          <p className="kicker">{m.heroKicker}</p>
          <h1>
            {m.heroTitle}
            <span>{m.heroItalic}</span>
          </h1>
          <p className="tags">{m.heroTags}</p>
          <p className="lede">{m.heroLede}</p>
          <div className="hero-actions">
            <Link className="solid" to="/book">
              {m.heroCta}
            </Link>
          </div>
        </div>
      </section>

      {categories.map((category) => (
        <section key={category.id} id={category.id} className={`band tone-${category.tone}`}>
          <header className="band-head">
            <div>
              <h2>{category.title}</h2>
              <p>{category.kicker}</p>
            </div>
            {category.points && (
              <ul>
                {category.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </header>
          <div className="grid">
            {category.activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} onWatch={setWatching} />
            ))}
          </div>
        </section>
      ))}

      <section className="promise">
        <h2>{m.promiseTitle}</h2>
        <ul>
          {m.promise.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link className="solid" to="/book">
          {m.promiseCta}
        </Link>
        <p className="promise-note">{m.footer}</p>
      </section>

      <VideoDialog activity={watching} onClose={() => setWatching(null)} />
    </div>
  );
}
