import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categories, youtubeUrl, type Activity } from "../data/catalog";
import { useDraft } from "../draft";

function VideoDialog({
  activity,
  onClose,
}: {
  activity: Activity | null;
  onClose: () => void;
}) {
  const { isSelected } = useDraft();

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
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activity.videoId}?rel=0&start=${start}`}
            title={activity.videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="dialog-copy">
          <p className="eyebrow">{activity.duration}</p>
          <h2 id="video-title">{activity.title}</h2>
          <p>{activity.blurb}</p>
          <p className="film-name">Film: {activity.videoTitle}</p>
          <div className="dialog-actions">
            <Link className="solid" to={`/book?activity=${activity.id}`} onClick={onClose}>
              {selected ? "Open your day" : "Add to your day"}
            </Link>
            <a className="ghost" href={youtubeUrl(activity)} target="_blank" rel="noreferrer">
              Watch on YouTube
            </a>
            <button type="button" className="texty" onClick={onClose}>
              Close
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
  const selected = isSelected(activity.id);
  return (
    <article className="card">
      <button type="button" className="shot" onClick={() => onWatch(activity)}>
        <img src={activity.image} alt={activity.imageAlt} />
        <span className="play">Watch</span>
        <span className="cap">{activity.title}</span>
      </button>
      <div className="card-foot">
        <p>{activity.blurb}</p>
        <button
          type="button"
          className={selected ? "mini on" : "mini"}
          aria-pressed={selected}
          onClick={() => toggleActivity(activity)}
        >
          {selected ? "In your day" : "Add to day"}
        </button>
      </div>
    </article>
  );
}

export default function FlyerPage() {
  const [watching, setWatching] = useState<Activity | null>(null);

  return (
    <div className="flyer">
      <section className="hero">
        <img src="/photos/hero.jpg" alt="Praia da Marinha, limestone cliffs above a sandy cove" />
        <div className="hero-copy">
          <p className="kicker">Discover the</p>
          <h1>
            Best of the <span>Algarve!</span>
          </h1>
          <p className="tags">Adventure · Nature · Culture · Relaxation</p>
          <p className="lede">
            Unforgettable experiences for everyone. Watch a short film for each activity, then build
            the day — who is coming, and when.
          </p>
          <div className="hero-actions">
            <Link className="solid" to="/book">
              Plan your day
            </Link>
            <a className="ghost light" href="#horse">
              Horse riding is new
            </a>
          </div>
        </div>
        <p className="badge">
          Activities
          <strong>& tours on the Algarve coast</strong>
        </p>
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
        <h2>Make your holiday extraordinary</h2>
        <ul>
          <li>Experienced professionals</li>
          <li>Safe and reliable</li>
          <li>Flexible cancellation</li>
          <li>Activities for all ages</li>
        </ul>
        <Link className="solid" to="/book">
          Book the day
        </Link>
      </section>

      <VideoDialog activity={watching} onClose={() => setWatching(null)} />
    </div>
  );
}
