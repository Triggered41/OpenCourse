import styles from './Tooltip.module.css';

export function Tooltip({isFocused, rules}: {isFocused: boolean, rules: Array<boolean>}) {
    return ( 
        <div className={styles.Tooltip}>
            { !rules[5] &&
                <div className={`${styles.Tips} ${isFocused ? styles.Focused: ''}`}>
                    {!rules[0] && <p>Minimum 8 character</p>}
                    {!rules[1] && <p>1 lower case letter</p>}
                    {!rules[2] && <p>1 upper case letter</p>}
                    {!rules[3] && <p>Contains a number</p>}
                    {!rules[4] && <p>Contains an special character</p>}
                </div>
            }
        </div>
    )
}