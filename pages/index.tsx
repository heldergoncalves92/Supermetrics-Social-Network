import Head from 'next/head'
import Posts from '../components/Posts';

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* By default we open the posts page in the page number 1 */}
      <Posts page={1} />
    </>
  )
}
