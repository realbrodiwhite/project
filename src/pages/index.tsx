import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'

const MLTrainingDashboard = dynamic(
  () => process.env.USE_FINAL_DASHBOARD === 'true'
    ? import('../components/MLTrainingDashboardFinal')
    : import('../components/MLTrainingDashboard'),
  { ssr: false }
)

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>ML Training Tool</title>
        <meta name="description" content="ML Training Tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <MLTrainingDashboard />
      </main>
    </div>
  )
}

export default Home
