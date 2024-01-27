import Post from "../Post/Post"

import axios, { AxiosError } from "axios"
import { apiPostsURL, channelsURL, apiUsersURL } from "../../URLs"

import { useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap"

import { concatNoDuplicates } from "@utils/arrayUtils"








export enum ReactionType {
    VeryLike = 'veryLike',
    Like = 'like',
    Dislike = 'dislike',
    VeryDislike = 'veryDislike',
    View = 'view',
    Default = 'none'
}








interface FeedProps {
    channelName?: string;

    postRepliesId?: string;
    handleNumberOfReplies?: (numberOfReplies: number) => void;

    userName?: string;
    visualizedImpression?: ReactionType;

    searchQuery?: string;
    searchRoute?: string;
}

/*
NON DICHIARATE INSIEME tutti i props non ha senso
vanno usati così:
    channelName                                oppure
    postRepliesId e handleNumberOfReplies      oppure
    userName e visualizedImpression            oppure
    searchQuery e searchRoute

    in searchRoute NON mettete la parte iniziale delle api dei post: /posts lo mette in automatico
*/
export default function Feed({channelName="", 
                    postRepliesId="", handleNumberOfReplies=()=>{}, 
                    userName="", visualizedImpression=ReactionType.Default,
                    searchQuery="", searchRoute=""
                } : FeedProps) {
    
    const [isLoading, setIsLoading] = useState(true)

    const [postList, setPostList] = useState<string[]>([]);

    const [nPages, setNPages] = useState(1)

    const [showMoreContentButtonInReplies, setShowMoreContentButtonInReplies] = useState(false)

    const loader = useRef(null)

    const fetchFeedALL = async () => {
        //const numberOfPosts = 5;
        const response = await axios.get(apiPostsURL+"/feed/"+nPages);
        if (response && response.status === 200) {
            const postList = response.data//.map((post: {_id: string}) => (post._id)) ho modificato l'api quindi manda direttamente l'array di id normali ora
            console.log("fetchFeedALL returns: ", postList)
            return postList
        }
        else return []
    }

    const fetchFeedFromChannel = async (channelName: string) => {
        const response = await axios.get(`${channelsURL}/${channelName}/${nPages}`)
        if (response && response.status === 200) return response.data
        else return []
    }

    //sarebbe bello tenere solo per le risposte il bottone e fare
    //una doppia richiesta: la seconda solo per sapere se ci sono altre risposte da caricare
    const fetchFeedFromPostReplies = async (postId: string) => {
        try {
            const response = await axios.get(`${apiPostsURL}/${postId}/replies/${nPages}`)
            // console.log("Feed postId ", postId, " replies: ", response?.data)
            if (response && response.status === 200) return response.data
            else return []
    
        } catch (error) {
            if (error instanceof Error && 'response' in error) {
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 404) {
                  console.log("Feed fetchFeedFromPostReplies 404 con postId ", postId);
                } else {
                  throw error;
                }
              }
              return []
        }
    }

    const thereAreMoreReplies = async (postId: string) => {
        //semplicemente guarda la pagina successiva, se è vuota non ci sono altre risposte
        try {
            const response = await axios.get(`${apiPostsURL}/${postId}/replies/${nPages+1}`)
            if (response && response.status === 200) return response.data.length > 0
            else return false
    
        } catch (error) {
            if (error instanceof Error && 'response' in error) {
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 404) {
                  console.log("Feed fetchFeedFromPostReplies 404 con postId ", postId);
                } else {
                  throw error;
                }
              }
              return false
        }
    }

    const fetchFeedFromUserImpressions = async (userName: string, visualizedImpression: ReactionType) => {
        if (visualizedImpression === ReactionType.Default) return []
        const response = await axios.get(`${apiUsersURL}/${userName}/impressions/${visualizedImpression}s/${nPages}`)
        console.log("Feed fetchFeedFromUserImpressions response.data", response?.data)
        if (response && response.status === 200) return response.data
        else return []
    }

    const fetchFeedFromSearchQuery = async (query: string, searchRoute: string) => {
        if (!searchRoute) return []
        
        let postIds = []
        if (searchRoute[0] !== "/") searchRoute = "/"+searchRoute
        if (searchRoute[searchRoute.length - 1] !== "/") searchRoute = searchRoute + "/"
        try {
            postIds = await axios.get(`${apiPostsURL}${searchRoute}${query}/${nPages}`)
            .then(response => response.data)
            return postIds
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                //se la richiesta di ricerca non dovesse esistere col sistema di pagine, assorbo l'errore e faccio una richiesta normale con tutti i post in un colpo solo
                if (error.response.status === 404 && error.response.data.includes("Cannot GET")) {
                    console.log(`la richiesta ${apiPostsURL}${searchRoute}${query}/${nPages} non va bene. procedo con la richiesta senza pagine`)
                    postIds = await axios.get(`${apiPostsURL}${searchRoute}${query}`)
                    .then(response => response.data)
                    return postIds
                }
            }
            console.log(`Feed fetchFeedFromSearchQuery error in request: ${apiPostsURL}${searchRoute}${query}: `, error)
        }
        return []
    }



    useEffect(() => {
        const fetchPosts = async () => {
            let postIdsList: string[] = []

            if (userName) {
                postIdsList = await fetchFeedFromUserImpressions(userName, visualizedImpression)
            }

            else if (postRepliesId) {
                postIdsList = await fetchFeedFromPostReplies(postRepliesId)
                setShowMoreContentButtonInReplies(await thereAreMoreReplies(postRepliesId))
            }

            else if (searchQuery) {
                postIdsList = await fetchFeedFromSearchQuery(searchQuery, searchRoute)
            }

            switch(channelName) {
                case "":
                    break
                case "ALL":
                    postIdsList = await fetchFeedALL()
                    break
                default:
                    postIdsList = await fetchFeedFromChannel(channelName)
            }
            //console.log("Feed useEffect postIdsList: ", postIdsList)
            setPostList(concatNoDuplicates(postList, postIdsList))
        }
        fetchPosts()
    }, [channelName, searchQuery, nPages])
    //ho aggiunto channelName qua perchè così quando passi da una pagina /channels/canale1 a /channels/canale2 carica effettivamente il feed. altrimenti rimane bloccato al primo (usando useNavigate)

    //le impressioni hanno uno useeffect a parte perchè così quando nella stessa pagina cambio col tasto l'impressione da vedere resetta i post. altrimenti dava un bug dove rimanevano e quelli nuovi venivano aggiunti invece che sostituiti
    useEffect(() => {
        const fetchPosts = async () => {
            setPostList([])  //questo serve per il feed utente, senza, se cambio visualizedImpression da fuori con uno stato, i post renderizzati qua non vengono cancellati
            let postIdsList: string[] = []
            if (userName) {
                //console.log("Feed dentro useEffect if(userName) userName: ", userName)
                postIdsList = await fetchFeedFromUserImpressions(userName, visualizedImpression)
            }
            if (userName) setPostList([])  //questo serve per il feed utente, senza, se cambio visualizedImpression da fuori con uno stato, i post renderizzati qua non vengono cancellati
            setPostList(postIdsList)
        }
        fetchPosts()
    }, [visualizedImpression])


    //useeffect di DEBUG
    useEffect(() => {
        //console.log("Feed postList: ", postList)
        handleNumberOfReplies(postList.length) //ma perchè questo dovrebbe essere di debug???? non ricordo più aiuto
        //console.log("Feed postList.length: ", postList.length, " ", channelName, postRepliesId, userName)
    }, [postList])


    //useEffect per lo scroll infinito
    useEffect(() => {
        if (!isLoading) {
            const options = {
                root: null,
                rootMargin: "20px",
                threshold: 1.0
            };
            
            const observer = new IntersectionObserver(handleObserver, options);
            if (loader.current) {
                observer.observe(loader.current)
            }
        }
      }, [isLoading]);
    
    const handleObserver = (entities: any) => {
        const target = entities[0];
        if (target.isIntersecting) { 
            console.log("in fondo alla pagina")  
            setNPages(nPages => nPages + 1)
        }
    }

    //useEffect per evitare che consideri che l'utente sta in fondo alla pagina quando ancora deve finire di caricare i post
    useEffect(() => {
        if (postList.length > 0) setIsLoading(false)
    }, [postList])
    

    
    return (
        <>
           {
            postList && postList.map((postId: string) => {
                //console.log("Feed postList.map postId: ", postId);
                return <Post key={postId} postId={postId} />;
            })
           }

           {
           postRepliesId && showMoreContentButtonInReplies ? 
           (
           <Button onClick={() => setNPages(nPages => nPages + 1)}>{postRepliesId ? "Mostra altre risposte" : "Carica altri post"}</Button>
           ) :
           ( !postRepliesId ? 
            (
                <div ref={loader} className="mt-5">
                    <p>fondo della pagina</p> 
                    {/* qua ci si può mettere qualcosa per far vedere che si è arrivati in fondo alla pagina. 
                    ma sinceramente lo lascerei vuoto perchè rischiamo di mettere uno spinner che va 
                    all'infinito visto che non ci sono controlli per ora che ti dicono se i post 
                    (a parte le risposte) sono finiti o no */}
                    {/* ALLORA pare che se tolgo il p non funziona bene. ho provato con className mt-5
                    nel div col ref ma con la p funziona meglio. non capisco. non so che dire.
                    magari ci metto un disegnino che ne so */}
                </div>
            ) :
            (
                <></>
            ) 
           )
           }
        </>
    )
}


