import { DescriptionProps } from "../types";
import styles from "./default.module.css";
import SuccessIcon from "@/assets/icons/success.svg?react";
import ErrorIcon from "@/assets/icons/error.svg?react";
import InfoIcon from "@/assets/icons/info.svg?react";

const mapTypeToIcon = {
  INFO: InfoIcon,
  SUCCESS: SuccessIcon,
  ERROR: ErrorIcon,
  NONE: null,
};

const Description = ({ children, type = "INFO" }: DescriptionProps) => {
  const IconComponent = mapTypeToIcon[type];
  return (
    <div className={styles.toast_description}>
      {IconComponent && (
        <div className={styles.toast_icon}>
          <IconComponent />
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Description;
