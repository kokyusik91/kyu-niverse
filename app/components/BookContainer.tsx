import { generateDTO, getQueryFromNotionDBbyId } from '../providers/notion';
import { SmallCardSlider } from './slidersmall';

export default async function BookContainer() {
  const dbId = process.env.NOTION_BOOK_DATABASE_ID;

  const data = await getQueryFromNotionDBbyId(dbId ?? 'ss');

  // PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse []
  const bookDataList = data.results;

  const bookList = bookDataList.map((item) => generateDTO(item));

  const imageList = bookList.map((book) => book.properties.image);
  const fileList = imageList
    .map((item) => item.files)
    .flat()
    .map((file) => file.file.url);
  return <SmallCardSlider data={fileList} />;
}
