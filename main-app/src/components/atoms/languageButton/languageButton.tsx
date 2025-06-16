export default function LanguageButton({ flag, language, callback }: { flag: string; language: string; callback: () => void }) {
    return (
        <button className="language-button" onClick={callback}>
          <img className="language-ico" alt={language} src={flag} />
          <span className="language-text">{language}</span>
        </button>
    )
}