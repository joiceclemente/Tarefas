import styles from "./page.module.css";
import Head from "next/head";
import Image from "next/image";
import task from "../../public/assets/task.png"
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

async function fetchData() {
  const commentRef = collection(db, "comments");
  const postRef = collection(db, "tarefas");

  const commentSnapshot = await getDocs(commentRef);
  const postSnapshot = await getDocs(postRef);

  return {
    posts: postSnapshot.size || 0,
    comments: commentSnapshot.size || 0,
  };
}

export default async function Home() {
  const data = await fetchData();

  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image 
            className={styles.task}
            alt="Logo Tarefas+"
            src={task}
            priority
          />
        </div>

        <h1 className={styles.title}>
          Sistema feito para você organizar <br />
          seus estudos e tarefas
       </h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{data.posts} posts</span>
          </section>
          <section className={styles.box}>
            <span>+{data.comments} comentarios</span>
          </section>
        </div>

      </main>

    </div>
  );
}

