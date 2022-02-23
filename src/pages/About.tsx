import { useInitialData } from 'hooks/use-initial-data'
import './Home.css'

const About: SSRPage<{ data: { text: string } }> = (props) => {
  if (!props.loaded) {
    return <span>Loading Data...</span>
  }
  const { data } = useInitialData()
  return (
    <>
      <h1>About</h1>
      <p>initialData: {data.username}</p>
      <article>{props.data.text}</article>
    </>
  )
}

About.loadData = async function (ctx) {
  return {
    data: {
      text: 'This is about page.',
    },
  }
}

export default About
