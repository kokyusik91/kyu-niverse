import { BOOK_LIST } from "../constants/books";
import {
  getClientDtoFromNotionAPI,
  getQueryFromNotionDBbyId,
} from "../providers/notion";
import { SmallCardSlider } from "./slider/slidersmall";

export default async function BookContainer() {
  const data = await getQueryFromNotionDBbyId(
    process.env.NOTION_BOOK_DATABASE_ID ?? "",
  );

  // PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse []
  const bookDataList = data.results;

  // TODO: 타입 보장되도록 타입 선언해야함.
  const cardList = bookDataList
    .map((item) => getClientDtoFromNotionAPI(item))
    .map((book) => ({
      id: book.id,
      link: book.link,
      imageUrl: BOOK_LIST[book.properties.subtitle.rich_text[0].plain_text],
    }));

  return <SmallCardSlider data={cardList} />;
}
