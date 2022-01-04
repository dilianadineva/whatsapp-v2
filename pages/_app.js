import "../styles/globals.css"
import { db, auth } from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import Login from "../components/Login"
import Loading from "../components/Loading"
import { useEffect } from "react"
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"

const MyApp = ({ Component, pageProps }) => {
	const [user, loading] = useAuthState(auth) //a real time listener function
	const usersCollectionRef = collection(db, "users")

	useEffect(() => {
		const setUser = async (user) => {
			await setDoc(
				doc(db, "users", user.email),
				{
					email: user.email,
					lastSeen: serverTimestamp(),
					photoURL: user.photoURL,
				},
				{ merge: true }
			)
		}
		if (user) {
			setUser(user)
		}
	}, [user]) //when user logs in or logs out

	if (loading) return <Loading />
	if (!user) return <Login />

	return <Component {...pageProps} />
}

export default MyApp
