import styles from "@/app/page.module.css";

export default async function Home() {
    return (
        <div className={styles.page}>
            <p className={styles.title}>Subpage</p>
        </div>
    );
}