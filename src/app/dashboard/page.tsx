"use client"
import  styles  from "./styles.module.css";
import Head from "next/head";
import { Textarea } from "@/components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, FormEvent, useState } from "react";
import { db } from "@/services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";

interface HomeProps {
    user: {
        email: string;
    }
}

export default function Dashboard({user}: HomeProps) {
    const [input, setInput] = useState("")
    const [publicTask, setPublicTask] = useState(false)

    function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
        setPublicTask(e.target.checked)
    }

    async function handleRegisterTask(e: FormEvent) {
        e.preventDefault();

        if (input === "") return;

        
        try {

            if (!user || !user.email) {
                console.error("Faça login");
                return;
            }
            
            await addDoc(collection(db, "tarefas"), {
                tarefa: input,
                user: user?.email,
                public: publicTask,
                created: new Date(),
            });

            setInput("");
            setPublicTask(false);

            } catch (err) {
            console.log(err);
            }   
    }


    return(
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual sua tarefa?</h1>
                        
                        <form onSubmit={handleRegisterTask}>
                            <Textarea 
                                placeholder="Digite aqui sua nova tarefa..."
                                value={input}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                            />
                            <div className={styles.checkBoxArea}>
                                <input 
                                    type="checkbox" 
                                    className={styles.checkbox} 
                                    checked={publicTask}
                                    onChange={handleChangePublic}
                                />
                                <label>Deixar publica?</label>
                            </div>

                            <button type="submit" className={styles.button}>Registrar</button>
                        </form>
                    </div>
                </section>


                <section className={styles.taskContainer}>
                    <h1>Minhas tarefas</h1>

                    <article className={styles.task}>

                        <div className={styles.tagContainer}>
                            <label className={styles.tag}>PUBLICO</label>
                            <button className={styles.shareButton}>
                                <FiShare2 size={22} color="#3183ff" />
                            </button>
                        </div>

                        <div className={styles.taskContent}>
                            <p>Minha primeira tarefa</p>
                            <button className={styles.trashButton}>
                                <FaTrash size={24} color="#ea3140"/>
                            </button>

                        </div>

                    </article>

                </section>
            </main>
        </div>
    )
}