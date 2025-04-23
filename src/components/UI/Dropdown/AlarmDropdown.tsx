import styles from "./dropdown.module.css";
import Dropdown from "./components";
import AlaramIcon from "@/assets/icons/alarm_icon.svg?react";

const AlarmDropdown = () => {
  return (
    <>
      <Dropdown.Root>
        <Dropdown.Trigger className={styles.trigger}>
          <AlaramIcon className={styles.icon} />
          <span className={styles.badge}>3</span>
        </Dropdown.Trigger>
        <Dropdown.Content className={styles.dropdown_content}>
          <ul className={styles.dropdown_container}>
            <li className={styles.item}>
              <div className={styles.dot}></div>
              <p className={styles.text}>
                <span className={styles.sender}>OOO</span> 님으로부터 메시지가
                도착하였습니다.
              </p>
            </li>
            <li className={styles.item}>
              <div className={styles.dot}></div>
              <p className={styles.text}>
                <span className={styles.sender}>OOO</span> 님으로부터 메시지가
                도착하였습니다.
              </p>
            </li>
            <li className={styles.item}>
              <div className={styles.dot}></div>
              <p className={styles.text}>
                <span className={styles.sender}>OOO</span> 님으로부터 메시지가
                도착하였습니다.
              </p>
            </li>
            <li className={styles.item}>
              <div className={styles.dot}></div>
              <p className={styles.text}>
                <span className={styles.sender}>OOO</span> 님으로부터 메시지가
                도착하였습니다.
              </p>
            </li>
            <li className={styles.item}>
              <div className={`${styles.dot} ${true && styles.read}`}></div>
              <p className={styles.text}>
                <span className={styles.sender}>OOO</span> 님으로부터 메시지가
                도착하였습니다.
              </p>
            </li>
          </ul>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
};

export default AlarmDropdown;
