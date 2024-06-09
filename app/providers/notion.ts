import { Client } from '@notionhq/client';

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

export const 데이터베이스쿼리조회 = async (dbid: string) => {
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
