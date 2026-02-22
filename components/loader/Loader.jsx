import styles from './Loader.module.css'

export default function Loading() {
    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
            <p>LOADING...</p>
        </div>
    );
}