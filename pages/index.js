import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whatsapp 2.0</title>
        <meta name="description" content="Whatsapp 2.0 react js clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

       <Sidebar />
    </div>
  )
}
