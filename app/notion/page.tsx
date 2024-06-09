import {
  데이터베이스메타정보가져오기,
  데이터베이스쿼리조회,
} from '../providers/notion';

export default async function NotionPage() {
  const data = await 데이터베이스쿼리조회();
  const results = data.results;

  return (
    <main>
      <h1 className='text-black'>왜 안나오노?</h1>
      <ul>
        {results.map((item) => (
          <li key={item.id} className='text-black'>
            <a className='text-black' href={item.url}>
              {/* {item.properties.Project.title[0].plain_text} */}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
