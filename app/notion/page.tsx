import {
  DatabaseObjectResponse,
  FilesPropertyItemObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { generateDTO, getQueryFromNotionDBbyId } from '../providers/notion';

export default async function NotionPage() {
  const dbId = process.env.NOTION_BOOK_DATABASE_ID;

  const data = await getQueryFromNotionDBbyId(dbId ?? 'ss');

  // PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse []
  const bookDataList = data.results;

  const bookList = bookDataList.map((item) =>
    generateDTO(item as DatabaseObjectResponse)
  );

  const imageList = bookList.map((book) => book.properties.image);
  // const fileList = imageList
  //   .map((item) => item.files)
  //   .flat()
  //   .map((file) => file.file.url);
  return (
    <main>
      <h1 className='text-black'>왜 안나오노?</h1>
      <ul></ul>
    </main>
  );
}
