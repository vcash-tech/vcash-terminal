export default function LanguageButton({ 
  flag, 
  language, 
  callback, 
  active = false 
}: { 
  flag: string; 
  language: string; 
  callback: () => void;
  active?: boolean;
}) {
    return (
        <button 
          className={`language-button ${active ? 'active' : ''}`} 
          onClick={callback}
        >
          <img className="language-ico" alt={language} src={flag} />
          <span className="language-text">{language}</span>
        </button>
    )
}