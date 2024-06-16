import { Client } from '@notionhq/client';
import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export const notionClient = new Client({
  auth: process.env.NOTION_SECRET_KEY,
});

export const 데이터베이스메타정보가져오기 = async () => {
  const id = '';
  const response = await notionClient.databases.retrieve({
    database_id: id,
  });
  return response;
};

export const getQueryFromNotionDBbyId = async (dbid: string) => {
  const id = dbid;
  const response = await notionClient.databases.query({
    database_id: id,
  });

  return response;
};

export const retriveNotion = async () => {
  const response = await fetch('https://api.notion.com/v1/databases/');

  return response;
};

export const generateDTO = <T>(object: any) => {
  const { id, icon, properties, url: link } = object;

  return { id, icon, properties, link };
};

// type NotionDataBaseDTO<T> = {
//   id: string;
//   icon: DatabaseObjectResponse['icon'];
//   properties: Record<keyof T, T[keyof T] extends DatabasePropertyConfigResponse >;
//   link: string;
// };

// type BookResponseDto = {
//   title: DatabasePropertyConfigResponse;
// };
