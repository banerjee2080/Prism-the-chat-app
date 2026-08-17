/**
 * Slow-drifting light that lives behind every glass surface. Without it the
 * blur has nothing to refract and the panels read as flat grey cards.
 */
const AmbientBackground = () => (
  <div className="ambient" aria-hidden="true">
    <div className="ambient-orb ambient-orb--a" />
    <div className="ambient-orb ambient-orb--b" />
    <div className="ambient-orb ambient-orb--c" />
    <div className="ambient-grain" />
  </div>
);

export default AmbientBackground;
