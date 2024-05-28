import Head from "next/head";
import styles from "../styles.module.css";
import { db } from "@/services/firebaseConnection";
import {doc, getDoc} from "firebase/firestore";
import Comments from "@/components/coments";

interface TaskProps {
    params: {
      id: string;
    };
  }

export default async function Task({params}: TaskProps) {

    const docRef = doc(db, "tarefas", params.id);
    const snapshot = await getDoc(docRef);

    if(snapshot.data() === undefined) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    if(!snapshot.data()?.public) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    const task = snapshot.data();

    return (
        <div className={styles.container}>
            <Head>
                <title>Detalhes da  tarefa</title>
            </Head>

            <main className={styles.main}>
                <h1>Tarefa</h1>
                <article className={styles.task}>
                    <p>{task?.tarefa}</p>

                </article>
            </main>

            <section className={styles.comentsContainer}>
                <Comments taskId={params.id}/>
            </section>
        </div>
    );
}