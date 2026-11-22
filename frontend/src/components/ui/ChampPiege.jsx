// Anti-robots : champ invisible pour les visiteurs, que seuls les robots remplissent.
// Hors écran (pas display:none, que certains robots repèrent), ignoré par le clavier et les lecteurs d'écran.
export default function ChampPiege({ value, onChange }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Votre site web
        <input type="text" name="site_web" tabIndex={-1} autoComplete="off" value={value} onChange={e => onChange(e.target.value)} />
      </label>
    </div>
  )
}
