import { angleLeft } from "../../../assets/icons";

export default function LinkBackButton({ buttonText, buttonUrl }: { buttonText: string; buttonUrl: string }) {
    const navigateToUrl = () => {
        window.location.href = buttonUrl;
    };

    return (
        <button className="link-back-button" onClick={navigateToUrl}>
          <img className="link-back-ico" alt={buttonText} src={angleLeft} />
          <span className="link-back-text">{buttonText}</span>
        </button>

    );
}