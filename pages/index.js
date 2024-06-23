import Head from 'next/head'
import AdminInterface from '../components/AdminInterface'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Eco Ops Admin Dashboard</title>
        <meta name="description" content="Admin interface for Eco Ops" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <AdminInterface />
      </main>
    </div>
  )
}

