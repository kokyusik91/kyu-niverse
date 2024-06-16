import { generateDTO, getQueryFromNotionDBbyId } from '../providers/notion';
import { SmallCardSlider } from './slidersmall';

export default async function BookContainer() {
  const dbId = process.env.NOTION_BOOK_DATABASE_ID;

  const data = await getQueryFromNotionDBbyId(dbId ?? 'ss');

  // PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse []
  const bookDataList = data.results;

  const cardList = bookDataList
    .map((item) => generateDTO(item))
    .map((book) => ({
      id: book.id,
      link: book.link,
      imageUrl: book.properties.image.files[0].file.url,
    }));

  return <SmallCardSlider data={cardList} />;
}
