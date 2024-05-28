"use client"
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { Textarea } from "../textarea";
import styles from "./styles.module.css";
import { useSession } from "next-auth/react";
import { collection, addDoc, getDocs, where, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";
import { FaTrash } from "react-icons/fa";

interface CommentsProps {
    taskId: string;
}

interface CommentsInputProps {
    id: string;
    comment: string;
    taskId: string;
    user: string;
    name: string;
  }

export default function Comments({ taskId }: CommentsProps) {
    const {data: session} = useSession()
    const [input, setInput] = useState("")
    const [allComments, setAllComments] = useState<CommentsInputProps[]>([]);

    useEffect(() => {
        async function loadComments() {
          const q = query(collection(db, "comments"), where("taskId", "==", taskId));
          const snapshotComments = await getDocs(q);
    
          let commentsList: CommentsInputProps[] = [];
          snapshotComments.forEach((doc) => {
            commentsList.push({
              id: doc.id,
              comment: doc.data().comment,
              user: doc.data().user,
              name: doc.data().name,
              taskId: doc.data().taskId
            });
          });
    
          setAllComments(commentsList);
        }
    
        if (taskId) {
          loadComments();
        }
      }, [taskId]);
    
    
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if(input === "") return;

        if(!session?.user?.email || !session?.user?.name) return;

        try{
            await addDoc(collection(db, "comments"), {
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: taskId,
            });

            setInput("")

            const q = query(collection(db, "comments"), where("taskId", "==", taskId));
            const snapshotComments = await getDocs(q);

            let commentsList: CommentsInputProps[] = [];
            snapshotComments.forEach((doc) => {
              commentsList.push({
                id: doc.id,
                comment: doc.data().comment,
                user: doc.data().user,
                name: doc.data().name,
                taskId: doc.data().taskId
              });
            });
      
            setAllComments(commentsList);

        } catch (err) {
            console.log(err)
        }   

    }

    async function handleDeleteComments(commentId: string) {
        try {
            const docRef = doc(db, "comments", commentId)
            await deleteDoc(docRef)

            const deleteComment = allComments.filter( (comment) => comment.id !== commentId )
            setAllComments(deleteComment)
        } catch (err) {
            console.log(err);
        }
    }

    return(
        <div className={styles.container}>
            <section>
                <h2>Comentar</h2>

                <form onSubmit={handleSubmit}>
                    <Textarea 
                    value={input}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                    placeholder="Digite um comentário..."
                    />

                    <button 
                    disabled={!session?.user} 
                    className={styles.button}>
                        Enviar comentário
                    </button>
                </form>
            </section>


            <section>
                <h2>Todos os comentários</h2>
                {allComments.length === 0 && (
                    <span>Nenhum comentário foi encontrado...</span>
                )}

                 {allComments.map((comment) => (
                    <article key={comment.id} className={styles.comment}>
                        <div className={styles.headComment}>
                            <label className={styles.commentsLabel}>{comment.name}</label>
                            {comment.user === session?.user?.email && (
                                <button className={styles.buttonTrash} onClick={() => handleDeleteComments(comment.id)}>
                                    <FaTrash size={18} color="#EA3140" />
                                </button>
                            )}
                        </div>
                        <p>{comment.comment}</p>
                    </article>
          ))}
            </section>
        </div>
    )
}