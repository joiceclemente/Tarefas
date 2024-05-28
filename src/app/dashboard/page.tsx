"use client"
import  styles  from "./styles.module.css";
import Head from "next/head";
import { Textarea } from "@/components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { db } from "@/services/firebaseConnection";
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

interface TaskProps {
    id: string;
    created: Date;
    public: boolean;
    tarefa: string;
    user: string;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [input, setInput] = useState("")
    const [publicTask, setPublicTask] = useState(false)
    const [tasks, setTasks] = useState<TaskProps[]>([])

    useEffect(() => {
        if(!session?.user?.email) return;

        async function loadTarefas() {
            
            const tarefasRef = collection(db, "tarefas")
            const q = query (
                tarefasRef,
                orderBy("created", "desc"),
                where("user", "==", session?.user?.email)
            )

            onSnapshot(q, (snapshot) => {
                let lista = [] as TaskProps[];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        tarefa: doc.data().tarefa,
                        created: doc.data().created,
                        user: doc.data().user,
                        public: doc.data().public,
                    })
                })

                setTasks(lista);
            });
        }

        loadTarefas()
    }, [session?.user?.email])


    function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
        setPublicTask(e.target.checked)
    }

    async function handleRegisterTask(e: FormEvent) {
        e.preventDefault();

        if (input === "") return;

        if (status !== "authenticated") {
            signIn();
            return;
          }

        
        try {
            await addDoc(collection(db, "tarefas"), {
                tarefa: input,
                user: session?.user?.email,
                public: publicTask,
                created: new Date(),
            });

            setInput("");
            setPublicTask(false);

            } catch (err) {
            console.log(err);
            }   
    }

    if (status === "loading") {
        return <div>Carregando...</div>;
      }
    
      if (status === "unauthenticated") {
        signIn();
        return null;
      }

      async function handleShare(id: string) {
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_URL}/task/${id}`
        );
        alert("Url copiada com sucesso")
      }

      async function handleDeleteTask(id: string) {
        const docRef = doc(db, "tarefas", id)
        await deleteDoc(docRef)
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

                    {tasks.map((item) => (
                        <article key={item.id} className={styles.task}>

                            {item.public && (
                                <div className={styles.tagContainer}>
                                <label className={styles.tag}>PUBLICO</label>
                                <button className={styles.shareButton} onClick={() => handleShare(item.id)}>
                                    <FiShare2 size={22} color="#3183ff" />
                                </button>
                            </div>
                            )}
                        
                             <div className={styles.taskContent}>
                                {item.public ? (
                                    <Link href={`/task/${item.id}`}>
                                    <p>{item.tarefa}</p>
                                    </Link>
                                ) : (
                                    <p>{item.tarefa}</p>
                                )}
                                <button className={styles.trashButton} onClick={() => handleDeleteTask(item.id)}>
                                    <FaTrash size={24} color="#ea3140"/>
                                </button>
                        
                            </div>
                        
                        </article>
                    ))}

                </section>
            </main>
        </div>
    )
}