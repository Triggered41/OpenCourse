import styles from './InputField.module.css'

export const onFieldChange = (val, set, ref, button) => {
    set(val)
    if (val == ''){
        ref.current.classList.remove(styles.Filled)
    }else{
        ref.current.classList.add(styles.Filled)
    }
    if (button){
        button.current.disabled = false;
    }
}