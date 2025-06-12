import LinkBackButton from "../../atoms/linkBackButton/linkBackButton";
import LanguageButton from "../../atoms/languageButton/languageButton"; 
import { flagEN, flagRS } from "../../../assets/icons";

type HeaderProps = {
  navigationBackText?: string;
  navigateBackUrl?: string;
};

const Header = ({ navigationBackText, navigateBackUrl }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-left">
        {navigationBackText && navigateBackUrl && (
          <LinkBackButton
            buttonText={navigationBackText}
            buttonUrl={navigateBackUrl}
          />
        )}
      </div>
      <div className="header-right">
        <LanguageButton
          flag={flagRS}
          language="RS"
          callback={() => console.log("Language changed to RS")}
        />
        <LanguageButton
          flag={flagEN}
          language="EN"
          callback={() => console.log("Language changed to EN")}
        />
      </div>
    </header>
  );
};

export default Header;
